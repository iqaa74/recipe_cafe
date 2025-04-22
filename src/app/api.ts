import {
  UseQueryResult,
  useQuery,
  useMutation,
  QueryClient,
} from "@tanstack/react-query";

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
  ratings: number;
  remarks: string;
  strMeal: string;
  idMeal: string;
  createdAt: string;
}

interface FeedbackData {
  name: string;
  email: string;
  ratings: number;
  remarks: string;
  strMeal: string;
}

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const queryClient = new QueryClient();

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

export const useSubmitFeedback = () => {
  return useMutation({
    mutationFn: async (feedbackData: FeedbackData) => {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit feedback");
      }

      return response.json();
    },
    retry: 2, // Number of retry attempts
    onError: (error) => {
      console.error("Mutation error:", error);
    },
    // Optionally invalidate and refetch queries after successful mutation
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
};
