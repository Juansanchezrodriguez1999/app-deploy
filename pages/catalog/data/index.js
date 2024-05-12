import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Footer from '@/components/Footer';
import { Functions } from '@/lib/Functions';
import { Fetcher } from '@/lib/fetcher';
import CustomHeader from '@/components/CustomHeader';
import BackButton from '@/components/BackButton';
import CustomCheckBox from '@/components/CustomCheckBox';
import CustomSelect from '@/components/CustomSelect';
import { connectToDatabase } from '@/lib/mongo';


export default function Page({ species, naturalSites, noRegister }) {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const handlerFilter = async () => {

    setLoading(true);
    setSamples([])
    const dataObject = {
      all: showAllSelect,
      _id: noRegisterFilterValue,
      Species: synonymsGBIF,
      Natural_Site: naturalSiteFilterValue,
      AltitudeMin: altitudeMinFilterValue,
      AltitudeMax: altitudeMaxFilterValue,
    };
    try {
      const queryParams = new URLSearchParams(dataObject).toString();
      const response = await Fetcher.get(`/api/flora/list?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const responseData = await response.json();
        setSamples(responseData);
        setLoading(false);
      } else {
        console.log('Error:', response.status);
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      setSamples([])
      const response = await fetch('/api/flora/list');
      const data = await response.json();
      setSamples(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [showAllSelect, setShowAllSelect] = useState(false);

  //SPECIES
  const [speciesFilterValue, setSpeciesFilterValue] = useState('');
  const [showSpeciesSelect, setShowSpeciesSelect] = useState(false);

  //NºREGISTER
  const [noRegisterFilterValue, setNoRegisterFilterValue] = useState('');
  const [showNoRegisterSelect, setShowNoRegisterSelect] = useState(false);


  //NATURALSITE
  const [naturalSiteFilterValue, setNaturalSiteFilterValue] = useState('');
  const [showNaturalSiteSelect, setShowNaturalSiteSelect] = useState(false);


  //ALTITUDE
  const [altitudeMaxFilterValue, setAltitudeMaxFilterValue] = useState('');
  const [altitudeMinFilterValue, setAltitudeMinFilterValue] = useState('');
  const [showAltitudeSelect, setShowAltitudeSelect] = useState(false);


  const [synonymsGBIF, setSynonymsGBIF] = useState([]);
  const speciesFilter = (rows, id, value) => {
    if (value === '') {
      return rows;
    }
    const filteredRows = rows.filter((row) => {
      const species = row.values[id];
      if (synonymsGBIF) {
        return species.some((s) => synonymsGBIF.some((item) => item === s.Name));
      }
    });

    return filteredRows;
  };
  const showAllButton = () => {
    setSpeciesFilterValue('');
    setNoRegisterFilterValue('');
    setNaturalSiteFilterValue('');
    setAltitudeMaxFilterValue('');
    setAltitudeMinFilterValue('');
    setShowNoRegisterSelect(false);
    setShowSpeciesSelect(false);
    setShowNaturalSiteSelect(false);
    setShowAltitudeSelect(false);
    setSynonymsGBIF([]);
  };
  const resetAllFilters = () => {
    setSpeciesFilterValue('');
    setNoRegisterFilterValue('');
    setNaturalSiteFilterValue('');
    setAltitudeMaxFilterValue('');
    setAltitudeMinFilterValue('');
    setShowNoRegisterSelect(false);
    setShowAllSelect(false);
    setShowSpeciesSelect(false);
    setShowNaturalSiteSelect(false);
    setShowAltitudeSelect(false);
    setSynonymsGBIF([]);
    fetchData();
  };

  const XLSX = require('xlsx');

  const exportJsonToExcel = async (filteredRows) => {
    const filteredData = filteredRows.map((row) => {
      const dataCopy = { ...row };
      dataCopy.Community_Authors = row.Community_Authors.join(', ');
      dataCopy.Subcommunity_Authors = row.Subcommunity_Authors.join(', ');
      dataCopy.Pictures = row.Pictures.join(', ');
      dataCopy.Species = row.Species.map((species) => species.Name).join(', ');

      return dataCopy;
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'filtered_data.xlsx');
  };

  useEffect(() => {
    if (speciesFilterValue) {
      Functions.setSynonyms(speciesFilterValue)
        .then((speciesInfo) => {
          setSynonymsGBIF(speciesInfo.synonyms);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [speciesFilterValue]);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Europe/Madrid');
  const Table = ({ samples }) => {
    const data = React.useMemo(() => samples, [samples]);
    const columns = React.useMemo(
      () => [
        {
          Header: 'Nº Register',
          accessor: '_id',
        },
        {
          Header: 'Species',
          accessor: 'Species',
          Cell: ({ cell }) => {
            return (
              <>
                {cell.value.map((species, index) => {
                  const isSynonym = synonymsGBIF.includes(species.Name);

                  return (
                    <div className={index !== cell.value.length - 1 ? 'border-b ' : ''} key={index}>
                      {synonymsGBIF[synonymsGBIF.length - 1] === species.Name ? (
                        <div
                          className={`flex items-center justify-center bg-blue-200 font-bold ${index !== cell.value.length - 1 ? 'border-b ' : ''
                            }`}
                          key={index}
                        >
                          Accepted: {species.Name}
                        </div>
                      ) : isSynonym && synonymsGBIF.includes(speciesFilterValue) ? (
                        <div
                          className={`flex items-center justify-center bg-green-200 font-bold ${index !== cell.value.length - 1 ? 'border-b ' : ''
                            }`}
                          key={index}
                        >
                          Synonym: {species.Name}
                        </div>
                      ) : (
                        species.Name
                      )}
                    </div>
                  );
                })}
              </>
            );
          },
          filter: speciesFilter,
        },
        {
          Header: 'Natural Site',
          accessor: 'Natural_Site',
        },
        {
          Header: 'Altitude',
          accessor: 'Altitude',
        },
      ],
      [],
    );

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 5 }, // Página inicial y tamaño de página
      },
      useFilters,
      useSortBy,
      usePagination,
    );
    const gotoLastPage = () => {
      const lastIndex = pageCount - 1; // Índice de la última página
      gotoPage(lastIndex);
    };
    const gotoFirstPage = () => {
      const firstIndex = 0; // Índice de la última página
      gotoPage(firstIndex);
    };
    return (
      <>
        <div className="pagination flex justify-center space-x-2 py-1">
          <div className="flex items-center text-base font-bold">{rows.length} samples</div>
          <div className="flex items-center space-x-2 ">
            <button aria-label="firstPage"
              className="rounded font-bold  transition-colors  ease-in-out disabled:pointer-events-none disabled:opacity-50"
              onClick={() => gotoFirstPage()}
              disabled={!canPreviousPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-blue-500 hover:fill-blue-800"
              >
                <path
                  fillRule="evenodd"
                  d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button aria-label="previousPage"
              className="rounded font-bold  transition-colors  ease-in-out disabled:pointer-events-none disabled:opacity-50"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-blue-500 hover:fill-blue-800"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className='font-bold'>
              Page
              <strong>
                {' '}
                {pageIndex + 1}/{pageOptions.length}
              </strong>
            </span>
            <button aria-label="nextPage"
              className="rounded font-bold  transition-colors ease-in-out disabled:pointer-events-none disabled:opacity-50"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-blue-500 hover:fill-blue-800"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button aria-label="lastPage"
              className="rounded font-bold   transition-colors ease-in-out disabled:pointer-events-none disabled:opacity-50"
              onClick={() => gotoLastPage()}
              disabled={!canNextPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-blue-500 hover:fill-blue-800"
              >
                <path
                  fillRule="evenodd"
                  d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="flex items-center">
              <select
                className="ml-2 form-select rounded-full border border-blue-200 bg-white"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 20, 40, 80, 100, 200, 300, 500, 1000, 2000, ...(rows.length > 2000 ? [rows.length] : [])].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <table
          className="text-bg my-3 w-full text-left text-center  "
          {...getTableProps()}
        >
          <thead className="place-items-center justify-items-center rounded-lg border-l border-r border-t bg-slate-50 text-center text-xs uppercase  dark:bg-gray-700 ">
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={`header-${index}`}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th {...column.getHeaderProps()} className="px-4 py-3 font-bold" key={`header-${index}-${columnIndex}`}>
                    <div>
                      {column.render('Header')}
                      {column.Filter ? column.render('Filter') : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="border-b hover:bg-slate-50 dark:border-gray-700"
                  key={`row-${rowIndex}`}
                >
                  {row.cells.map((cell, cellIndex) => (
                    <td {...cell.getCellProps()} className="border px-4 py-3 font-bold" key={`cell-${rowIndex}-${cellIndex}`}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination flex grid-cols-3 justify-center space-x-2 py-1">
          <div className="flex items-center text-base font-bold">{rows.length} samples</div>
          <div className="flex items-center space-x-2 ">
            <button aria-label="firs"
              className="rounded font-bold  transition-colors  ease-in-out disabled:pointer-events-none disabled:opacity-50"
              onClick={() => gotoFirstPage()}
              disabled={!canPreviousPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-blue-500 hover:fill-blue-800"
              >
                <path
                  fillRule="evenodd"
                  d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button aria-label="previousPage"
              className="rounded font-bold  transition-colors  ease-in-out disabled:pointer-events-none disabled:opacity-50"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-blue-500 hover:fill-blue-800"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className='font-bold'>
              Page
              <strong>
                {' '}
                {pageIndex + 1}/{pageOptions.length}
              </strong>
            </span>
            <button aria-label="nextPage"
              className="rounded font-bold  transition-colors ease-in-out disabled:pointer-events-none disabled:opacity-50"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-blue-500 hover:fill-blue-800"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button aria-label="lastPage"
              className="rounded font-bold   transition-colors ease-in-out disabled:pointer-events-none disabled:opacity-50"
              onClick={() => gotoLastPage()}
              disabled={!canNextPage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-blue-500 hover:fill-blue-800"
              >
                <path
                  fillRule="evenodd"
                  d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="flex items-center">
              <select
                className="ml-2 form-select rounded-full border border-blue-200 bg-white"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50, 100, 200, 300, 500, 1000, 2000, ...(rows.length > 2000 ? [rows.length] : [])].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className='x-auto grid place-items-center grid'>
      <div className="min-h-screen max-w-4xl shadow-md  w-full overflow-x-auto ">
        <CustomHeader title={"Technical Test - Vegetation Data"} principal={"Data"} />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <section className="mx-auto my-5 max-w-screen-xl space-y-4">
            <div className="flex justify-end">
              <BackButton />
            </div>
            <div className="mb-2 rounded border-2 bg-gray-50 p-2 pl-4 pr-4">
              <div className="grid-cols-2 space-x-1">
                <div className="flex items-center justify-center space-x-1">
                  <button aria-label="Name" className="disabled:cursor-not-allowed" disabled={!(showAllSelect || showAltitudeSelect || showNaturalSiteSelect || showSpeciesSelect || showNoRegisterSelect)} onClick={() => handlerFilter()}>
                    <span className="mb-2 mt-2 flex text-white font-bold items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium font-bold hover:bg-amber-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="white"
                        className="mr-2 h-3.5 w-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                      Filter data
                    </span>
                  </button>
                  <button aria-label="Name" onClick={resetAllFilters} className='disabled:cursor-not-allowed ' disabled={!(showAllSelect || showAltitudeSelect || showNaturalSiteSelect || showSpeciesSelect || showNoRegisterSelect)}>
                    <span className="mb-2 mt-2 flex items-center text-white font-bold rounded-lg bg-red-600 px-4 py-2 text-sm font-medium font-bold hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="white"
                        className="mr-2 h-3.5 w-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                        />
                      </svg>
                      Reset filters
                    </span>
                  </button>
                  <button className="mx-4 " onClick={() => exportJsonToExcel(samples)}>
                    <span className="mb-2 mt-2 flex items-center text-white font-bold rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium font-bold hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 22 23"
                        strokeWidth="2"
                        stroke="white"
                        className="mr-2 h-5 w-3.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                      Export data
                    </span>
                  </button>
                </div>
              </div>
              <div className="text-lg font-bold">Filters:</div>
              <div className="md:grid-cols-3 grid lg:grid-cols-3">
                <div className="col-span-3 flex items-center md:col-span-1">
                  <label className="ml-2 mr-2 font-bold">
                    <input
                      type="checkbox"
                      label="nofilter"
                      className="w-4 h-4 p-2 m-2  bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={showAllSelect}
                      onChange={() => {
                        setShowAllSelect(!showAllSelect);
                        showAllButton();
                      }}
                    />
                    No filter (All samples)
                  </label>
                </div>
                {!showAllSelect && (
                  <>
                    <CustomCheckBox
                      label={"noRegister"}
                      show={showNoRegisterSelect}
                      setShow={setShowNoRegisterSelect}
                      setParameter={setNoRegisterFilterValue}
                      name={"Nº Register"}
                    />
                    <CustomCheckBox
                      label={"species"}
                      show={showSpeciesSelect}
                      setShow={setShowSpeciesSelect}
                      setParameter={setSpeciesFilterValue}
                      name={"Species"}
                    />
                    <CustomCheckBox
                      label={"naturalSite"}
                      show={showNaturalSiteSelect}
                      setShow={setShowNaturalSiteSelect}
                      setParameter={setNaturalSiteFilterValue}
                      name={"Natural Site"}
                    />
                    <CustomCheckBox
                      label={"altitude"}
                      show={showAltitudeSelect}
                      setShow={setShowAltitudeSelect}
                      setParameter={setAltitudeMaxFilterValue}
                      name={"Altitude"}
                      setParameter2={setAltitudeMinFilterValue}
                    />
                  </>
                )}
              </div>
              {showAllSelect && (
                <div className="relative  mt-2 text-center">
                  <div className="absolute"></div>
                  <p className="font-bold text-red-800">
                    Warning: Pressing the &quot;Filter&quot; button may lead to increased internet data consumption!
                  </p>
                </div>
              )}

              {(showSpeciesSelect ||
                showNoRegisterSelect ||
                showNaturalSiteSelect ||
                showAltitudeSelect
              ) && (
                  <div className="mt-5 grid grid-cols-1 gap-5 rounded border-2 bg-slate-50 p-2 md:grid-cols-3">
                    {showNoRegisterSelect && (
                      <CustomSelect
                        label={"Nº Register"}
                        parameter={noRegister}
                        inputFilterValue={noRegisterFilterValue}
                        setInputFilterValue={setNoRegisterFilterValue}
                      />
                    )}
                    {showSpeciesSelect && (
                      <CustomSelect
                        label={"Species"}
                        parameter={species}
                        inputFilterValue={speciesFilterValue}
                        setInputFilterValue={setSpeciesFilterValue}
                      />
                    )}
                    {showNaturalSiteSelect && (
                      <CustomSelect
                        label={"Natural Site"}
                        parameter={naturalSites}
                        inputFilterValue={naturalSiteFilterValue}
                        setInputFilterValue={setNaturalSiteFilterValue}
                      />
                    )}
                    {showAllSelect && (
                      <div className="mt-4 border-l-4 border-yellow-500 bg-yellow-200 p-4">
                        <p className="font-bold text-yellow-800">
                          Warning: Pressing the &quot;Filter&quot; button may result in high internet usage!
                        </p>
                      </div>
                    )}
                    {showAltitudeSelect && (
                      <div>
                        Altitude
                        <div className="flex space-x-1">
                          <input
                            type="number"
                            autoComplete="off"
                            id="altitudeMin"
                            placeholder="Min"
                            className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:font-bold dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            onChange={(e) => {
                              setAltitudeMinFilterValue(e.target.value);
                            }}
                          />
                          <input
                            type="number"
                            autoComplete="off"
                            id="altitudeMax"
                            placeholder="Max"
                            className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:font-bold dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            onChange={(e) => {
                              setAltitudeMaxFilterValue(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
            <div className="mx-auto max-w-screen-xl">
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 sm:rounded-lg">
                {!loading && samples.length > 0 && (
                  <div className="overflow-x-auto">
                    <div className="text-sm w-full text-left">
                      <Table samples={samples} />
                    </div>
                  </div>
                )}
                {!loading && samples.length === 0 && (
                  <div className="overflow-x-auto">
                    <h1 className="flex items-center justify-center text-xlg text-amber-700 font-bold">
                      There are no samples that meet this filtering criteria. Please adjust the filters and try again.
                    </h1>
                  </div>
                )}
                {loading && samples.length === 0 && (
                  <div className="text-center">
                    <div role="status">
                      <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>      <Footer />

    </div>
  );
}
Page.auth;

export const getServerSideProps = (async () => {
  const { db } = await connectToDatabase();
  const collection = await db.collection('floras');
  const cursor = await collection.find();
  const data = await cursor.toArray();

  const allSpecies = data.map((item) => item.Species.map((species) => species.Name));
  const species = [...new Set(allSpecies.flat())].sort();

  const allNaturalSites = data.map((item) => item['Natural_Site']).filter((item) => item !== null);
  const naturalSites = [...new Set(allNaturalSites.flat())].sort();

  const allNoRegister = data.map((item) => item['_id']);
  const noRegister = [...new Set(allNoRegister.flat())].sort();

  return {
    props: { species: species, naturalSites: naturalSites, noRegister: noRegister }
  };
}) 