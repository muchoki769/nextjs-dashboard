import NextAuth from "next-auth";
import {authConfig} from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import {z} from 'zod';
import { pool } from 'dbConfig';
import postgres from 'postgres';
import type {User} from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
// import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});


async function getUser(email: string): Promise<User | undefined> {
    try {
      const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
      return user[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }

// async function getUser(email:string): Promise<User | undefined> {
//     try{
//         const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
//         // if (result.rows.length >0) {
//         //     return result.rows[0];
//         // }else{
//         //     return undefined;
//         // }
//         return result.rows.length > 0 ? result.rows[0] : undefined;
//         // const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
//         // return user[0];
//         // const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
//         // return user.rows[0];

//     }catch (error){
//         console.error('Failed to fetch user:',error);
//         throw new Error('Failed to fetch user');
//     }
// }

export const {auth, signIn, signOut}=NextAuth({
    ...authConfig,
    providers: [
        Credentials({
        async authorize(credentials){
            const parsedCredentials = z
            .object({email: z.string().email(),password: z.string().min(6)})
            .safeParse(credentials);

            if (parsedCredentials.success){
                const {email, password} = parsedCredentials.data;
                const user = await getUser(email);
                if (!user) return null;
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) return user;
            }
            console.log('Invalid credentials');
            return null;
        },
    }),
],
});