import React from 'react';

import Router from 'next/router';

import toast, { Toaster } from 'react-hot-toast';

import Footer from '@/components/Footer';
import { Fetcher } from '@/lib/fetcher';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomHeader from '@/components/CustomHeader';
import prisma from '@/lib/prisma';
import { useSession } from 'next-auth/react';

export default function Page({ userInDatabase }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session && session.user.role !== 'ADMIN') {
      router.push('/deniedAccess');
    }
  }, [session]);

  const handleValidateUser = async (user) => {

    try {
      await Fetcher.get(`/api/manageUser/validateUser/${user.id}/${user.role}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.ok) {
          Router.push(`/profile/manageUser`);
          toast.success(`Role changed successfully in user ${user.username} `);
        }
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await Fetcher.get(`/api/manageUser/deleteUser/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        if (res.ok) {
          Router.push(`/profile/manageUser`);
          toast.success(`User ${user.username} deleted successfully`);
        }
      });
    } catch (err) {
      toast.error(err.message);
    }
  };


  const generateConfirmationWindow = (user, action) => {
    'action could be delete or asAdmin';
    const handleDeleteUserAndAlert = (t) => {
      handleDeleteUser(user);
      toast.dismiss(t.id);
    };

    const handleAsUserAndAlert = (t) => {
      handleValidateUser(user);
      toast.dismiss(t.id);
    };

    const handleSetAsAdminAndAlert = (t) => {
      handleValidateUser(user);
      toast.dismiss(t.id);
    };

    toast((t) => (
      <>
        <span className="text-md w-full rounded-md p-4 opacity-90">
          <p className="text-center">
            {action === 'delete' ? `Do you want to permanently delete the user '${user.username}'?`
              : action === 'asAdmin' ? `Do you want to set user '${user.username}' as Admin?`
                : `Do you want to set user '${user.username}' as User?`}
          </p>
          <div className="flex items-center justify-between pt-5 text-center font-medium text-white">
            <button
              onClick={() => {
                if (action === 'delete') {
                  handleDeleteUserAndAlert(t);
                } else if (action === 'asAdmin') {
                  handleSetAsAdminAndAlert(t);
                }
                else {
                  handleAsUserAndAlert(t);
                }

              }}
              className={`mx-1 inline w-full rounded-2xl border-2 ${action === 'delete' ? 'border-red-400 bg-red-400 hover:border-red-500 hover:bg-red-500'
                  : action === 'asAdmin' ? 'border-green-400 bg-green-400 hover:border-green-500 hover:bg-green-500'
                    : 'border-green-400 bg-green-400 hover:border-green-500 hover:bg-green-500'
                } p-1.5`}
            >
              {action === 'delete' ? 'Delete'
                : action === 'asAdmin' ? 'Set as Admin'
                  : 'Set as User'}
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="mx-1 inline w-full rounded-2xl border-2 border-gray-400 bg-gray-400 p-1.5 hover:border-gray-500 hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </span>
      </>
    ));
  };
  console.log()
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (session.user.role === "ADMIN") {
    return (
      <div className='x-auto grid place-items-center grid'>
        <div className="min-h-screen max-w-4xl shadow-md w-full overflow-x-auto ">
          <CustomHeader title={"Technical Test - Users"} principal={"Users"} />
          <Toaster
            toastOptions={{
              duration: 15000,
              success: {
                duration: 3000,
              },
              error: {
                duration: Infinity,
              },
            }}
          />
          <div className="mt-4 flex flex-col items-center justify-center">
            <table className="text-bg mb-8 mt-4 grid-cols-1 text-left text-center text-gray-500 dark:text-gray-400">
              <thead className="place-items-center justify-items-center rounded-lg border-l border-r border-t bg-slate-100 text-center text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="border-b border-r p-2">Username</th>
                  <th className="border-b border-r p-2">Full name</th>
                  <th className="border-b border-r p-2">Email</th>
                  <th className="border-b border-r p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userInDatabase.map((user) => (
                  <tr key={user.id} className="border-2 hover:bg-slate-50 dark:border-gray-700">
                    <td className="border-b border-r p-4">{user.username}</td>
                    <td className="border-b border-r p-2">{user.fullname}</td>
                    <td className="border-b border-r p-2">{user.email}</td>
                    <td className="border-b border-r px-4 py-2">
                      {user.role === 'USER' && (
                        <div className="flex space-x-4">
                          <button
                            className="w-1/2 rounded-lg bg-green-600 py-1.5 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            onClick={() => generateConfirmationWindow(user, 'asAdmin')}
                          >
                            Validate as ADMIN
                          </button>
                          <button
                            className="w-1/2 rounded-lg bg-slate-300 py-1.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
                            disabled
                          >
                            Validate as USER
                          </button>
                          <button
                            className="w-1/2 rounded-lg bg-red-600 py-1.5 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                            onClick={() => generateConfirmationWindow(user, 'delete')}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                      {user.role === 'ADMIN' && (
                        <div className="flex space-x-4">
                          <button
                            className="w-1/2 rounded-lg bg-slate-300 py-1.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
                            disabled
                          >
                            Validate as ADMIN
                          </button>
                          <button
                            className="w-1/2 rounded-lg bg-green-600 py-1.5 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            onClick={() => generateConfirmationWindow(user, 'asUser')}
                          >
                            Validate as USER
                          </button>
                          <button
                            className="w-1/2 rounded-lg bg-slate-300 py-1.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
                            disabled
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>      <Footer />
      </div>

    );
  }


}




Page.auth = true;

export async function getServerSideProps(context) {
  const userInDatabase = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      fullname: true,
      role: true
    }
  });
  return {
    props: {
      userInDatabase,
    },
  }
}