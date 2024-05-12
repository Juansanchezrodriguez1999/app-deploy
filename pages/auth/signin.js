import { useEffect, useState } from 'react';

import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Image from 'next/image';
import Footer from '@/components/Footer';
import CustomHeader from '@/components/CustomHeader';

const signInErrors = {
  Signin: 'Try signing in with a different account.',
  OAuthSignin: 'Try signing in with a different account.',
  OAuthCallback: 'Try signing in with a different account.',
  OAuthCreateAccount: 'Try signing in with a different account.',
  EmailCreateAccount: 'Try signing in with a different account.',
  Callback: 'Try signing in with a different account.',
  OAuthAccountNotLinked: 'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'The e-mail could not be sent.',
  CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
  default: 'Unable to sign in.',
};

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    let { successfulLogin } = router.query;
    if (successfulLogin === 'true') {
      router.replace('/auth/signin', undefined, { shallow: true });
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (credentials) => {
    setLoading(true)
    await signIn('credentials', {
      redirect: false,
      ...credentials,
    }).then((res) => {
      if (!res.ok) {
        setLoading(false)
        toast.error(signInErrors[res.error]);
      } else {
        Router.push(router.query?.callbackUrl || '/');
        setLoading(false)
      }
    });
  };
  return (
    <div className='x-auto grid place-items-center grid'>
      <div className="min-h-screen max-w-4xl shadow-md  w-full overflow-x-auto ">
        <CustomHeader title={"Technical Test - Login"} principal={"Login"} />
        <main className="mx-auto mt-10 max-w-lg mb-10 px-4 sm:px-6 md:px-8">
          <div className="w-full border p-4 rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
            <div className="space-y-4  sm:p-2 md:space-y-6">
              <div className=' justify-center flex mt-4'>
                <Image src="/logo.png" width={100} height={100} alt="A-SAFE Digital logo" />
              </div>
              {loading ? (
                <div className="text-center">
                  <div role="status">
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )
                :
                (
                  <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-center text-4xl text-asafe_turquoise">Log in</h1>

                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-bold text-gray-900 dark:text-white">
                        E-mail address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="john.doe@company.com"
                        {...register('email', { required: 'Please enter your email address' })}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-900 dark:text-white">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="•••••••••"
                        {...register('password', { required: 'Please enter your password' })}
                      />
                      {errors.password && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password.message}</p>
                      )}
                    </div>
                    <div className='flex items-center justify-center'>
                      <button
                        id="submit"
                        type="submit"
                        className="w-1/2 rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Sign in
                      </button>
                    </div>

                    <div className='flex justify-center items-center'>
                      Do not have an account?
                      <Link href="/auth/signup">
                        <a className="underline ml-1">Sign up</a>
                      </Link>
                    </div>
                  </form>
                )
              }
            </div>
          </div>
        </main>
      </div>      
      <Footer />
    </div>
  );
}