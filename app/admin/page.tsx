"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TestimonialManagement from "@/components/admin/TestimonialManagement";
import VoucherManagement from "@/components/admin/VoucherManagement";
import VoucherVerification from "@/components/admin/VoucherVerification";
import ActivityLogs from "@/components/admin/ActivityLogs";
import UserManagement from "@/components/admin/UserManagement";
import MediaManagement from "@/components/admin/MediaManagement";

import BannerManagement from "@/components/admin/BannerManagement";

type TabType =
  | "testimonials"
  | "vouchers"
  | "verify"
  | "logs"
  | "users"
  | "media"
  | "banners";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("testimonials");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/admin/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Not authenticated, redirect to login
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* <Image src="/logo-saja.png" alt="14Group" width={100} height={36} className="h-9 w-auto" /> */}
              <div>
                <h1 className="text-2xl font-bold text-black">Admin</h1>
                <p className="text-gray-500 text-xs">
                  Kelola testimoni dan voucher
                </p>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-black">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </p>
              </div>

              <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("testimonials")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === "testimonials"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-black hover:border-gray-300"
                }`}
              >
                Testimoni
              </button>
              <button
                onClick={() => setActiveTab("vouchers")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === "vouchers"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-black hover:border-gray-300"
                }`}
              >
                Kelola Voucher
              </button>
              <button
                onClick={() => setActiveTab("verify")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === "verify"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-black hover:border-gray-300"
                }`}
              >
                Verifikasi Voucher
              </button>
              <button
                onClick={() => setActiveTab("banners")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === "banners"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-black hover:border-gray-300"
                }`}
              >
                Banner
              </button>
              {isSuperAdmin && (
                <>
                  <button
                    onClick={() => setActiveTab("media")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === "media"
                        ? "border-black text-black"
                        : "border-transparent text-gray-400 hover:text-black hover:border-gray-300"
                    }`}
                  >
                    Media
                  </button>
                  <button
                    onClick={() => setActiveTab("logs")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === "logs"
                        ? "border-black text-black"
                        : "border-transparent text-gray-400 hover:text-black hover:border-gray-300"
                    }`}
                  >
                    Activity Logs
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === "users"
                        ? "border-black text-black"
                        : "border-transparent text-gray-400 hover:text-black hover:border-gray-300"
                    }`}
                  >
                    Kelola User
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "testimonials" && <TestimonialManagement />}
        {activeTab === "vouchers" && <VoucherManagement />}
        {activeTab === "verify" && (
          <div className="max-w-2xl mx-auto">
            <VoucherVerification />
          </div>
        )}
        {activeTab === "banners" && <BannerManagement />}
        {activeTab === "media" && isSuperAdmin && <MediaManagement />}
        {activeTab === "logs" && isSuperAdmin && <ActivityLogs />}
        {activeTab === "users" && isSuperAdmin && <UserManagement />}
      </main>
    </div>
  );
}
