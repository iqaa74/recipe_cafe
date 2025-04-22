"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  remarks: string;
  strMeal: string;
  idMeal: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Temporary mock data - replace this with actual API call
  useEffect(() => {
    const mockFeedbacks: Feedback[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        rating: 5,
        remarks: "This recipe was amazing! Will definitely make it again.",
        strMeal: "Spaghetti Carbonara",
        idMeal: "52982",
        createdAt: "2024-01-20T10:00:00Z",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        rating: 4,
        remarks: "Great recipe, but I added more garlic.",
        strMeal: "Chicken Tikka Masala",
        idMeal: "52972",
        createdAt: "2024-01-19T15:30:00Z",
      },
    ];
    setFeedbacks(mockFeedbacks);
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
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

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-black">
        Recipe Feedback
      </h1>

      <div className="grid gap-6">
        {feedbacks.map((feedback) => (
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
              {renderStars(feedback.rating)}
            </div>

            <p className="text-gray-700 dark:text-gray-800">
              {feedback.remarks}
            </p>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
              <span>{feedback.email}</span>
            </div>
          </div>
        ))}
      </div>

      {feedbacks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No feedback available yet.
        </div>
      )}
    </div>
  );
}
