'use server';
import {z} from 'zod'; //helps in form validation
// import { Pool } from 'pg';
import { pool } from 'dbConfig';
import {revalidatePath} from 'next/cache';//clearing the cache and trigger a new request to the server
import {redirect} from 'next/navigation';
// import './envConfig.ts';

// export default ({
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL!,
//   },
// })

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });


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

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status} = CreateInvoice.parse ({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    
    });
    const amountInCents = amount * 100;
    const date =  new Date().toISOString().split('T')[0]; 

    try{
    await pool.query (`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES ( $1, $2, $3, $4)`,
    [customerId, amountInCents, status, date]

);
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice',
        };
    }
    console.log(CreateInvoice);

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}


// export async function updateInvoice(id: string, prevState: State, formData: FormData,) {

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status} = UpdateInvoice.parse ({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    
    });
    const amountInCents = amount * 100;
    const date =  new Date().toISOString().split('T')[0]; 
    
    try{
    await pool.query (`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES ( $1, $2, $3, $4)`,
    [customerId, amountInCents, status, date]

);
    }catch(error){
      return {message:'Database error:Failed to Update Invoice'};
    }
    // console.log(UpdateInvoice);
    
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice');
    try{
    await pool.query (`
        DELETE FROM invoices WHERE id =$1`, [id] ); 
    }catch(error) {
            return{message: 'Database Error:Failed to delete Invoice'};
        }
       
        console.log(deleteInvoice);
        // revalidatePath('/dashboard/invoices');

    
}


