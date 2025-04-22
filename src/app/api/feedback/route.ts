import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return Response.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
