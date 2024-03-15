"use client";

import { useMemo, useState } from "react";

type Item = {
  id: number;
  firstName: string;
  maidenName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
};

type Filter = {
  code: Exclude<keyof Item, "id">;
  label: string;
};

type Props = {
  data: Item[];
};

const SEARCH_FILTERS: Filter[] = [
  { code: "firstName", label: "First Name" },
  { code: "maidenName", label: "Maiden Name" },
  { code: "lastName", label: "Last Name" },
  { code: "age", label: "Age" },
  { code: "gender", label: "Gender" },
  { code: "email", label: "E-mail Address" }
];

// Improvements
// - Server-side fetching: Fetch data from API
// - Pagination: Paginate data to load the page faster
// - Advanced Filtering: Allow more complex searching such as multiple fields
// - Accessibility: Add support to screen readers and keyboard users
// - Debouncing: Limiting the number of searches while typing

const Search = ({ data }: Props) => {
  const [filter, setFilter] = useState(SEARCH_FILTERS[0]);
  const [query, setQuery] = useState("");
  const filteredData = useMemo(
    () =>
      data.filter(item => {
        if (filter.code === "gender" && query) {
          return item.gender.toLowerCase() === query.toLowerCase();
        }

        return item[filter.code].toString().toLowerCase().includes(query.toLowerCase());
      }),
    [data, filter, query]
  );

  const handleChangeFilter = (i: number) => {
    setFilter(SEARCH_FILTERS[i]);
  };

  const titleCase = (str: string) =>
    str.split(" ").map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase());

  return (
    <div className="mx-5 my-3">
      <div className="flex items-center mb-5">
        <div className="text-3xl mr-auto">Real-time Search for Users</div>
        <input
          className="px-2 border border-black"
          type="text"
          placeholder={`Enter ${filter.label}`}
          onChange={e => setQuery(e.target.value)}
          value={query}
        />
        <select className="ml-2 text-black border border-black" onChange={e => handleChangeFilter(+e.target.value)}>
          {SEARCH_FILTERS.map((item, i) => (
            <option key={item.code} value={i}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full mb-3">
        <thead>
          <tr>
            <th className="text-left">ID</th>
            {SEARCH_FILTERS.map(item => (
              <th className="text-left" key={item.code} style={{ width: `${100 / (SEARCH_FILTERS.length + 1)}%` }}>
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map(data => (
            <tr key={data.id}>
              <td>{data.id}</td>
              {SEARCH_FILTERS.map(item => (
                <td key={item.code}>{item.code === "gender" ? titleCase(data[item.code]) : data[item.code]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right text-md font-bold">
        {query.length > 0 && `${filteredData.length} ${filteredData.length > 1 ? "users" : "user"} found`}
      </div>
    </div>
  );
};

export { Search };
