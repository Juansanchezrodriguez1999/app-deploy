import Link from 'next/link';

import { MdOutlineApps } from 'react-icons/md';

import Card from '@/components/Card';
import Footer from '@/components/Footer';
import CustomHeader from '@/components/CustomHeader';

export default function Home() {
  return (
    <div className='x-auto grid place-items-center grid'>
      <div className="min-h-screen max-w-4xl shadow-md  w-full overflow-x-auto ">

        <CustomHeader title={"Technical Test - Homepage"} principal={"Homepage"} />

        <main className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <section className="mx-auto my-5 max-w-screen-xl space-y-4">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-1">
              <Link href="/catalog">
                <a>
                  <Card className="border-t-asafe_turquoise ">
                    <Card.Header>
                      <MdOutlineApps className="h-8 w-8 fill-asafe_turquoise" />
                    </Card.Header>
                    <Card.Body>
                      <p className="line-clamp-6 font-bold">
                        In the catalog, you will have the option to navigate through a page where you will find a dashboard featuring various graphics generated from the D3.js and Chart.js libraries. Alternatively, you can access a table displaying data, which can also be filtered, and a UI kit for dynamic button creation using Tailwind CSS, where you can preview examples of different button styles, sizes, and colors. Please note that access to the catalog requires user registration as the page is secured with NextAuth.
                      </p>
                    </Card.Body>
                    <Card.Footer>
                      <p className="text-right text-asafe_turquoise font-bold">Catalog</p>
                    </Card.Footer>
                  </Card>
                </a>
              </Link>
            </div>
          </section>
        </main>
      </div>      <Footer />

    </div>
  );
}