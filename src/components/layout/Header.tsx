"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import ClientOnly from "@/components/ClientOnly";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { state, toggleCart } = useCart();
  const { state: authState, logout } = useAuth();

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    {
      name: "Products",
      href: "/catalog",
      dropdownItems: [
        { name: "All Products", href: "/catalog" },
        { name: "Vitamins", href: "/catalog?category=vitamins" },
        { name: "Minerals", href: "/catalog?category=minerals" },
        { name: "Supplements", href: "/catalog?category=supplements" },
      ],
    },
    { name: "About us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20"
          : "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                {/* Logo Background with Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">M</span>
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="ml-4">
                <span className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                  MyHealthSync360
                </span>
                <div className="text-xs text-emerald-600 font-semibold tracking-wide">
                  Personalized Wellness
                </div>
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300 rounded-xl hover:bg-emerald-50 group"
                >
                  {item.name}
                  {item.dropdownItems && (
                    <ChevronDownIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdownItems && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-2">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors duration-200 font-medium"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Enhanced Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Shopping Cart Icon */}
            <div className="relative group">
              <button
                onClick={toggleCart}
                className="relative p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 group"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {/* Cart Badge */}
                {state.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                    {state.totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Login/Profile Button */}
            {authState.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-emerald-50 rounded-xl transition-all duration-300"
                >
                  <img
                    src={authState.user?.avatar}
                    alt={authState.user?.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <span className="text-gray-700 font-medium">
                    {authState.user?.name}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {authState.user?.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {authState.user?.email}
                      </p>
                      {authState.user?.subscription && (
                        <p className="text-xs text-emerald-600 font-medium mt-1">
                          {authState.user.subscription.plan} Plan
                        </p>
                      )}
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Order History
                    </Link>
                    <Link
                      href="/subscription"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Subscription
                    </Link>
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={async () => {
                          await logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 font-semibold px-6 py-2 rounded-xl"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/quiz">
                  <div className="group relative">
                    {/* Button Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                    <Button
                      size="sm"
                      className="relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
                    >
                      Quick Assessment
                      <span className="ml-2 group-hover:translate-x-0.5 transition-transform duration-300">
                        🚀
                      </span>
                    </Button>
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="lg:hidden">
            <ClientOnly fallback={<div className="w-12 h-12"></div>}>
              <button
                onClick={handleToggleMenu}
                className={`inline-flex items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
                  isMenuOpen
                    ? "text-emerald-600 bg-emerald-50 shadow-lg"
                    : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative w-6 h-6">
                  <Bars3Icon
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                      isMenuOpen
                        ? "opacity-0 rotate-45"
                        : "opacity-100 rotate-0"
                    }`}
                    aria-hidden="true"
                  />
                  <XMarkIcon
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                      isMenuOpen
                        ? "opacity-100 rotate-0"
                        : "opacity-0 -rotate-45"
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </button>
            </ClientOnly>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Navigation Menu */}
      <ClientOnly>
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md border-t border-white/20 shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navigation.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <Link
                    href={item.href}
                    className={`block px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl font-medium transition-all duration-300 transform ${
                      isMenuOpen ? "translate-x-0" : "translate-x-4"
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>

                  {/* Mobile Dropdown Items */}
                  {item.dropdownItems && (
                    <div className="ml-4 space-y-1">
                      {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className={`block px-4 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-all duration-300 transform ${
                            isMenuOpen ? "translate-x-0" : "translate-x-8"
                          }`}
                          style={{
                            transitionDelay: `${
                              index * 50 + dropdownIndex * 25
                            }ms`,
                          }}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile CTA Buttons */}
              <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200/50">
                {/* Mobile Cart Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      toggleCart();
                    }}
                    className={`relative p-3 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 rounded-xl transition-all duration-300 transform ${
                      isMenuOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                    style={{ transitionDelay: "250ms" }}
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {state.totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {state.totalItems}
                      </span>
                    )}
                  </button>
                </div>

                {/* Mobile Login/Profile */}
                {authState.isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <img
                        src={authState.user?.avatar}
                        alt={authState.user?.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {authState.user?.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {authState.user?.email}
                        </p>
                        {authState.user?.subscription && (
                          <p className="text-xs text-emerald-600 font-medium">
                            {authState.user.subscription.plan} Plan
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full text-xs bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 py-2 rounded-lg"
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full text-xs bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 py-2 rounded-lg"
                        >
                          Profile
                        </Button>
                      </Link>
                    </div>
                    <button
                      onClick={async () => {
                        await logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-sm text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-center bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 font-semibold py-3 rounded-xl transition-all duration-300 transform ${
                          isMenuOpen
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0"
                        }`}
                        style={{ transitionDelay: "300ms" }}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/quiz" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl shadow-lg transform transition-all duration-300 ${
                          isMenuOpen
                            ? "translate-y-0 opacity-100 scale-100"
                            : "translate-y-4 opacity-0 scale-95"
                        }`}
                        style={{ transitionDelay: "350ms" }}
                      >
                        Start Your Journey 🚀
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </header>
  );
};

export default Header;
