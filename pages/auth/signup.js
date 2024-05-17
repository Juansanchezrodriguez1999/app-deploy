
import Link from 'next/link';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Input from '@/components/Input';
import { Fetcher } from '@/lib/fetcher';
import Image from 'next/image';
import CustomHeader from '@/components/CustomHeader';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await Fetcher.post('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => {
        if (res.ok) {
          setLoading(false)
          Router.push(`/auth/signin?successfulLogin=true`);
          toast.success('User registered successfully and ADMIN notified');
        }
      });
      await Fetcher.get(`/api/manageUser/createUser/${data.email}/${data.username}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setLoading(false)
    } catch (err) {
      setLoading(false)
      toast.error(err.message);
    }
  };

  return (
    <div className='x-auto grid place-items-center grid'>

      <div className="min-h-screen max-w-4xl shadow-md  w-full overflow-x-auto ">
        <CustomHeader title={"Technical Test - Sign up"} principal={"Signup"} />
        <main className="mx-auto max-w-lg mb-10 px-4 sm:px-6 md:px-8">
          <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
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
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <h1 className="text-center text-4xl text-asafe_turquoise">Sign up</h1>
                  <div className="grid grid-cols-1 gap-5">
                    <Input
                      type="text"
                      autoComplete="off"
                      name="username"
                      label="Username"
                      error={errors.username?.message}
                      register={register}
                      required
                    />

                    <Input
                      type="text"
                      autoComplete="off"
                      name="fullname"
                      label="Full name"
                      error={errors.fullName?.message}
                      register={register}
                      required
                    />
                    <Input
                      type="text"
                      autoComplete="off"
                      name="email"
                      label="E-mail"
                      error={errors.email?.message}
                      register={register}
                      required
                    />

                    <Input
                      type="password"
                      name="password"
                      label="Password"
                      error={errors.password?.message}
                      register={register}
                      required
                    />
                    <Input
                      type="password"
                      name="confirmPassword"
                      label="Repeat password"
                      error={errors.confirmPassword?.message}
                      register={register}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Sign up
                  </button>
                  <div className="inline-flex items-center space-x-4">

                  </div><div className='flex items-center justify-center '>
                    Already have an account?
                    <Link href="/auth/signin">
                      <a className="underline ml-1">Log in</a>
                    </Link>
                  </div>
                </form>
              }

            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>

  );
}