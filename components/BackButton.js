import { useRouter } from "next/router";

const BackButton = ({ }) => {
  const router = useRouter()
  return (
    <button onClick={() => router.back()}>
      <span className="rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Return
      </span>
    </button>
  );
};

export default BackButton;
