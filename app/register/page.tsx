import { SignUp } from '@stackframe/stack';
// import RegisterForm from '@/app/ui/register-form';
import RegisterForm from '@/app/ui/register-form';
import AcmeLogo from "../ui/acme-logo";

export default function RegisterPage() {

  return (
    <main className="flex items-center justify-center md:h-screen mt-8">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
            <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
                <div className="w-32 text-white md:w-36">
                    <AcmeLogo />
                </div>
            </div>
            <RegisterForm />
        </div>
    </main>
);
}
//   return (
//     <div>
//       <h1>Sign Up</h1>
//       <SignUp
//         fullPage={true}
//         automaticRedirect={true}
//         firstTab='password'
//         extraInfo={<>By signing up, you agree to our <a href="/terms">Terms</a></>}
//       />
//     </div>
//   );
// }
