"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSubscription, getAllProducts } from "@/lib/database";
import { Product } from "@/data/products";
import {
  CalendarIcon,
  CreditCardIcon,
  ClockIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  ChevronRightIcon,
  ChartBarIcon,
  UserIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

const Subscription = () => {
  const router = useRouter();
  const { state: authState } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "warning" | "info">(
    "info"
  );

  const showAlertMessage = (
    message: string,
    type: "success" | "warning" | "info" = "info"
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  useEffect(() => {
    const fetchSubscriptionData = async () => {
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
        console.log("Fetching subscription data for user:", userId);

        const [userSubscription, products] = await Promise.all([
          getUserSubscription(userId),
          getAllProducts(),
        ]);

        setAllProducts(products);

        if (userSubscription) {
          const transformedSubscription = {
            id: userSubscription.id,
            status: userSubscription.status,
            plan: userSubscription.plan_name,
            nextDelivery: userSubscription.next_billing_date,
            billingCycle: userSubscription.billing_cycle,
            monthlyTotal: userSubscription.monthly_total,
            products:
              userSubscription.subscription_products?.map((sp: any) => {
                const product = products.find((p) => p.id === sp.product_id);
                return {
                  id: sp.product_id.toString(),
                  name: product?.name || "Unknown Product",
                  image: product?.image || "/product1.png",
                  price: sp.price,
                  quantity: sp.quantity,
                };
              }) || [],
          };
          setSubscription(transformedSubscription);
        } else {
          console.log("No subscription found for user");
          setSubscription(null);
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        setSubscription(null);
        // Show user-friendly error message
        showAlertMessage(
          "Failed to load subscription data. Please try again.",
          "warning"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [authState.user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "paused":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your subscription...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-8 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    Subscription
                  </span>
                </li>
              </ol>
            </nav>

            <div className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex flex-wrap gap-4">
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
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
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Subscription
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Subscription Management
              </h1>
              <p className="text-gray-600">
                Manage your subscription plan and delivery preferences
              </p>
            </div>

            {!subscription && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                    <CreditCardIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Active Subscription
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You don't have an active subscription yet. Start your health
                    journey today!
                  </p>
                  <Link href="/catalog">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {subscription && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Current Plan
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      subscription.status
                    )}`}
                  >
                    {subscription.status.charAt(0).toUpperCase() +
                      subscription.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium text-gray-900">
                        {subscription.plan}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Delivery:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(subscription.nextDelivery)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing Cycle:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {subscription.billingCycle}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Total:</span>
                      <span className="font-semibold text-emerald-600 text-lg">
                        ${subscription.monthlyTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Products
                  </h3>
                  {subscription.products.map((product: any) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            ${product.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">
                          Qty: {product.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showAlert && (
              <div className="fixed top-4 right-4 z-50">
                <div
                  className={`p-4 rounded-lg shadow-lg ${
                    alertType === "success"
                      ? "bg-green-100 border border-green-200"
                      : alertType === "warning"
                      ? "bg-yellow-100 border border-yellow-200"
                      : "bg-blue-100 border border-blue-200"
                  }`}
                >
                  <div className="flex items-center">
                    <CheckCircleIcon
                      className={`h-5 w-5 mr-2 ${
                        alertType === "success"
                          ? "text-green-600"
                          : alertType === "warning"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    />
                    <p
                      className={`${
                        alertType === "success"
                          ? "text-green-800"
                          : alertType === "warning"
                          ? "text-yellow-800"
                          : "text-blue-800"
                      }`}
                    >
                      {alertMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Subscription;
