interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

interface BadgeDisplayProps {
  badges: Badge[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.896m5.25-6.388V2.721C16.545 2.41 14.29 2.25 12 2.25c-2.291 0-4.545.16-6.75.47"
            />
          </svg>
        </div>
        <h3 className="text-gray-500 font-medium mb-1">Aucun badge obtenu</h3>
        <p className="text-gray-400 text-sm">
          Completez des parcours et des quiz pour gagner des badges !
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col items-center text-center group"
        >
          {/* Badge icon */}
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <span className="text-3xl" role="img" aria-label={badge.name}>
                {badge.icon}
              </span>
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-amber-300 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
          </div>

          {/* Badge name */}
          <h3 className="text-gray-900 font-bold text-sm mb-1">
            {badge.name}
          </h3>

          {/* Badge description */}
          <p className="text-gray-500 text-xs leading-relaxed mb-3">
            {badge.description}
          </p>

          {/* Earned date */}
          <div className="mt-auto flex items-center gap-1.5 text-xs text-gray-400">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <span>Obtenu le {formatDate(badge.earnedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
