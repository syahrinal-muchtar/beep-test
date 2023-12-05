import React from "react";
import { HiSearch, HiUser } from "react-icons/hi";
import useAutoComplete from "./useAutocomplete";
import { Options } from "../../dummyData/dummyOptions";

export default function Home({
  textLabel = "Search",
  textDescription = "Description",
  isDisabled = false,
  isSynchronous = false,
  isSearchOnFocus = false
}) {
  const {
    bindInput,
    bindOptions,
    bindOption,
    isBusy,
    suggestions,
    selectedIndex,
  } = useAutoComplete({
    delay: isSynchronous ? 0 : 500,
    onChange: (value) => console.log(value),
    isSearchOnFocus,
    source: (search) =>
      Options.filter((option) =>
        new RegExp(`^${search}`, "i").test(option.label)
      ),
  });

  return (
    <div className="grid m-5">
      <label>{textLabel}</label>
      <div className="border rounded-sm shadow-md">
        <div className="flex items-center w-full">
          <HiSearch />
          <input
            placeholder="Search"
            className="flex-grow outline-none px-1"
            disabled={isDisabled}
            {...bindInput}
          />
          {isBusy && (
            <div className="w-4 h-4 border-2 border-dashed rounded-full border-slate-500 animate-spin"></div>
          )}
        </div>
        <ul
          {...bindOptions}
          className="w-[300px] scroll-smooth absolute max-h-[260px] overflow-x-hidden overflow-y-auto bg-slate-50 rounded-md mt-1"
        >
          {suggestions.map((_, index) => (
            <li
              className={
                `flex items-center h-[40px] p-1 hover:bg-slate-300 ` +
                (selectedIndex === index && "bg-slate-300")
              }
              key={index}
              {...bindOption}
            >
              <div className="flex items-center space-x-1">
                <HiUser />
                <div>{suggestions[index].label}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <label>{textDescription}</label>
    </div>
  );
}
