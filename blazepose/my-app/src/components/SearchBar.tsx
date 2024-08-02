import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xs">
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-0 sm:text-sm"
        placeholder="검색"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 4a6 6 0 110 12 6 6 0 010-12zm0 0v2a2 2 0 01-2 2H6m12 2v4h-4m0 0v-4m0 0h4m-6 2h4"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
