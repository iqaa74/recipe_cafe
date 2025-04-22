"use client";

import { useFeedback } from "../api";
import Link from "next/link";

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

export default function FeedbackPage() {
  const { data: feedbacks, isLoading, error } = useFeedback();

  const renderStars = (ratings: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              star <= ratings ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading feedback: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-black">
        Recipe Feedback
      </h1>

      <div className="grid gap-6">
        {feedbacks?.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-[#FFC5D3] rounded-lg shadow-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-black">
                  {feedback.name}
                </h2>
                <Link
                  href={`/recipe/${feedback.idMeal}`}
                  className="text-[#FB6F92] hover:text-[#fa5d85] font-medium"
                >
                  {feedback.strMeal}
                </Link>
              </div>
              {renderStars(feedback.ratings)}
            </div>

            <p className="text-gray-700 dark:text-gray-800">
              {feedback.remarks}
            </p>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>
                {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>{feedback.email}</span>
            </div>
          </div>
        ))}

        {(!feedbacks || feedbacks.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No feedback available yet.
          </div>
        )}
      </div>
    </div>
  );
}
