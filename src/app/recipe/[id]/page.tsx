"use client";

import { useMealById } from "../../api";
import { use, useState } from "react";

interface FeedbackForm {
  name: string;
  email: string;
  rating: number;
  comment: string;
}

interface Ingredient {
  name: string;
  measure: string;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: meal, isLoading, error } = useMealById(resolvedParams.id);
  const [feedback, setFeedback] = useState<FeedbackForm>({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  });
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [completedInstructions, setCompletedInstructions] = useState<number[]>(
    []
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!meal) return <div>Meal not found</div>;

  // Extract ingredients and measures from meal data
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof typeof meal];
    const measure = meal[`strMeasure${i}` as keyof typeof meal];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        name: ingredient,
        measure: measure || "",
      });
    }
  }

  const handleIngredientToggle = (ingredientName: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((name) => name !== ingredientName)
        : [...prev, ingredientName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log("Feedback submitted:", feedback);
    setIsSubmitted(true);
    // Reset form after submission
    setFeedback({
      name: "",
      email: "",
      rating: 0,
      comment: "",
    });
  };

  const handleInstructionToggle = (index: number) => {
    setCompletedInstructions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFeedback({ ...feedback, rating: star })}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-8 w-8 ${
                star <= (hoveredStar || feedback.rating)
                  ? "text-yellow-400"
                  : "text-white-300"
              } transition-colors duration-150`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-8">
      {/* Recipe content */}
      <div className="bg-[#FFC5D3] rounded-lg overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/2 p-6">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Ingredients */}
          <div className="md:w-1/2 p-6">
            <h2 className="text-xl text-gray-800 dark:text-black font-semibold mb-4">
              Ingredients
            </h2>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-white-700 rounded-lg text-gray-800 dark:text-black"
                >
                  <input
                    type="checkbox"
                    id={`ingredient-${index}`}
                    checked={selectedIngredients.includes(ingredient.name)}
                    onChange={() => handleIngredientToggle(ingredient.name)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`ingredient-${index}`}
                    className="flex-1 flex justify-between items-center cursor-pointer"
                  >
                    <span>{ingredient.name}</span>
                    <span className="text-sm text-gray-500">
                      {ingredient.measure}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-black">
            {meal.strMeal}
          </h1>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-[#FB6F92] rounded-full text-sm">
              {meal.strCategory}
            </span>
            <span className="px-3 py-1 bg-[#FB6F92] rounded-full text-sm">
              {meal.strArea}
            </span>
          </div>
          <div className="space-y-2">
            {meal.strInstructions
              .split(".")
              .filter((instruction) => instruction.trim())
              .map((instruction, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-white-700 rounded-lg text-gray-800 dark:text-black"
                >
                  <input
                    type="checkbox"
                    id={`instruction-${index}`}
                    checked={completedInstructions.includes(index)}
                    onChange={() => handleInstructionToggle(index)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`instruction-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {instruction.trim()}.
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* Feedback Form */}
      <div className="bg-[#FFC5D3] rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-black">
          Leave Feedback
        </h2>
        {isSubmitted ? (
          <div className="text-green-500 text-center py-4">
            Thank you for your feedback!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2 text-gray-800 dark:text-black"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={feedback.name}
                onChange={(e) =>
                  setFeedback({ ...feedback, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-gray-800 dark:text-black"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={feedback.email}
                onChange={(e) =>
                  setFeedback({ ...feedback, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-black">
                Rate this recipe
              </label>
              {renderStars()}
            </div>

            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium mb-2 text-gray-800 dark:text-black"
              >
                Comments
              </label>
              <textarea
                id="comment"
                rows={4}
                value={feedback.comment}
                onChange={(e) =>
                  setFeedback({ ...feedback, comment: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Share your experience with this recipe..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={!feedback.rating || !feedback.name || !feedback.email}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
