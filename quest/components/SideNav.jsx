"use client";

import { MapIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import clsx from "clsx";

const navigation = [
  { name: "Home", href: "/", icon: MapIcon },
  { name: "Quest", href: "/quest", icon: AcademicCapIcon },
  { name: "Management", href: "/management", icon: AcademicCapIcon },
];

export default function SideNav() {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 h-screen bg-custom-black">
      <nav className="flex flex-1 flex-col items-center">
        <ul role="list" className="-mx-2 space-y-5">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={clsx(
                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon aria-hidden="true" className="h-6 w-6 shrink-0 bg-custom-grey" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
