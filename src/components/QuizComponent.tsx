"use client";

import { useState, useCallback } from "react";

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  text: string;
  type: string;
  options: QuizOption[];
  explanation?: string;
}

interface QuizComponentProps {
  quizId: string;
  lessonId: string;
  questions: QuizQuestion[];
}

interface QuizResult {
  score: number;
  total: number;
  answers: Array<{
    questionId: string;
    selectedOptionId: string;
    correctOptionId: string;
    isCorrect: boolean;
  }>;
}

export default function QuizComponent({
  quizId,
  lessonId,
  questions,
}: QuizComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const allAnswered = questions.every((q) => selectedAnswers[q.id]);

  const handleSelectOption = useCallback(
    (questionId: string, optionId: string) => {
      if (result) return;
      setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    },
    [result]
  );

  const goToNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalQuestions]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleSubmit = async () => {
    if (!allAnswered) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          lessonId,
          answers: Object.entries(selectedAnswers).map(
            ([questionId, optionId]) => ({
              questionId,
              selectedOptionId: optionId,
            })
          ),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission du quiz.");
      }

      const data: QuizResult = await response.json();
      setResult(data);
      setShowExplanations(true);
      setCurrentIndex(0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue est survenue."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setResult(null);
    setError(null);
    setShowExplanations(false);
    setCurrentIndex(0);
  };

  const getAnswerResult = (questionId: string) => {
    if (!result) return null;
    return result.answers.find((a) => a.questionId === questionId) || null;
  };

  const scorePercentage = result
    ? Math.round((result.score / result.total) * 100)
    : 0;

  // Result summary screen
  if (result && !showExplanations) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
              scorePercentage >= 70
                ? "bg-green-100"
                : scorePercentage >= 40
                ? "bg-yellow-100"
                : "bg-red-100"
            }`}
          >
            <span
              className={`text-3xl font-bold ${
                scorePercentage >= 70
                  ? "text-green-600"
                  : scorePercentage >= 40
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {scorePercentage}%
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {scorePercentage >= 70
              ? "Excellent travail !"
              : scorePercentage >= 40
              ? "Pas mal, continuez !"
              : "Vous pouvez mieux faire !"}
          </h2>

          <p className="text-gray-500 mb-6">
            Vous avez obtenu{" "}
            <span className="font-semibold text-gray-900">
              {result.score}/{result.total}
            </span>{" "}
            bonnes reponses.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowExplanations(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Voir les corrections
            </button>
            <button
              onClick={handleRetry}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Recommencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Review screen (show explanations) after submission
  if (result && showExplanations) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Score banner */}
        <div
          className={`rounded-xl p-4 flex items-center justify-between ${
            scorePercentage >= 70
              ? "bg-green-50 border border-green-200"
              : scorePercentage >= 40
              ? "bg-yellow-50 border border-yellow-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                scorePercentage >= 70
                  ? "bg-green-200 text-green-800"
                  : scorePercentage >= 40
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {scorePercentage}%
            </div>
            <span className="font-medium text-gray-900">
              Score : {result.score}/{result.total}
            </span>
          </div>
          <button
            onClick={handleRetry}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            Recommencer
          </button>
        </div>

        {/* All questions with results */}
        {questions.map((question, index) => {
          const answerResult = getAnswerResult(question.id);
          const isCorrect = answerResult?.isCorrect ?? false;

          return (
            <div
              key={question.id}
              className={`bg-white rounded-xl shadow-md border-2 p-6 ${
                isCorrect ? "border-green-300" : "border-red-300"
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isCorrect ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <h3 className="text-gray-900 font-semibold">
                  <span className="text-gray-400 mr-1">
                    Q{index + 1}.
                  </span>
                  {question.text}
                </h3>
              </div>

              <div className="space-y-2 ml-11">
                {question.options.map((option) => {
                  const isSelected =
                    answerResult?.selectedOptionId === option.id;
                  const isCorrectOption =
                    answerResult?.correctOptionId === option.id;

                  let optionStyle =
                    "bg-gray-50 border-gray-200 text-gray-600";
                  if (isCorrectOption) {
                    optionStyle =
                      "bg-green-50 border-green-400 text-green-800 font-medium";
                  } else if (isSelected && !isCorrect) {
                    optionStyle =
                      "bg-red-50 border-red-400 text-red-800 line-through";
                  }

                  return (
                    <div
                      key={option.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${optionStyle}`}
                    >
                      <div className="flex-shrink-0">
                        {isCorrectOption ? (
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : isSelected ? (
                          <svg
                            className="w-5 h-5 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                      <span className="text-sm">{option.text}</span>
                    </div>
                  );
                })}
              </div>

              {question.explanation && (
                <div className="mt-4 ml-11 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                    <p className="text-sm text-blue-800">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="text-center pt-4">
          <button
            onClick={handleRetry}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Recommencer le quiz
          </button>
        </div>
      </div>
    );
  }

  // Active quiz screen (answering questions)
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Progress bar */}
        <div className="bg-gray-100 h-2">
          <div
            className="bg-indigo-600 h-2 transition-all duration-300 ease-out"
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Question navigation dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {questions.map((q, index) => {
              const isAnswered = !!selectedAnswers[q.id];
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(index)}
                  className={`w-8 h-8 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2"
                      : isAnswered
                      ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                  aria-label={`Question ${index + 1}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Question counter */}
          <div className="text-sm text-gray-400 mb-2">
            Question {currentIndex + 1} sur {totalQuestions}
          </div>

          {/* Question text */}
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option) => {
              const isSelected =
                selectedAnswers[currentQuestion.id] === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() =>
                    handleSelectOption(currentQuestion.id, option.id)
                  }
                  className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentIndex === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Precedent
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={goToNext}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Suivant
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  allAnswered && !submitting
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Envoi...
                  </>
                ) : (
                  <>
                    Soumettre
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Unanswered warning */}
          {currentIndex === totalQuestions - 1 && !allAnswered && (
            <p className="text-center text-sm text-amber-600 mt-4">
              Veuillez repondre a toutes les questions avant de soumettre.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
