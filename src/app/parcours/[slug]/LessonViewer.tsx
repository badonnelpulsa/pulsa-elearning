"use client";

import { useState, useCallback } from "react";
import QuizComponent from "@/components/QuizComponent";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: string;
  explanation: string | null;
  order: number;
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  type: string;
  videoUrl: string | null;
  order: number;
  quiz: Quiz | null;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  modules: Module[];
}

interface LessonViewerProps {
  course: Course;
  completedLessonIds: string[];
  isAuthenticated: boolean;
}

export default function LessonViewer({
  course,
  completedLessonIds: initialCompleted,
  isAuthenticated,
}: LessonViewerProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(initialCompleted)
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    course.modules[0]?.lessons[0]?.id || null
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [marking, setMarking] = useState(false);

  // Find the selected lesson
  let selectedLesson: Lesson | null = null;
  let selectedModule: Module | null = null;
  for (const mod of course.modules) {
    const found = mod.lessons.find((l) => l.id === selectedLessonId);
    if (found) {
      selectedLesson = found;
      selectedModule = mod;
      break;
    }
  }

  const markAsCompleted = useCallback(async () => {
    if (!selectedLessonId || !isAuthenticated || marking) return;
    setMarking(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: selectedLessonId }),
      });
      if (res.ok) {
        setCompletedIds((prev) => new Set(prev).add(selectedLessonId));
      }
    } finally {
      setMarking(false);
    }
  }, [selectedLessonId, isAuthenticated, marking]);

  // Navigate to next lesson
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === selectedLessonId);
  const nextLesson = currentIdx >= 0 ? allLessons[currentIdx + 1] : null;
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-80" : "w-0"} flex-shrink-0 transition-all overflow-hidden`}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {course.modules.map((mod) => (
            <div key={mod.id} className="border-b border-gray-100 last:border-0">
              <div className="px-4 py-3 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900">
                  Module {mod.order}: {mod.title}
                </h3>
              </div>
              <ul>
                {mod.lessons.map((lesson) => {
                  const isActive = lesson.id === selectedLessonId;
                  const isDone = completedIds.has(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => setSelectedLessonId(lesson.id)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors cursor-pointer ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isDone
                              ? "bg-green-500 border-green-500"
                              : isActive
                                ? "border-indigo-500"
                                : "border-gray-300"
                          }`}
                        >
                          {isDone && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="line-clamp-1">{lesson.title}</span>
                        {lesson.quiz && (
                          <span className="ml-auto text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            Quiz
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Toggle sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
        >
          <svg
            className={`w-4 h-4 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
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
          {sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
        </button>

        {selectedLesson ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {/* Lesson header */}
            <div className="mb-6">
              {selectedModule && (
                <p className="text-sm text-indigo-600 font-medium mb-1">
                  Module {selectedModule.order}: {selectedModule.title}
                </p>
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedLesson.title}
              </h2>
            </div>

            {/* Lesson content */}
            <div className="prose prose-gray max-w-none mb-8">
              {selectedLesson.content.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Quiz section */}
            {selectedLesson.quiz && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {selectedLesson.quiz.title}
                </h3>
                {isAuthenticated ? (
                  <QuizComponent
                    quizId={selectedLesson.quiz.id}
                    lessonId={selectedLesson.id}
                    questions={selectedLesson.quiz.questions.map((q) => ({
                      id: q.id,
                      text: q.text,
                      type: q.type,
                      options: q.options.map((o) => ({
                        id: o.id,
                        text: o.text,
                      })),
                      explanation: q.explanation || undefined,
                    }))}
                  />
                ) : (
                  <p className="text-gray-500 text-center py-6">
                    Connectez-vous pour accéder au quiz.
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-3">
                {prevLesson && (
                  <button
                    onClick={() => setSelectedLessonId(prevLesson.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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
                    Précédent
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isAuthenticated && !completedIds.has(selectedLesson.id) && (
                  <button
                    onClick={markAsCompleted}
                    disabled={marking}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {marking ? "..." : "Marquer comme terminé"}
                  </button>
                )}
                {completedIds.has(selectedLesson.id) && (
                  <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
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
                    Terminé
                  </span>
                )}
                {nextLesson && (
                  <button
                    onClick={() => setSelectedLessonId(nextLesson.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
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
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">
              Sélectionnez une leçon pour commencer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
