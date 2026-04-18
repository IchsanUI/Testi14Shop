"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type NavbarClientProps = {
  session: SessionUser | null;
};

export default function NavbarClient({ session }: NavbarClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const linkClass = `text-sm font-medium transition-colors ${
    scrolled
      ? "text-white hover:text-yellow-400"
      : "text-white/80 hover:text-white"
  }`;

  const mobileLinkClass = `block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors font-medium`;

  const loginBtnClass = `px-4 py-2.5 text-sm font-bold rounded-lg transition-colors ${
    scrolled
      ? "bg-white text-black hover:bg-gray-200"
      : "bg-black text-white hover:bg-gray-800"
  }`;

  const mobileLoginBtnClass = `block text-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors bg-black text-white hover:bg-gray-800 mt-2`;

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-14group-putih.png"
                alt="14Group"
                width={100}
                height={36}
                className="h-9 w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/customer" className={linkClass}>
                Form Testimoni
              </Link>
              <Link href="/redeem" className={linkClass}>
                Redeem Kode
              </Link>

              {session ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfile((v) => !v)}
                    className="h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm hover:bg-yellow-300 transition-colors"
                  >
                    {session.name?.charAt(0).toUpperCase()}
                  </button>
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border py-1 z-50">
                      <Link
                        href="/admin"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors w-full text-left disabled:opacity-50"
                      >
                        {logoutLoading ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/admin" className={loginBtnClass}>
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden bg-black/95 backdrop-blur-sm border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 pb-4 space-y-1">
              <Link
                href="/customer"
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass}
              >
                Form Testimoni
              </Link>
              <Link
                href="/redeem"
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass}
              >
                Redeem Kode
              </Link>
              {session ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className={mobileLinkClass}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className={`${mobileLinkClass} text-red-400`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={mobileLoginBtnClass}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Spacer — background matches the hero so transparent navbar blends in */}
      <div className="h-16 bg-black" />
    </>
  );
}
