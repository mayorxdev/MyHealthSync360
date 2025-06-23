"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
// Import database functions
import { getUserOrders, getUserById } from "@/lib/database";
import {
  ChartBarIcon,
  ShoppingBagIcon,
  CalendarIcon,
  HeartIcon,
  BellIcon,
  HomeIcon,
  ChevronRightIcon,
  UserIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { state: authState } = useAuth();
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    activeSubscription: "Premium Plan",
    nextDelivery: "Dec 15, 2024",
    healthScore: 85,
    streakDays: 28,
    completedAssessments: 3,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data and orders
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Use authenticated user's ID
        if (!authState.user?.id) {
          console.log("No authenticated user found");
          setLoading(false);
          return;
        }

        // Double check that we have a valid user
        if (!authState.isLoggedIn) {
          console.log("User not logged in");
          setLoading(false);
          return;
        }

        const userId = authState.user.id;
        console.log("Fetching data for user:", userId);

        const [userOrders, userData] = await Promise.all([
          getUserOrders(userId),
          getUserById(userId),
        ]);

        // Update user stats with real data
        if (userData) {
          setUserStats((prev) => ({
            ...prev,
            totalOrders: userData.total_orders || 0,
            healthScore: userData.health_score || 85,
          }));
        }

        // Set recent orders (limit to 3 most recent)
        const recent = (userOrders || [])
          .sort(
            (a: any, b: any) =>
              new Date(b.order_date).getTime() -
              new Date(a.order_date).getTime()
          )
          .slice(0, 3)
          .map((order: any) => ({
            id: order.order_number,
            date: new Date(order.order_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            status:
              order.status === "delivered"
                ? "Delivered"
                : order.status === "shipped"
                ? "Shipped"
                : order.status === "processing"
                ? "Processing"
                : "Pending",
            total: `$${order.total_amount.toFixed(2)}`,
            items: order.order_items?.length || 0,
          }));

        setRecentOrders(recent);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Show user-friendly error message
        setRecentOrders([]);
        setUserStats((prev) => ({
          ...prev,
          totalOrders: 0,
          healthScore: 75, // Default value
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authState.user]);

  const upcomingDeliveries = [
    {
      id: "SUB-001",
      date: "Dec 15, 2024",
      products: ["Vitamin D3", "Omega-3", "Multivitamin"],
      status: "Preparing",
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-500 hover:text-emerald-600 transition-colors duration-200"
                  >
                    <HomeIcon className="h-5 w-5" />
                  </Link>
                </li>
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                <li>
                  <span className="text-emerald-600 font-medium">
                    Dashboard
                  </span>
                </li>
              </ol>
            </nav>

            {/* Navigation Menu */}
            <div className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex flex-wrap gap-4">
                  <Link href="/dashboard">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button
                      variant="outline"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Button>
                  </Link>
                  <Link href="/orders">
                    <Button
                      variant="outline"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <ShoppingBagIcon className="h-4 w-4 mr-2" />
                      Order History
                    </Button>
                  </Link>
                  <Link href="/subscription">
                    <Button
                      variant="outline"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Subscription
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600">
                Here&apos;s your personalized health dashboard
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Health Score
                    </p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {userStats.healthScore}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <HeartIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">+5 from last month</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Streak Days
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {userStats.streakDays}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Keep it up!</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Orders
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {userStats.totalOrders}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <ShoppingBagIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Since joining</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Assessments
                    </p>
                    <p className="text-3xl font-bold text-orange-600">
                      {userStats.completedAssessments}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <ChartBarIcon className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Completed</p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/quiz">
                      <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl">
                        New Assessment
                      </Button>
                    </Link>
                    <Link href="/catalog">
                      <Button
                        variant="outline"
                        className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 py-3 rounded-xl"
                      >
                        Browse Products
                      </Button>
                    </Link>
                    <Link href="/orders">
                      <Button
                        variant="outline"
                        className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl"
                      >
                        View Orders
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button
                        variant="outline"
                        className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Recent Orders
                    </h2>
                    <Link
                      href="/orders"
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <ShoppingBagIcon className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.id}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {order.total}
                          </p>
                          <p className="text-sm text-green-600">
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Subscription Status */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Subscription
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-medium text-emerald-600">
                        {userStats.activeSubscription}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Next Delivery</span>
                      <span className="font-medium text-gray-900">
                        {userStats.nextDelivery}
                      </span>
                    </div>
                    <Link href="/subscription">
                      <Button
                        variant="outline"
                        className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 mt-4"
                      >
                        Manage Subscription
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Upcoming Deliveries */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Upcoming Deliveries
                  </h2>
                  <div className="space-y-3">
                    {upcomingDeliveries.map((delivery) => (
                      <div
                        key={delivery.id}
                        className="p-4 bg-emerald-50 rounded-xl border border-emerald-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-emerald-700">
                            {delivery.date}
                          </span>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                            {delivery.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {delivery.products.map((product, index) => (
                            <p key={index} className="text-sm text-gray-600">
                              • {product}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Health Tips */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                  <h2 className="text-xl font-semibold mb-4">
                    Today&apos;s Health Tip
                  </h2>
                  <p className="text-emerald-100 mb-4">
                    Stay hydrated! Aim for 8 glasses of water daily to support
                    your supplement absorption and overall health.
                  </p>
                  <div className="flex items-center text-emerald-200 text-sm">
                    <BellIcon className="h-4 w-4 mr-2" />
                    Reminder set for 2 PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;
