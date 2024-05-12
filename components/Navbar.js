import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import clsx from 'clsx';
import { signIn, signOut, useSession } from 'next-auth/react';

import Avatar from '@/components/Avatar';
import Logo from '@/components/Logo';

const NavbarLink = ({ href, active, children }) => {
  const router = useRouter();
  const className = clsx(children.props.className, router.pathname === href && active);
  return <Link href={href}>{React.cloneElement(children, { className })}</Link>;
};

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="border-b">

      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="relative w-1/4 p-2">
              <Logo />
            </a>
          </Link>
          <div className="flex items-center space-x-4">
            <NavbarLink href="/" active="text-asafe_turquoise">
              <a className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-100 ease-linear hover:decoration-asafe_turquoise">
                Home
              </a>
            </NavbarLink>
            {!session ? (
              <button
                type="button"
                className="rounded-lg bg-green-700 px-3 py-2 text-center text-xs font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={() => signIn()}
              >
                Login
              </button>
            ) : (
              <>
                <Avatar />
                <button
                  type="button"
                  className="rounded-lg bg-red-700 px-3 py-2 text-center text-xs font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;