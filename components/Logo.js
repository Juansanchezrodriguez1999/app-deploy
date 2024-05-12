import Image from 'next/image';


export default function Logo({ className }) {
  return <Image className={className} priority src="/asafedigital.png" width={640} height={219} alt="A-SAFE Digital logo" />;
}