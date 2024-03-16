"use client";

import { useMemo, useState } from "react";

type User = {
  id: number;
  firstName: string;
  maidenName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
};

type Filter = {
  code: Exclude<keyof User, "id">;
  label: string;
};

type Props = {
  data: User[];
};

// An array of filters that will be used for searching.
const SEARCH_FILTERS: Filter[] = [
  { code: "firstName", label: "First Name" },
  { code: "maidenName", label: "Maiden Name" },
  { code: "lastName", label: "Last Name" },
  { code: "age", label: "Age" },
  { code: "gender", label: "Gender" },
  { code: "email", label: "E-mail Address" }
];

// Future improvements to consider:
// - Server-side fetching and storing: Fetch data from API and store data to database
// - Pagination: Paginate data to load the page faster
// - Advanced Filtering: Allow more complex searching such as multiple fields
// - Accessibility: Add support to screen readers and keyboard users
// - Debouncing: Limiting the number of searches while typing

/**
 * Search component that provides real-time searching functionality.
 * It allows users to search through a list of users based on various filters and a text query.
 *
 * @param {User[]} data - The array of `User` objects to be searched.
 *
 * @returns A JSX Element rendering:
 * - A title indicating the purpose of the component.
 * - An input field for entering the search query.
 * - A dropdown select box for choosing the search filter.
 * - A table displaying the search results.
 * - A summary message showing the number of results found.
 */
const Search = ({ data }: Props) => {
  // State for the selected search filter and search query text.
  const [searchFilter, setSearchFilter] = useState(SEARCH_FILTERS[0]);
  const [query, setQuery] = useState("");

  // Memoize filteredData to recompute only when data, query, or search filter changes.
  const filteredData = useMemo(
    () =>
      data.filter(user => {
        if (searchFilter.code === "gender" && query) {
          return user.gender.toLowerCase() === query.toLowerCase(); // Special case for gender to match exactly.
        }

        // Check if the user's property includes the query string (case-insensitive).
        return user[searchFilter.code].toString().toLowerCase().includes(query.toLowerCase());
      }),
    [data, query, searchFilter.code]
  );

  // Function to handle changing the search filter.
  const handleChangeFilter = (i: number) => {
    setSearchFilter(SEARCH_FILTERS[i]);
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
          placeholder={`Enter ${searchFilter.label}`}
          onChange={e => setQuery(e.target.value)}
          value={query}
        />
        <select className="ml-2 text-black border border-black" onChange={e => handleChangeFilter(+e.target.value)}>
          {SEARCH_FILTERS.map((filter, i) => (
            <option key={filter.code} value={i}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full mb-3">
        <thead>
          <tr>
            <th className="text-left">ID</th>
            {SEARCH_FILTERS.map(filter => (
              // Set each column width dynamically based on the number of filters + 1 for ID.
              <th className="text-left" key={filter.code} style={{ width: `${100 / (SEARCH_FILTERS.length + 1)}%` }}>
                {filter.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map(data => (
            <tr key={data.id}>
              <td>{data.id}</td>
              {SEARCH_FILTERS.map(filter => (
                <td key={filter.code}>{filter.code === "gender" ? titleCase(data[filter.code]) : data[filter.code]}</td>
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
