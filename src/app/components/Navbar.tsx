"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMealById } from "../api";

export default function Navbar() {
  const pathname = usePathname();
  const mealId = pathname.startsWith("/recipe/")
    ? pathname.split("/")[2]
    : null;
  const { data: meal } = useMealById(mealId || "");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#ffe1e1]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/chef.jpg"
              alt="Chef Logo"
              width={90}
              height={90}
              className="text-blue-500"
            />
            <span className="text-xl font-bold text-gray-800 dark:text-black">
              {mealId ? meal?.strMeal : "Recipe Cafe"}
            </span>
          </Link>

          {/* Add Feedback Link */}
          <Link
            href="/feedback"
            className="px-4 py-2 bg-[#FB6F92] text-white rounded-lg hover:bg-[#fa5d85] transition-colors"
          >
            Feedback
          </Link>
        </div>
      </div>
    </nav>
  );
}
