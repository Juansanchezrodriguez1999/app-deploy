import React, { useState } from 'react';
import Link from 'next/link';
import { MdGridOn } from 'react-icons/md';
import { BsArrowRightSquare } from 'react-icons/bs';
import { SiPlotly } from 'react-icons/si';
import Card from '@/components/Card';
import Footer from '@/components/Footer';
import CustomHeader from '@/components/CustomHeader';
import BackButton from '@/components/BackButton';

export default function Page() {
  const [loading, setLoading] = useState(false);

  const handleCardClick = () => {
    setLoading(true);
  };

  return (
    <div className='x-auto grid place-items-center grid'>
      <div className="min-h-screen max-w-4xl shadow-md w-full overflow-x-auto ">
        <CustomHeader title={"Technical Test - Catalog"} principal={"Catalog"} />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <section className="mx-auto my-5 max-w-screen-xl space-y-4">
            <div className="flex justify-end">
              <BackButton />
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div role="status">
                  <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="grid auto-rows-fr gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/catalog/dashboard">
                  <a className="flex" onClick={handleCardClick}>
                    <Card className="border-t-asafe_turquoise">
                      <Card.Header>
                        <SiPlotly className="h-8 w-8 fill-asafe_turquoise" />
                      </Card.Header>
                      <Card.Body>
                        <p>
                          On this page, you will find different graphics about plant species and natural parks.
                          Currently, the collected data is from Sierra de las Nieves National Park, Cabo de Gata Natural Park,
                          and Los Alcornocales Natural Park.
                        </p>
                      </Card.Body>
                      <Card.Footer>
                        <p className="text-right text-asafe_turquoise">Dashboard</p>
                      </Card.Footer>
                    </Card>
                  </a>
                </Link>
                <Link href="/catalog/data">
                  <a className="flex" onClick={handleCardClick}>
                    <Card className="border-t-asafe_turquoise">
                      <Card.Header>
                        <MdGridOn className="h-8 w-8 fill-asafe_turquoise" />
                      </Card.Header>
                      <Card.Body>
                        <p>
                          On this page, you will find the table and some filters for visualizing the collected data on plant
                          species found in the same area and the area where they were collected Natural Sites.
                        </p>
                      </Card.Body>
                      <Card.Footer>
                        <p className="text-right text-asafe_turquoise">Data</p>
                      </Card.Footer>
                    </Card>
                  </a>
                </Link>
                <Link href="/catalog/kit">
                  <a className="flex" onClick={handleCardClick}>
                    <Card className="border-t-asafe_turquoise">
                      <Card.Header>
                        <BsArrowRightSquare className="h-8 w-8 fill-asafe_turquoise" />
                      </Card.Header>
                      <Card.Body>
                        <p>
                          On this page, you will find a UI Kit featuring various buttons. Some are pre-built statically, while
                          others you can construct dynamically. Additionally, you can copy the button{'\''}s code to use it on
                          your website.
                        </p>
                      </Card.Body>
                      <Card.Footer>
                        <p className="text-right text-asafe_turquoise">UI Kit</p>
                      </Card.Footer>
                    </Card>
                  </a>
                </Link>
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
Page.auth = true;
