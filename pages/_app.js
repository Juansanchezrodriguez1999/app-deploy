import { SessionProvider, useSession } from 'next-auth/react';
import { MdOutlineMotionPhotosOn } from 'react-icons/md';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === 'loading') {
    return (
      <main className="grid h-screen place-items-center">
        <section>
          <MdOutlineMotionPhotosOn className="h-6 w-6 animate-spin" />
        </section>
      </main>
    );
  }

  return children;
}
