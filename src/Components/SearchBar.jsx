import React, { useState, useEffect } from "react";

const SearchBar = ({ onSearch = () => { } }) => { // Default function to prevent errors
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query, onSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form  className="flex items-center space-x-2 mb-5">
      <input
        type="text"
        placeholder="Search your trips..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
        className="w-full sm:w-80 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
};

export default SearchBar;
