"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-gray-950 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-white text-xl font-bold tracking-tight hover:text-orange-400 transition-colors"
            >
              <span className="text-orange-500">Pulsa</span> E-Learning
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="/parcours"
              className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Parcours
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-700">
              {status === "loading" ? (
                <div className="w-20 h-8 bg-gray-800 rounded animate-pulse" />
              ) : session?.user ? (
                <>
                  <span className="text-gray-300 text-sm font-medium">
                    {session.user.name || session.user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-950 p-2 rounded-md cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/parcours"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Parcours
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Dashboard
            </Link>

            <div className="pt-3 mt-3 border-t border-gray-800">
              {status === "loading" ? (
                <div className="w-full h-10 bg-gray-800 rounded animate-pulse" />
              ) : session?.user ? (
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm font-medium px-3">
                    {session.user.name || session.user.email}
                  </p>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full text-left bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/connexion"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-orange-500 text-white hover:bg-orange-600 px-3 py-2 rounded-md text-base font-semibold text-center transition-colors"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
