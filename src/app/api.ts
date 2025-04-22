import { UseQueryResult, useQuery } from "@tanstack/react-query";

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string;
  strYoutube: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strMeasure1?: string;
  strMeasure2?: string;
}

interface MealResponse {
  meals: Meal[] | null;
}

interface Feedback {
  id: number;
  name: string;
  email: string;
  rating: number;
  remarks: string;
  strMeal: string;
  idMeal: string;
  createdAt: string;
}

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Fetch random meal
export const useRandomMeal = (): UseQueryResult<Meal, Error> => {
  return useQuery({
    queryKey: ["randomMeal"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data: MealResponse = await response.json();
      return data.meals![0];
    },
  });
};

// Fetch meal by ID
export const useMealById = (id: string): UseQueryResult<Meal, Error> => {
  return useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data: MealResponse = await response.json();
      return data.meals![0];
    },
    enabled: !!id,
  });
};

// Search meals by name
export const useSearchMeals = (
  query: string
): UseQueryResult<Meal[], Error> => {
  return useQuery({
    queryKey: ["searchMeals", query],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
      const data: MealResponse = await response.json();
      return data.meals || [];
    },
    enabled: !!query,
  });
};

// List all categories
export const useCategories = (): UseQueryResult<string[], Error> => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/list.php?c=list`);
      const data = await response.json();
      return data.meals.map((cat: { strCategory: string }) => cat.strCategory);
    },
  });
};

// Filter by category
export const useMealsByCategory = (
  category: string
): UseQueryResult<Meal[], Error> => {
  return useQuery({
    queryKey: ["mealsByCategory", category],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
      const data: MealResponse = await response.json();
      return data.meals || [];
    },
    enabled: !!category,
  });
};

// List all areas
export const useAreas = (): UseQueryResult<string[], Error> => {
  return useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/list.php?a=list`);
      const data = await response.json();
      return data.meals.map((area: { strArea: string }) => area.strArea);
    },
  });
};

// Filter by area
export const useMealsByArea = (area: string): UseQueryResult<Meal[], Error> => {
  return useQuery({
    queryKey: ["mealsByArea", area],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/filter.php?a=${area}`);
      const data: MealResponse = await response.json();
      return data.meals || [];
    },
    enabled: !!area,
  });
};

// Add this new function to fetch all meals
export const useAllMeals = (): UseQueryResult<Meal[], Error> => {
  return useQuery({
    queryKey: ["allMeals"],
    queryFn: async () => {
      // Create an array of letters (a-z) to fetch all meals
      const alphabet = Array.from("abcdefghijklmnopqrstuvwxyz");

      // Fetch meals for each letter in parallel
      const promises = alphabet.map(async (letter) => {
        const response = await fetch(`${BASE_URL}/search.php?f=${letter}`);
        const data: MealResponse = await response.json();
        return data.meals || [];
      });

      // Wait for all requests to complete
      const results = await Promise.all(promises);

      // Flatten the array of arrays and remove duplicates based on idMeal
      const allMeals = results.flat();
      const uniqueMeals = Array.from(
        new Map(allMeals.map((meal) => [meal.idMeal, meal])).values()
      );

      return uniqueMeals;
    },
  });
};

export const useFeedback = (): UseQueryResult<Feedback[], Error> => {
  return useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const response = await fetch("/api/feedback");
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      return response.json();
    },
  });
};
