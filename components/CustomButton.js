import { useState } from 'react';
import CustomSelect from './CustomSelect';

const CustomButton = ({
  colors,
  intensities,
}) => {
  const buttonBase = 'font-bold py-2 px-4 rounded'

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedIntensity, setSelectedIntensity] = useState("");
  return (
    <div>
      <div className="mb-2 mt-2 font-bold text-lg mr-2 text-asafe_turquoise">Select color</div>
      <CustomSelect label="Select bg-color" parameter={colors} inputFilterValue={selectedColor} setInputFilterValue={setSelectedColor} />
      <CustomSelect label="Select bg-color number" parameter={intensities} inputFilterValue={selectedIntensity} setInputFilterValue={setSelectedIntensity} />
      <button className={`${buttonBase}`}{...props}>Mi Botón</button>

    </div>
  );
};

export default CustomButton;