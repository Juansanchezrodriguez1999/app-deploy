import React from 'react';
import Router from 'next/router';

import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Footer from '@/components/Footer';
import Input from '@/components/Input';
import { Fetcher } from '@/lib/fetcher';
import CustomHeader from '@/components/CustomHeader';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export default function Page({ }) {
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmit = async (data) => {
    try {
      await Fetcher.get(`/api/profile/${session.user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => {
        if (res.ok) {
          Router.push(`/profile`);
          toast.success('User updated successfully');
        }
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (session) {
    return (
      <div className='x-auto grid place-items-center grid'>
        <div className="min-h-screen max-w-4xl shadow-md w-full overflow-x-auto ">
          <CustomHeader title={"Technical Test - User Profile"} principal={"User Profile"} />
          <main className="px-4 sm:px-6 md:px-8">
            <div className="flex my-5 justify-end">
              <BackButton />
            </div>

            {session.user.role === "ADMIN" && (
              <section className="flex justify-center ">
                <Link className="relative" href="/profile/manageUser">
                  <button
                    type="button"
                    className="w-6/12 rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Manage users
                  </button>
                </Link>
              </section>
            )
            }
            <section className="mx-auto my-5  max-w-lg  m-6 border p-4 rounded bg-slate-10">
              <h3 className="text-center p-2 text-2xl text-asafe_turquoise">User configuration</h3>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-5">
                  <Input
                    type="text"
                    autoComplete="off"
                    name="username"
                    label="Username"
                    error={errors.username?.message}
                    register={register}
                    disabled
                    defaultValue={session.user.username}
                  />

                  <Input
                    type="text"
                    autoComplete="off"
                    name="fullname"
                    label="Full name"
                    error={errors.fullName?.message}
                    register={register}
                    defaultValue={session.user.fullname}
                  />
                  <Input
                    type="text"
                    autoComplete="off"
                    name="email"
                    label="E-mail"
                    error={errors.email?.message}
                    register={register}
                    disabled
                    defaultValue={session.user.email}
                  />

                  <Input
                    type="password"
                    name="password"
                    label="Password"
                    error={errors.email?.message}
                    register={register}
                    placeholder="********"
                  />

                  <Input
                    type="password"
                    name="confirmPassword"
                    label="Repeat password"
                    error={errors.confirmPassword?.message}
                    register={register}
                    placeholder="********"
                  />
                </div>
                <div className="grid justify-center flex">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Save
                  </button>
                </div>
              </form>

            </section>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
  else {
    return {
      redirect: {
        destination: '/deniedAccess',
        permanent: false,
      },
    };
  }
}

Page.auth = true;