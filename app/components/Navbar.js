"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

// Heroicons (outline)
function DashboardIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V6.75A2.25 2.25 0 0 1 5.25 4.5h3A2.25 2.25 0 0 1 10.5 6.75v6.75m0 0V17.25A2.25 2.25 0 0 1 8.25 19.5h-3A2.25 2.25 0 0 1 3 17.25V13.5zm7.5 0V6.75A2.25 2.25 0 0 1 12.75 4.5h3A2.25 2.25 0 0 1 18 6.75v6.75m0 0V17.25A2.25 2.25 0 0 1 15.75 19.5h-3A2.25 2.25 0 0 1 10.5 17.25V13.5z" />
    </svg>
  );
}
function CubeIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4a2 2 0 001-1.73z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05" />
    </svg>
  );
}
function ReportIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-6 0h6m-6 0a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-6 0V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10" />
    </svg>
  );
}
function SettingIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.01c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.01 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.01 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.01c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.01c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.01-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.01-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.246.07 2.573-1.01z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
  );
}
function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
    </svg>
  );
}
function XIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function ShopIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderAdminLinks = () => (
    <>
      <NavLink href="/admin" icon={<DashboardIcon className="w-5 h-5" />} text="Dashboard" />
      <NavLink href="/admin/products" icon={<CubeIcon className="w-5 h-5" />} text="Kelola Produk" />
      <NavLink href="/admin/orders" icon={<ReportIcon className="w-5 h-5" />} text="Kelola Pesanan" />
      <NavLink href="/admin/settings" icon={<SettingIcon className="w-5 h-5" />} text="Pengaturan" />
    </>
  );

  const renderUserLinks = () => (
    <>
      <NavLink href="/products" icon={<CubeIcon className="w-5 h-5" />} text="Belanja" />
      <NavLink href="/orders" icon={<ReportIcon className="w-5 h-5" />} text="Pesanan Saya" />
    </>
  );

  if (loading) {
    return (
      <nav className="glass-navbar border-b-2 border-gradient sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="glass-navbar border-b-2 border-gradient sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isLoggedIn ? (user?.role === 'admin' ? '/admin' : '/products') : '/'} 
                className="flex-shrink-0 group">
            <span className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-fuchsia-500 rounded-xl shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {/* Bisa diganti dengan logo racare.glow jika ada */}
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" /></svg>
              </div>
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 tracking-tight group-hover:text-pink-600 transition-colors duration-300">
                racare.glow
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {isLoggedIn ? (
              <>
                {user?.role === 'admin' ? renderAdminLinks() : renderUserLinks()}
                {/* User Menu */}
                <div className="flex items-center space-x-4 ml-6">
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 shadow-inner animate-fade-in-up">
                    <span className="text-sm font-semibold text-pink-700">
                      {user?.role === 'admin' ? '👑 Admin: ' : ''}
                      {user?.fullName || user?.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 shadow-lg hover:from-pink-500 hover:to-rose-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 shadow-lg hover:from-pink-500 hover:to-rose-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {isLoggedIn ? (
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg hover:bg-pink-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <span className={open ? "animate-fade-in-up" : "animate-fade-in-up delay-100"}>
                  {open ? <XIcon className="w-7 h-7 text-pink-700" /> : <MenuIcon className="w-7 h-7 text-pink-700" />}
                </span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 shadow-lg"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isLoggedIn && (
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${open ? "block animate-fade-in-up" : "hidden"}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/80 border-t border-gray-200 rounded-b-2xl shadow-xl">
            {user?.role === 'admin' ? (
              <>
                <MobileNavLink
                  href="/admin"
                  icon={<DashboardIcon className="w-5 h-5" />}
                  text="Dashboard"
                  onClick={() => setOpen(false)}
                />
                <MobileNavLink
                  href="/admin/products"
                  icon={<CubeIcon className="w-5 h-5" />}
                  text="Kelola Produk"
                  onClick={() => setOpen(false)}
                />
                <MobileNavLink
                  href="/admin/orders"
                  icon={<ReportIcon className="w-5 h-5" />}
                  text="Kelola Pesanan"
                  onClick={() => setOpen(false)}
                />
                <MobileNavLink
                  href="/admin/settings"
                  icon={<SettingIcon className="w-5 h-5" />}
                  text="Pengaturan"
                  onClick={() => setOpen(false)}
                />
              </>
            ) : (
              <>
                <MobileNavLink
                  href="/products"
                  icon={<CubeIcon className="w-5 h-5" />}
                  text="Belanja"
                  onClick={() => setOpen(false)}
                />
                <MobileNavLink
                  href="/orders"
                  icon={<ReportIcon className="w-5 h-5" />}
                  text="Pesanan Saya"
                  onClick={() => setOpen(false)}
                />
              </>
            )}
            {/* Mobile User Menu */}
            <div className="pt-4 mt-2 border-t border-gray-200">
              <div className="px-4 py-2 flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full shadow-inner">
                <span className="text-sm font-semibold text-pink-700">
                  {user?.role === 'admin' ? '👑 Admin: ' : ''}
                  {user?.fullName || user?.username}
                </span>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2 mt-2 text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-700 rounded-full shadow-lg transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Animations & Glassmorphism */}
      <style jsx global>{`
        .glass-navbar {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(16px) saturate(180%);
          box-shadow: 0 4px 32px 0 rgba(80, 112, 255, 0.08);
        }
        .border-gradient {
          border-image: linear-gradient(to right, #6366f1, #a5b4fc, #f472b6) 1;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
      `}</style>
    </nav>
  );
}

// Helper Components
function NavLink({ href, icon, text }) {
  return (
    <a
      href={href}
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200"
    >
      {icon}
      <span className="ml-2">{text}</span>
    </a>
  );
}

function MobileNavLink({ href, icon, text, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
    >
      {icon}
      <span className="ml-2">{text}</span>
    </a>
  );
}