import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProgressCircle from "@/components/ProgressCircle";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/connexion");
  }

  const userId = session.user.id;

  // Fetch user progress across all courses
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      modules: {
        include: {
          lessons: {
            select: { id: true },
          },
        },
      },
      certificates: {
        where: { userId },
      },
    },
  });

  const userProgress = await prisma.progress.findMany({
    where: { userId, completed: true },
    select: { lessonId: true },
  });

  const completedLessonIds = new Set(userProgress.map((p) => p.lessonId));

  const courseStats = courses.map((course) => {
    const allLessonIds = course.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );
    const completedCount = allLessonIds.filter((id) =>
      completedLessonIds.has(id)
    ).length;
    const percentage =
      allLessonIds.length > 0
        ? Math.round((completedCount / allLessonIds.length) * 100)
        : 0;

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      category: course.category,
      totalLessons: allLessonIds.length,
      completedLessons: completedCount,
      percentage,
      hasCertificate: course.certificates.length > 0,
    };
  });

  const startedCourses = courseStats.filter((c) => c.completedLessons > 0);
  const totalCompleted = courseStats.filter((c) => c.percentage === 100).length;

  // Fetch badges
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
    take: 6,
  });

  // Fetch certificates
  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: { select: { title: true, slug: true } },
    },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, {session.user.name} !
        </h1>
        <p className="mt-2 text-gray-500">
          Suivez votre progression et continuez votre apprentissage.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-3xl font-bold text-indigo-600">
            {startedCourses.length}
          </div>
          <div className="text-sm text-gray-500 mt-1">Cours en cours</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-3xl font-bold text-green-600">
            {totalCompleted}
          </div>
          <div className="text-sm text-gray-500 mt-1">Cours terminés</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-3xl font-bold text-amber-600">
            {userBadges.length}
          </div>
          <div className="text-sm text-gray-500 mt-1">Badges obtenus</div>
        </div>
      </div>

      {/* Course Progress */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Ma progression
        </h2>
        {startedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startedCourses.map((course) => (
              <Link
                key={course.id}
                href={`/parcours/${course.slug}`}
                className="block"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 mr-4">
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        {course.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mt-2 line-clamp-2">
                        {course.title}
                      </h3>
                    </div>
                    <ProgressCircle percentage={course.percentage} size={64} />
                  </div>
                  <div className="text-sm text-gray-400">
                    {course.completedLessons}/{course.totalLessons} leçons
                    complétées
                  </div>
                  {course.hasCertificate && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-green-600 font-medium">
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
                      Certificat obtenu
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
            <p className="text-gray-500 mb-4">
              Vous n&apos;avez pas encore commencé de cours.
            </p>
            <Link
              href="/parcours"
              className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Découvrir les parcours
            </Link>
          </div>
        )}
      </section>

      {/* Certificates */}
      {certificates.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Mes certificats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-6 flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {cert.course.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Code : {cert.code} — Délivré le{" "}
                    {new Date(cert.issuedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Badges */}
      {userBadges.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Mes badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {userBadges.map((ub) => (
              <div
                key={ub.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mb-2">
                  <span className="text-2xl">{ub.badge.icon}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">
                  {ub.badge.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
