import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Le paramètre courseId est requis" },
        { status: 400 }
      );
    }

    const userId = session.user.id as string;

    // Get all lessons for the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Cours non trouvé" },
        { status: 404 }
      );
    }

    const allLessonIds = course.modules.flatMap((module) =>
      module.lessons.map((lesson) => lesson.id)
    );

    // Get user progress for these lessons
    const progress = await prisma.progress.findMany({
      where: {
        userId,
        lessonId: { in: allLessonIds },
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            moduleId: true,
          },
        },
      },
    });

    const completedLessons = progress.filter((p) => p.completed);

    return NextResponse.json({
      courseId,
      totalLessons: allLessonIds.length,
      completedLessons: completedLessons.length,
      percentage:
        allLessonIds.length > 0
          ? Math.round((completedLessons.length / allLessonIds.length) * 100)
          : 0,
      progress,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la progression:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { lessonId } = body;

    if (!lessonId) {
      return NextResponse.json(
        { error: "Le champ lessonId est requis" },
        { status: 400 }
      );
    }

    const userId = session.user.id as string;

    // Find the lesson and its course with all lessons
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: {
                      select: { id: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Leçon non trouvée" },
        { status: 404 }
      );
    }

    // Upsert progress - mark lesson as completed
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Check if all lessons in the course are completed
    const course = lesson.module.course;
    const allLessonIds = course.modules.flatMap((module) =>
      module.lessons.map((l) => l.id)
    );

    const completedCount = await prisma.progress.count({
      where: {
        userId,
        lessonId: { in: allLessonIds },
        completed: true,
      },
    });

    let certificate = null;

    // Auto-generate certificate if all lessons are completed
    if (completedCount === allLessonIds.length && allLessonIds.length > 0) {
      const existingCertificate = await prisma.certificate.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
      });

      if (!existingCertificate) {
        const code = `CERT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

        certificate = await prisma.certificate.create({
          data: {
            userId,
            courseId: course.id,
            code,
          },
          include: {
            course: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
        });
      } else {
        certificate = existingCertificate;
      }
    }

    return NextResponse.json({
      progress,
      allCompleted: completedCount === allLessonIds.length,
      certificate,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la progression:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
