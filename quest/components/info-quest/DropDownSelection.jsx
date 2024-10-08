"use client";

import { useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const DropDownSelection = ({ selectionOptions, onChange }) => {
  // Default selected the first item in the options.
  const [selected, setSelected] = useState(selectionOptions[0]);
  const handleChange = (value) => {
    setSelected(value);
    if (onChange) {
      // The value is the selectionOption object passed down by the parent component.
      onChange(value.title);
    }
  }

  return (
    <Listbox value={selected} onChange={handleChange}>
      <Label className="sr-only">Change published status</Label>
      <div className="relative">
        <div className="inline-flex divide-x divide-indigo-700 rounded-md shadow-sm">
          <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-custom-secondary px-3 py-2 text-custom-primary border border-solid border-custom-accent shadow-sm">
            <CheckIcon aria-hidden="true" className="-ml-0.5 h-5 w-5" />
            <p className="text-sm font-semibold">{selected.title}</p>
          </div>
          <ListboxButton className="inline-flex items-center rounded-l-none rounded-r-md bg-custom-secondary p-2">
            <span className="sr-only">Change published status</span>
            <ChevronDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-white"
            />
          </ListboxButton>
        </div>

        <ListboxOptions
          transition
          className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
        >
          {selectionOptions.map((option) => (
            <ListboxOption
              key={option.title}
              value={option}
              className="group cursor-default select-none p-4 text-sm text-gray-900 data-[focus]:bg-custom-accent data-[focus]:text-custom-primary"
            >
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <p className="font-normal group-data-[selected]:font-semibold">
                    {option.title}
                  </p>
                  <span className="text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                    <CheckIcon aria-hidden="true" className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-2 text-gray-500 group-data-[focus]:text-custom-secondary">
                  {option.description}
                </p>
              </div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

export default DropDownSelection;
