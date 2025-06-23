"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders, getAllProducts } from "@/lib/database";
import { Product } from "@/data/products";
import {
  ShoppingBagIcon,
  EyeIcon,
  ArrowPathIcon,
  StarIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  HomeIcon,
  ChevronRightIcon,
  ChartBarIcon,
  UserIcon,
  CreditCardIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Orders = () => {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const { state: authState } = useAuth();
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
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
        console.log("Fetching orders for user:", userId);

        const [userOrders, products] = await Promise.all([
          getUserOrders(userId),
          getAllProducts(),
        ]);

        setOrders(userOrders || []);
        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        showAlertMessage("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authState.user]);

  const getProductByName = (name: string): Product | null => {
    return (
      allProducts.find(
        (product) =>
          product.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(product.name.toLowerCase())
      ) || null
    );
  };

  const getProductDataForOrderItem = (itemName: string) => {
    const product = getProductByName(itemName);
    if (product) {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        benefits: product.benefits,
        inStock: product.inStock,
      };
    }

    return {
      id: Math.floor(Math.random() * 1000),
      name: itemName,
      price: 29.99,
      image: "/product1.png",
      benefits: ["Health Support"],
      inStock: true,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="h-5 w-5" />;
      case "shipped":
        return <TruckIcon className="h-5 w-5" />;
      case "processing":
        return <ClockIcon className="h-5 w-5" />;
      default:
        return <ShoppingBagIcon className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewDetails = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowOrderDetailsModal(true);
    }
  };

  const handleReorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.items.forEach((item: any) => {
        const cartItem = getProductDataForOrderItem(item.name);
        for (let i = 0; i < item.quantity; i++) {
          addItem(cartItem);
        }
      });

      showAlertMessage(
        `Added ${order.items.length} items to cart! Redirecting to checkout...`
      );

      openCart();
      setTimeout(() => {
        router.push("/checkout");
      }, 1500);
    }
  };

  const handleLeaveReview = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setReviewRating(5);
      setReviewText("");
      setShowReviewModal(true);
    }
  };

  const handleSubmitReview = () => {
    if (selectedOrder && reviewText.trim()) {
      showAlertMessage(
        `Review submitted for order ${selectedOrder.id}! Thank you for your feedback.`
      );
      setShowReviewModal(false);
      setReviewText("");
    }
  };

  const handleTrackPackage = (trackingNumber: string) => {
    const order = orders.find((o) => o.trackingNumber === trackingNumber);
    if (order) {
      setSelectedOrder(order);
      setShowTrackingModal(true);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </Layout>
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
                    Order History
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
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
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

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order History
              </h1>
              <p className="text-gray-600">
                Track your orders and view your purchase history
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Orders
                    </p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {orders.length}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <ShoppingBagIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Delivered
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {
                        orders.filter((order) => order.status === "delivered")
                          .length
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      In Transit
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {
                        orders.filter((order) => order.status === "shipped")
                          .length
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <TruckIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Spent
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      $
                      {orders
                        .reduce((sum, order) => sum + order.total, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <StarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Orders
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Order #{order.id}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Placed on {formatDate(order.date)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {order.items.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="text-gray-900 font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4 text-sm text-gray-600">
                      <p>
                        <strong>Tracking Number:</strong> {order.trackingNumber}
                      </p>
                      {order.deliveredDate && (
                        <p>
                          <strong>Delivered:</strong>{" "}
                          {formatDate(order.deliveredDate)}
                        </p>
                      )}
                      {order.estimatedDelivery && (
                        <p>
                          <strong>Estimated Delivery:</strong>{" "}
                          {formatDate(order.estimatedDelivery)}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                        onClick={() => handleViewDetails(order.id)}
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View Details</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                        onClick={() => handleReorder(order.id)}
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                        <span>Reorder</span>
                      </Button>

                      {order.status === "delivered" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                          onClick={() => handleLeaveReview(order.id)}
                        >
                          <StarIcon className="h-4 w-4" />
                          <span>Leave Review</span>
                        </Button>
                      )}

                      {order.status === "shipped" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() =>
                            handleTrackPackage(order.trackingNumber)
                          }
                        >
                          <TruckIcon className="h-4 w-4" />
                          <span>Track Package</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {orders.length === 0 && (
                <div className="p-12 text-center">
                  <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No orders yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start your health journey by placing your first order!
                  </p>
                  <Link href="/catalog">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {showTrackingModal && selectedOrder && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-white/20">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Track Package - {selectedOrder.trackingNumber}
                    </h3>
                    <button
                      onClick={() => setShowTrackingModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-blue-900">
                          Order #{selectedOrder.id}
                        </h4>
                        <span className="text-sm text-blue-600">
                          {selectedOrder.status === "shipped"
                            ? "In Transit"
                            : "Delivered"}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Expected delivery:{" "}
                        {selectedOrder.estimatedDelivery
                          ? formatDate(selectedOrder.estimatedDelivery)
                          : "TBD"}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Tracking History
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">
                                  Package in transit
                                </p>
                                <p className="text-sm text-gray-600">
                                  Your package is on its way to the destination
                                </p>
                              </div>
                              <span className="text-xs text-gray-500">
                                2 hours ago
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">
                                  Package departed facility
                                </p>
                                <p className="text-sm text-gray-600">
                                  Los Angeles, CA
                                </p>
                              </div>
                              <span className="text-xs text-gray-500">
                                8 hours ago
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">
                                  Package processed
                                </p>
                                <p className="text-sm text-gray-600">
                                  Sorting facility - Los Angeles, CA
                                </p>
                              </div>
                              <span className="text-xs text-gray-500">
                                1 day ago
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">
                                  Package shipped
                                </p>
                                <p className="text-sm text-gray-600">
                                  MyHealthSync360 Fulfillment Center
                                </p>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDate(selectedOrder.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Need help?
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        If you have questions about your shipment, our support
                        team is here to help.
                      </p>
                      <Link href="/contact">
                        <Button variant="outline" className="text-sm">
                          Contact Support
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showOrderDetailsModal && selectedOrder && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Order Details - {selectedOrder.id}
                    </h3>
                    <button
                      onClick={() => setShowOrderDetailsModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          Order Date
                        </p>
                        <p className="font-medium text-gray-700">
                          {formatDate(selectedOrder.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          Status
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            selectedOrder.status
                          )}`}
                        >
                          {selectedOrder.status.charAt(0).toUpperCase() +
                            selectedOrder.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          Tracking Number
                        </p>
                        <p className="font-medium text-gray-700">
                          {selectedOrder.trackingNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          Total
                        </p>
                        <p className="font-semibold text-lg text-emerald-600">
                          ${selectedOrder.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Items Ordered
                      </h4>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showReviewModal && selectedOrder && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20">
                  <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                      <StarIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Leave a Review
                    </h3>
                    <p className="text-sm text-gray-600">
                      How was your experience with order {selectedOrder.id}?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`p-1 ${
                              star <= reviewRating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            <StarIcon className="h-6 w-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience with this order..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowReviewModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                        onClick={handleSubmitReview}
                        disabled={!reviewText.trim()}
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showAlert && (
              <div className="fixed top-4 right-4 z-50">
                <div className="p-4 rounded-lg shadow-lg bg-green-100 border border-green-200">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-800">{alertMessage}</p>
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

export default Orders;
