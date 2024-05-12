const CustomCheckBox = ({
  label,
  show,
  setShow,
  setParameter,
  name,
  setParameter2
}) => {

  return (
    <>
      <div className="col-span-2 flex items-center md:col-span-1">
        <label className="ml-2 mr-2 font-bold">
          <input
            label={label}
            type="checkbox"
            className="w-4 h-4 p-2 m-2 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={show}
            onChange={() => {
              setShow(!show);
              setParameter('');
              label === "altitude" && setParameter2('')
            }}
          />
          {name}
        </label>
      </div>
    </>

  );
}
export default CustomCheckBox;