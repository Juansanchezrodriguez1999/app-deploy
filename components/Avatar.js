import Image from 'next/image';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';

const Avatar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const goToProfile = () => {
    router.push('/profile');
  };

  return (
    <button className="flex items-center space-x-1 focus:outline-none" onClick={goToProfile}>
      <div className="relative h-8 w-8 cursor-pointer">
        <Image
          src={`https://ui-avatars.com/api/?background=random&name=${session.user.username}.svg`}
          alt={session.user.username}
          layout="fill"
          className="rounded-full"
        />
      </div>
    </button>
  );
};

export default Avatar;
