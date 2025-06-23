"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  CheckCircleIcon,
  TruckIcon,
  CalendarIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
// Import database functions
import { getOrderByNumber } from "@/lib/database";

interface OrderData {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  order_date: string;
  estimated_delivery: string;
  tracking_number: string;
  billing_cycle: string;
  order_items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

const SuccessPage = () => {
  const [countdown, setCountdown] = useState(10);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Get order number from session storage
        const orderNumber = sessionStorage.getItem("lastOrderNumber");

        if (orderNumber) {
          const order = await getOrderByNumber(orderNumber);
          if (order) {
            setOrderData(order);
          }
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/dashboard";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getBillingCycleText = (cycle: string) => {
    switch (cycle) {
      case "quarterly":
        return "every 3 months";
      case "yearly":
        return "annually";
      default:
        return "monthly";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for choosing MyHealthSync360. Your personalized supplement
            plan is on its way!
          </p>

          {/* Order Details */}
          {orderData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-left">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Order Information
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Order #:</strong> {orderData.order_number}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(orderData.order_date)}
                    </p>
                    <p>
                      <strong>Total:</strong> $
                      {orderData.total_amount.toFixed(2)}
                    </p>
                    <p>
                      <strong>Billing:</strong>{" "}
                      {getBillingCycleText(orderData.billing_cycle)}
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Delivery Information
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Tracking #:</strong> {orderData.tracking_number}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="capitalize">{orderData.status}</span>
                    </p>
                    <p>
                      <strong>Est. Delivery:</strong>{" "}
                      {formatDate(orderData.estimated_delivery)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="text-left">
                <h3 className="font-medium text-gray-900 mb-3">
                  Items Ordered
                </h3>
                <div className="space-y-2">
                  {orderData.order_items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-900">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* What happens next */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              What happens next?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Account Created
                </h3>
                <p className="text-sm text-gray-600">
                  Your account has been set up and you can now track your orders
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
                  <TruckIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Order Processing
                </h3>
                <p className="text-sm text-gray-600">
                  We&apos;re preparing your supplements for shipping
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
                  <CalendarIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  {orderData?.billing_cycle === "monthly"
                    ? "Monthly Delivery"
                    : "Scheduled Delivery"}
                </h3>
                <p className="text-sm text-gray-600">
                  {orderData?.billing_cycle === "monthly"
                    ? "Automatic deliveries every month to keep you healthy"
                    : `Automatic deliveries ${getBillingCycleText(
                        orderData?.billing_cycle || "monthly"
                      )} to keep you healthy`}
                </p>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <HeartIcon className="w-6 h-6 text-emerald-600 mt-1" />
              <div className="text-left">
                <h3 className="font-medium text-emerald-900 mb-2">
                  Important Information
                </h3>
                <ul className="text-sm text-emerald-800 space-y-1">
                  <li>
                    • You&apos;ll receive an email confirmation with tracking
                    details
                  </li>
                  <li>
                    • Your first delivery will arrive in 3-5 business days
                  </li>
                  <li>
                    • Future deliveries are scheduled{" "}
                    {orderData
                      ? getBillingCycleText(orderData.billing_cycle)
                      : "monthly"}
                  </li>
                  <li>
                    • You can modify or pause your subscription anytime in your
                    dashboard
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 px-8"
                >
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="outline" size="lg" className="px-8">
                  View Order Details
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-600">
              Redirecting to your dashboard in{" "}
              <span className="font-semibold text-emerald-600">
                {countdown}
              </span>{" "}
              seconds...
            </p>
          </div>

          {/* Contact Support */}
          <div className="mt-12 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Questions about your order?{" "}
              <a
                href="mailto:support@myhealthsync360.com"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessPage;
