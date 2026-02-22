import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import LessonViewer from "./LessonViewer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              quiz: {
                include: {
                  questions: {
                    orderBy: { order: "asc" },
                    include: { options: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Get user progress if authenticated
  let completedLessonIds: string[] = [];
  if (session?.user) {
    const allLessonIds = course.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );
    const progress = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
        lessonId: { in: allLessonIds },
        completed: true,
      },
      select: { lessonId: true },
    });
    completedLessonIds = progress.map((p) => p.lessonId);
  }

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );

  const difficultyLabels: Record<string, string> = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Course Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {course.category}
          </span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {difficultyLabels[course.difficulty] || course.difficulty}
          </span>
          <span className="text-xs text-gray-400">{course.duration}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {course.title}
        </h1>
        <p className="text-lg text-gray-500 max-w-3xl">{course.description}</p>
        <div className="mt-4 text-sm text-gray-400">
          {course.modules.length} module{course.modules.length > 1 ? "s" : ""}{" "}
          — {totalLessons} leçon{totalLessons > 1 ? "s" : ""}
          {session?.user && (
            <span className="ml-3">
              — {completedLessonIds.length}/{totalLessons} complétées
            </span>
          )}
        </div>
      </div>

      {/* Course content */}
      <LessonViewer
        course={course}
        completedLessonIds={completedLessonIds}
        isAuthenticated={!!session?.user}
      />
    </div>
  );
}
