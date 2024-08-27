import Questions from "@/components/questions";
import { categoryOptions, difficultyOptions } from "@/constants";
import { redirect } from "next/navigation";
import "./questions.css";

type Props = {
  searchParams: {
    category: string;
    difficulty: string;
    limit: string;
  };
};

async function getData(category: string, limit: string) {
  // Replace the API endpoint with your Flask API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(
    `${apiUrl}/questions?category=${category}&limit=${limit}&status=1`, {
      cache: 'no-store'
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const QuestionsPage = async ({ searchParams }: Props) => {
  const category = searchParams.category as string;
  const difficulty = searchParams.difficulty;  // Assuming this is being used for filtering in your component
  const limit = searchParams.limit;

  const validateCategory = (category: string) => {
    const validCategories = categoryOptions.map((option) => option.value);
    return validCategories.includes(category);
  };

  const validateDifficulty = (difficulty: string) => {
    const validDifficulties = difficultyOptions.map((option) => option.value);
    return validDifficulties.includes(difficulty);
  };

  const validateLimit = (limit: string) => {
    const parsedLimit = parseInt(limit, 10);
    return !isNaN(parsedLimit) && parsedLimit >= 5 && parsedLimit <= 50;
  };

  if (
    !validateCategory(category) ||
    !validateDifficulty(difficulty) ||
    !validateLimit(limit)
  ) {
    return redirect("/");
  }

  try {
    const response = await getData(category, limit);
    return (
      <Questions
        questions={response}  // Assuming Questions component can handle the structure
        limit={parseInt(limit, 10)}
        category={category}
      />
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    return <p>Failed to load questions. Please try again later.</p>;
  }
};

export default QuestionsPage;
