"use client";

import { useAllMeals, useSearchMeals } from "./api";
import Link from "next/link";
import { useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
import Image from "next/image";

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
}

const MEALS_PER_PAGE = 12;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: allMeals = [], isLoading: isLoadingAll } = useAllMeals();
  const { data: searchResults = [], isLoading: isLoadingSearch } =
    useSearchMeals(debouncedSearch);

  // Determine which meals to display
  const displayMeals = debouncedSearch ? searchResults : allMeals;
  const isLoading = debouncedSearch ? isLoadingSearch : isLoadingAll;

  // Calculate pagination
  const totalPages = Math.ceil(displayMeals.length / MEALS_PER_PAGE);
  const startIndex = (currentPage - 1) * MEALS_PER_PAGE;
  const paginatedMeals = displayMeals.slice(
    startIndex,
    startIndex + MEALS_PER_PAGE
  );

  // Reset to first page when search changes
  if (searchTerm && currentPage !== 1) {
    setCurrentPage(1);
  }

  const renderPagination = () => {
    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  const renderMealGrid = (meals: Meal[]) => {
    if (!Array.isArray(meals)) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {meals.map((meal) => (
          <Link
            href={`/recipe/${meal.idMeal}`}
            key={meal.idMeal}
            className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full h-[200px]">
              {" "}
              {/* Fixed height container */}
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                unoptimized // Add this if images are not loading
              />
            </div>
            <div className="p-4">
              <h2
                className="text-xl font-semibold mb-2 line-clamp-1"
                title={meal.strMeal}
              >
                {meal.strMeal}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                  {meal.strCategory}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                  {meal.strArea}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 bg-[#F2F1ED] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-black"
        />
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading meals...</p>
        </div>
      )}

      {!isLoading && !displayMeals && (
        <div className="text-center py-8 text-red-500">Error loading meals</div>
      )}

      {!isLoading && searchTerm && displayMeals.length === 0 && (
        <div className="text-center py-8">
          No recipes found for &quot;{searchTerm}&quot;
        </div>
      )}

      {!isLoading && displayMeals && displayMeals.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-black-400">
            Showing {startIndex + 1}-
            {Math.min(startIndex + MEALS_PER_PAGE, displayMeals.length)} of{" "}
            {displayMeals.length} recipes
          </div>
          {renderMealGrid(paginatedMeals)}
          {renderPagination()}
        </>
      )}
    </div>
  );
}
