import { getSession } from 'next-auth/react';
import Footer from '@/components/Footer';
import CustomHeader from '@/components/CustomHeader';
import BackButton from '@/components/BackButton';
import { useEffect, useState } from 'react';
import CustomSelect from '@/components/CustomSelect';

export default function Page() {
  const [stylestType, setStilesType] = useState("static");

  const bgColor = ["bg-slate-100", "bg-slate-200", "bg-slate-300", "bg-slate-400", "bg-slate-500", "bg-slate-600", "bg-slate-700", "bg-slate-800", "bg-slate-900", "bg-red-100", "bg-red-200", "bg-red-300", "bg-red-400", "bg-red-500", "bg-red-600", "bg-red-700", "bg-red-800", "bg-red-900", "bg-orange-100", "bg-orange-200", "bg-orange-300", "bg-orange-400", "bg-orange-500", "bg-orange-600", "bg-orange-700", "bg-orange-800", "bg-orange-900", "bg-amber-100", "bg-amber-200", "bg-amber-300", "bg-amber-400", "bg-amber-500", "bg-amber-600", "bg-amber-700", "bg-amber-800", "bg-amber-900", "bg-lime-100", "bg-lime-200", "bg-lime-300", "bg-lime-400", "bg-lime-500", "bg-lime-600", "bg-lime-700", "bg-lime-800", "bg-lime-900", "bg-green-100", "bg-green-200", "bg-green-300", "bg-green-400", "bg-green-500", "bg-green-600", "bg-green-700", "bg-green-800", "bg-green-900", "bg-emerald-100", "bg-emerald-200", "bg-emerald-300", "bg-emerald-400", "bg-emerald-500", "bg-emerald-600", "bg-emerald-700", "bg-emerald-800", "bg-emerald-900", "bg-cyan-100", "bg-cyan-200", "bg-cyan-300", "bg-cyan-400", "bg-cyan-500", "bg-cyan-600", "bg-cyan-700", "bg-cyan-800", "bg-cyan-900", "bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-400", "bg-blue-500", "bg-blue-600", "bg-blue-700", "bg-blue-800", "bg-blue-900"];
  const colors = ["slate", "red", "orange", "amber", "lime", "green", "emerald", "cyan", "blue", "purple", "pink", "rose"];
  const intensities = ["100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
  const [selectedBGColor, setSelectedBGColor] = useState("");
  const [selectedIntensity, setSelectedIntensity] = useState("");
  const [buttonHtmlDynamic, setButtonHtmlDynamic] = useState('');
  const [classNameDynamic, setClassNameDynamic] = useState('border-2 font-bold py-2 px-4 rounded w-full');


  const [selectedColor, setSelectedColor] = useState(bgColor[0]);
  const [className, setClassName] = useState(`${selectedColor} font-bold py-2 px-4 rounded w-full`);
  const [buttonHtml, setButtonHtml] = useState('');
  const handleCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = buttonHtml;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Button code copied');
  };
  useEffect(() => {
    setClassName(`${selectedColor} font-bold py-2 px-4 rounded m-1 w-full ${parseInt(selectedColor.split('-')[2]) > 500 ? 'text-white' : ''}`)
  }, [selectedColor]);

  useEffect(() => {
    if (selectedBGColor !== "" && selectedIntensity !== "") {
      const colorDynamic = 'bg-' + selectedBGColor + '-' + selectedIntensity
      setClassNameDynamic(`${colorDynamic} font-bold py-2 px-4 rounded m-1 w-full ${parseInt(colorDynamic.split('-')[2]) > 500 ? 'text-white' : ''}`)
    }
  }, [selectedBGColor, selectedIntensity, classNameDynamic]);

  useEffect(() => {
    setButtonHtml(`<button className="${className}">Button</button>`);
  }, [className]);

  useEffect(() => {
    setButtonHtmlDynamic(`<button className="${classNameDynamic}">Button</button>`);
  }, [classNameDynamic]);

  const renderStyles = () => {
    switch (stylestType) {
      case 'dynamic':
        return (
          <>
            <span className='font-bold'>Introduce the parameters to see the button with the style, you will also be able to view the code and copy it for your webpage.</span>
            <div className="grid grid-cols-2 gap-4">
              <CustomSelect label="Select bg-color" parameter={colors} inputFilterValue={selectedBGColor} setInputFilterValue={setSelectedBGColor} />
              <CustomSelect label="Select intensity" parameter={intensities} inputFilterValue={selectedIntensity} setInputFilterValue={setSelectedIntensity} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <input
                  aria-label="HtmlCode"
                  className={classNameDynamic}
                  type="text"
                  readOnly
                  value={buttonHtmlDynamic}
                />
              </div>
              <div>
                <button className={classNameDynamic} onClick={handleCopy}>Copy code</button>
              </div>

            </div>
          </>
        );
      case 'static':
        return (
          <>
            <span className='font-bold'>Click on a button to view the code and then you can copy it to your webpage.</span>
            <div className="flex grid grid-cols-9">
              {bgColor.map((color, index) => (
                <button
                  key={index}
                  onClick={() => { setSelectedColor(color) }}
                  className={`${color} font-bold py-4 px-4 rounded m-1 h-4 ${parseInt(color.split('-')[2]) > 500 ? 'text-white' : ''}`}
                >
                </button>
              ))}
            </div>


            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <input
                  aria-label="HtmlCode"
                  className={className}
                  type="text"
                  readOnly
                  value={buttonHtml}
                />
              </div>
              <div>
                <button className={className} onClick={handleCopy}>Copy code</button>
              </div>
            </div>


          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='x-auto grid place-items-center grid '>
      <div className="min-h-screen max-w-4xl shadow-md  w-full overflow-x-auto ">
        <CustomHeader title={"Technical Test - UI Kit"} principal={"UI Kit"} />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <section className="mx-auto my-5 max-w-screen-xl space-y-4">
            <div className="flex justify-end">
              <BackButton />
            </div>
            <div className="flex mb-4 ">
              <CustomSelect label="Select styles type" parameter={["static", "dynamic"]} inputFilterValue={stylestType} setInputFilterValue={setStilesType} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {renderStyles()}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

Page.auth = true;
