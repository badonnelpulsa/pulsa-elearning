import { prisma } from "@/lib/prisma";
import CourseCard from "@/components/CourseCard";

export default async function ParcoursPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      modules: {
        include: {
          _count: {
            select: { lessons: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Nos parcours de formation
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          Explorez nos formations en IA Générative pour l&apos;industrie et
          développez vos compétences à votre rythme.
        </p>
      </div>

      {/* Course grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const totalLessons = course.modules.reduce(
              (acc, mod) => acc + mod._count.lessons,
              0
            );
            return (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                slug={course.slug}
                description={course.description}
                category={course.category}
                difficulty={course.difficulty}
                duration={course.duration}
                totalModules={course.modules.length}
                totalLessons={totalLessons}
                imageUrl={course.imageUrl ?? undefined}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucune formation disponible
          </h3>
          <p className="text-gray-400">
            De nouvelles formations seront bientôt disponibles.
          </p>
        </div>
      )}
    </div>
  );
}
