import { useState } from 'react';
import Footer from '@/components/Footer';
import BarChart from '@/components/BarChart';
import PieChart from '@/components/PieChart';
import PieD3 from '@/components/PieD3';
import BarD3 from '@/components/BarD3';
import LineChart from '@/components/LineChart';
import LineD3 from '@/components/LineD3';
import CustomHeader from '@/components/CustomHeader';
import BackButton from '@/components/BackButton';
import { connectToDatabase } from '@/lib/mongo';
import CustomSelect from '@/components/CustomSelect';

export default function Page({ data }) {
  const [chartType, setChartType] = useState('pieplot');
  const renderChart = () => {
    switch (chartType) {
      case 'barplot':
        return (
          <>
            <div className="block ">
              {data && <BarChart data={data} />}
            </div>
            <div className="block ">
              {data && <BarD3 data={data} />}
            </div>
          </>
        );
      case 'pieplot':
        return (
          <>
            <div className="block ">
              {data && <PieChart data={data} />}
            </div>
            <div className="block ">
              {data && <PieD3 data={data} />}
            </div>
          </>
        );
      case 'lineplot':
        return (
          <>
            <div className="block ">
              {data && <LineChart data={data} />}
            </div>
            <div className="block ">
              {data && <LineD3 data={data} />}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='x-auto grid place-items-center grid'>
      <div className="min-h-screen max-w-4xl shadow-md  w-full overflow-x-auto ">
        <CustomHeader title={"Technical Test - Plots"} principal={"Dashboard"} />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <section className="mx-auto my-5 max-w-screen-xl space-y-4">
            <div className="flex justify-end -mb-10">
              <BackButton />
            </div>
            <div className="flex mb-4">
              <CustomSelect label="Select plot" parameter={["pieplot", "barplot", "lineplot"]} inputFilterValue={chartType} setInputFilterValue={setChartType} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderChart()}
            </div>
          </section>
        </main>
      </div>      <Footer />

    </div>
  );
}

Page.auth = true;

export const getServerSideProps = (async () => {
  const { db } = await connectToDatabase();
  const collection = await db.collection('natural_park_species');
  const cursor = await collection.find();
  const data = await cursor.toArray();
  const dataDict = {}
  data.forEach(naturalPark => {
    const naturalParkName = naturalPark._id;
    const speciesNumber = naturalPark.Species.length;
    dataDict[naturalParkName] = speciesNumber;
  });

  return {
    props: { data: dataDict }
  };
}) 