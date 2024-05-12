import Head from "next/head";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Breadcrumbs from "./Breadcrumb";

const CustomHeader = ({
  title,
  principal
}) => {

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Toaster />
      <Navbar />
      {principal !== "Login" && principal !== "Signup" && (
        <>            <Breadcrumbs />
          <h2 className="text-4xl ml-8 text-asafe_turquoise">{principal}</h2>

          <div className="border-b bg-white p-2"></div>
          <div className="mx-auto max-w-6xl space-y-4 px-4 sm:px-6 md:px-8" />
        </>
      )}
    </>

  );
}
export default CustomHeader;