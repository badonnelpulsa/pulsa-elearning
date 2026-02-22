import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { quizId, answers } = body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Les champs quizId et answers sont requis" },
        { status: 400 }
      );
    }

    const userId = session.user.id as string;

    // Fetch the quiz with all questions and their options
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz non trouvé" },
        { status: 404 }
      );
    }

    // Calculate score
    let correctCount = 0;
    const total = quiz.questions.length;

    const detailedAnswers = quiz.questions.map((question) => {
      const userAnswer = answers.find(
        (a: { questionId: string; optionIds: string[] }) =>
          a.questionId === question.id
      );

      const correctOptionIds = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.id)
        .sort();

      const selectedOptionIds = (userAnswer?.optionIds || []).sort();

      // Check if selected options match correct options exactly
      const isCorrect =
        correctOptionIds.length === selectedOptionIds.length &&
        correctOptionIds.every(
          (id: string, index: number) => id === selectedOptionIds[index]
        );

      if (isCorrect) {
        correctCount++;
      }

      return {
        questionId: question.id,
        selectedOptionIds: userAnswer?.optionIds || [],
        correctOptionIds,
        isCorrect,
      };
    });

    // Calculate percentage and determine if passed (>= 70%)
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passed = score >= 70;

    // Save quiz result
    const quizResult = await prisma.quizResult.create({
      data: {
        userId,
        quizId,
        score: correctCount,
        total,
        passed,
        answers: JSON.stringify(detailedAnswers),
      },
    });

    return NextResponse.json({
      result: quizResult,
      score,
      passed,
      correctCount,
      total,
      details: detailedAnswers,
    });
  } catch (error) {
    console.error("Erreur lors de la soumission du quiz:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
