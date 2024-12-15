import isValidDate from "@/utils/isValidDate";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

export interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
}

const FilterData = ({ options }: Props) => {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  const [search, setSearch] = useState<string>(
    (router.query.search as string) || ""
  );

  const [option, setOption] = useState<string>(
    (router.query.option as string) || ""
  );

  const [dateStart, setDateStart] = useState<string>(
    isValidDate(router.query.dateStart as string)
      ? (router.query.dateStart as string)
      : ""
  );
  const [dateEnd, setDateEnd] = useState<string>(
    isValidDate(router.query.dateEnd as string)
      ? (router.query.dateEnd as string)
      : ""
  );

  useEffect(() => {
    if (!isValidDate(router.query.dateStart as string)) {
      handleFilterChange({ dateStart: undefined });
    }
    if (!isValidDate(router.query.dateEnd as string)) {
      handleFilterChange({ dateEnd: undefined });
    }
  }, [router.query.dateStart, router.query.dateEnd]);

  const handleFilterChange = (newQuery: {
    [key: string]: string | undefined;
  }) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...newQuery,
        page: "1",
      },
    });
  };

  const newOptions: Option[] = [...options, { label: "Semua", value: "" }];

  return (
    <div className="flex flex-col md:flex-row space-y-4 justify-between md:items-center">
      {/* Input Search */}

      <div className="flex flex-col space-y-2 w-full md:w-1/3">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only">
          Cari
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cari..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange({ search: e.target.value });
            }}
            ref={searchRef}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-2">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          {/* Date Start */}
          <div className="flex flex-col gap-2 w-full h-fit">
            <label className="text-sm font-medium text-gray-900">
              Tanggal Awal
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <input
                type="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                value={
                  dateStart
                    ? new Date(dateStart).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    const isoDate = new Date(value).toISOString();
                    setDateStart(isoDate);
                    handleFilterChange({ dateStart: isoDate });
                  } else {
                    setDateStart("");
                    handleFilterChange({ dateStart: undefined });
                  }
                }}
              />
            </div>
          </div>

          {/* Date End */}
          <div className="flex flex-col gap-2 w-full h-fit">
            <label className="text-sm font-medium text-gray-900">
              Tanggal Akhir
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <input
                type="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                value={
                  dateEnd ? new Date(dateEnd).toISOString().split("T")[0] : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    const isoDate = new Date(value).toISOString();
                    setDateEnd(isoDate);
                    handleFilterChange({ dateEnd: isoDate });
                  } else {
                    setDateEnd("");
                    handleFilterChange({ dateEnd: undefined });
                  }
                }}
              />
            </div>
          </div>
        </div>

        <select
          className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setOption(e.target.value);
            handleFilterChange({ option: e.target.value });
          }}
          value={option}
        >
          {newOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterData;
