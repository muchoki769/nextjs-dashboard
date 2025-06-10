'use server';
import {z} from 'zod'; //helps in form validation
// import { Pool } from 'pg';
import postgres from 'postgres';
// import { pool } from 'dbConfig';
import {revalidatePath} from 'next/cache';//clearing the cache and trigger a new request to the server
import {redirect} from 'next/navigation';
import {signIn} from '@/auth';
import {AuthError} from 'next-auth';


// import './envConfig.ts';

// export default ({
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL!,
//   },
// })

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(), //meaning it can change from a string to a number
    // paymentMethod: z.string(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});
const CreateInvoice = FormSchema.omit({ id: true, date:true});
const UpdateInvoice = FormSchema.omit({ id: true, date: true });





// export async function createInvoice(formData: FormData) {
//     const { customerId, amount, status} = CreateInvoice.parse ({
//         customerId: formData.get('customerId'),
//         amount: formData.get('amount'),
//         status: formData.get('status'),
    
//     });
//     const amountInCents = amount * 100;
//     const date =  new Date().toISOString().split('T')[0]; 

//     try{
//     await pool.query (`
//     INSERT INTO invoices (customer_id, amount, status, date)
//     VALUES ( $1, $2, $3, $4)`,
//     [customerId, amountInCents, status, date]

// );
//     } catch (error) {
//         return {
//             message: 'Database Error: Failed to Create Invoice',
//         };
//     }
//     console.log(CreateInvoice);

//     revalidatePath('/dashboard/invoices');
//     redirect('/dashboard/invoices');
// }


// // export async function updateInvoice(id: string, prevState: State, formData: FormData,) {

// export async function updateInvoice(id: string, formData: FormData) {
//     const { customerId, amount, status} = UpdateInvoice.parse ({
//         customerId: formData.get('customerId'),
//         amount: formData.get('amount'),
//         status: formData.get('status'),
    
//     });
//     const amountInCents = amount * 100;
//     const date =  new Date().toISOString().split('T')[0]; 
    
//     try{
//     await pool.query (`
//     INSERT INTO invoices (customer_id, amount, status, date)
//     VALUES ( $1, $2, $3, $4)`,
//     [customerId, amountInCents, status, date]

// );
//     }catch(error){
//       return {message:'Database error:Failed to Update Invoice'};
//     }
//     // console.log(UpdateInvoice);
    
//     revalidatePath('/dashboard/invoices');
//     redirect('/dashboard/invoices');
// }

// export async function deleteInvoice(id: string) {
//     // throw new Error('Failed to Delete Invoice');
//     try{
//     await pool.query (`
//         DELETE FROM invoices WHERE id =$1`, [id] ); 
//     }catch(error) {
//             return{message: 'Database Error:Failed to delete Invoice'};
//         }
       
//         console.log(deleteInvoice);
//         // revalidatePath('/dashboard/invoices');

    
// }

// export  async function authenticate (
//     prevState: string | undefined,
//     formData: FormData
// ){
//     try{
//         await signIn('credentials', formData);
//     }catch(error){
//         if (error instanceof AuthError) {
//             switch (error.type) {
//                 case 'CredentialsSignin':
//                     return 'Invalid credentials';
//                     default:
//                         return 'Something went wrong.';

//             }
//         }
//         throw error;
//     }
// }






export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };
  
  export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
  
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
  
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
  
    // Insert data into the database
    try {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
       console.error('Create Invoice Error:', error);
      // If a database error occurs, return a more specific error.
      return {
        error: 'Database Error: Failed to Create Invoice.',
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
  
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }
  
  export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
  ) {
    const validatedFields = UpdateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }
  
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
  
    try {
      await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
    } catch (error) {
       console.error('Updating Invoice Error:', error);
      return {
        error:'Database Error: Failed to Update Invoice.',
         message: 'Database Error: Failed to Update Invoice.' };
    }
  
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }
  
  export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  }
  
  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }

//   export async function registerUser(
//     prevState: string | undefined,
//     formData: FormData
//   ) {
//     return await registerUser(prevState, formData);
  
// }
  