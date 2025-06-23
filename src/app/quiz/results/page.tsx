"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import {
  XMarkIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import { useCart } from "@/contexts/CartContext";

interface RecommendedSupplement {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  dosage: string;
  price: number;
  image: string;
  priority: "high" | "medium" | "low";
  rating: number;
  reviewCount: number;
}

const QuizResults = () => {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<
    RecommendedSupplement[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [productsAddedToCart, setProductsAddedToCart] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const { addItem, openCart, state: cartState } = useCart();

  useEffect(() => {
    // Simulate progressive loading with steps
    const loadingSteps = [
      { progress: 20, message: "Analyzing your health profile..." },
      { progress: 40, message: "Matching supplements to your goals..." },
      { progress: 60, message: "Calculating optimal dosages..." },
      { progress: 80, message: "Personalizing your recommendations..." },
      { progress: 100, message: "Finalizing your perfect plan..." },
    ];

    let currentStep = 0;

    const progressInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        currentStep++;
      } else {
        clearInterval(progressInterval);
        setTimeout(() => {
          setRecommendations(mockRecommendations);
          setLoading(false);
        }, 500);
      }
    }, 600);

    return () => clearInterval(progressInterval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-add products to cart when recommendations are loaded
  useEffect(() => {
    if (recommendations.length > 0 && !productsAddedToCart) {
      // Add each recommended product to cart
      recommendations.forEach((supplement) => {
        const cartItem = {
          id: parseInt(supplement.id),
          name: supplement.name,
          price: supplement.price,
          image: supplement.image,
          benefits: supplement.benefits,
          inStock: true,
        };
        addItem(cartItem);
      });

      setProductsAddedToCart(true);
      setShowCartNotification(true);

      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowCartNotification(false);
      }, 5000);
    }
  }, [recommendations, productsAddedToCart, addItem]);

  const mockRecommendations: RecommendedSupplement[] = [
    {
      id: "1",
      name: "Daily Multivitamin Plus",
      description:
        "Comprehensive daily nutrition with 25+ essential vitamins and minerals",
      benefits: [
        "Fills nutritional gaps",
        "Supports energy levels",
        "Boosts immune system",
      ],
      dosage: "2 capsules daily with breakfast",
      price: 29.99,
      image: "/product1.png",
      priority: "high",
      rating: 4.8,
      reviewCount: 2847,
    },
    {
      id: "2",
      name: "Omega-3 Supreme",
      description: "High-potency fish oil for heart and brain health",
      benefits: [
        "Supports heart health",
        "Enhances brain function",
        "Reduces inflammation",
      ],
      dosage: "1 softgel daily with meals",
      price: 34.99,
      image: "/product2.png",
      priority: "high",
      rating: 4.9,
      reviewCount: 1923,
    },
    {
      id: "3",
      name: "Vitamin D3 + K2",
      description: "Optimal bone health and immune support combination",
      benefits: [
        "Strengthens bones",
        "Supports immune function",
        "Improves mood",
      ],
      dosage: "1 capsule daily",
      price: 24.99,
      image: "/product3.png",
      priority: "medium",
      rating: 4.7,
      reviewCount: 1456,
    },
    {
      id: "4",
      name: "Magnesium Glycinate",
      description: "Highly absorbable magnesium for sleep and muscle support",
      benefits: [
        "Improves sleep quality",
        "Reduces muscle tension",
        "Supports nerve function",
      ],
      dosage: "2 capsules 30 minutes before bed",
      price: 22.99,
      image: "/product4.png",
      priority: "medium",
      rating: 4.6,
      reviewCount: 987,
    },
    {
      id: "5",
      name: "Probiotic Complex",
      description: "50 billion CFU multi-strain probiotic for digestive health",
      benefits: [
        "Supports digestive health",
        "Boosts immune system",
        "Improves gut flora",
      ],
      dosage: "1 capsule daily on empty stomach",
      price: 39.99,
      image: "/product5.png",
      priority: "low",
      rating: 4.5,
      reviewCount: 756,
    },
  ];

  const removeProduct = (productId: string) => {
    setRecommendations(recommendations.filter((item) => item.id !== productId));
  };

  const getTotalPrice = () => {
    return recommendations.reduce(
      (total, item) => total + (item.price || 0),
      0
    );
  };

  const getDiscountedPrice = () => {
    const totalPrice = getTotalPrice();
    return totalPrice * 0.8; // 20% discount for bundle
  };

  const handleViewCart = () => {
    openCart();
  };

  const handleProceedToCheckout = () => {
    if (cartState.totalItems === 0) {
      alert("Cart is empty. Please try again.");
      return;
    }

    // Navigate to checkout page using Next.js router
    router.push("/checkout");
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Analyzing Your Health Profile
            </h2>
            <p className="text-gray-600">
              Our nutritionists are creating your personalized supplement
              plan...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white p-4 rounded-lg shadow-lg max-w-sm animate-in slide-in-from-right duration-300">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-6 h-6 text-emerald-200" />
            <div>
              <h4 className="font-semibold">Products Added to Cart!</h4>
              <p className="text-sm text-emerald-100">
                {recommendations.length} recommended supplements have been added
                to your cart.
              </p>
            </div>
          </div>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleViewCart}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              View Cart
            </button>
            <button
              onClick={handleProceedToCheckout}
              className="bg-white text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Personalized Supplement Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Based on your health quiz responses, our nutritionists have
              created a customized supplement plan designed specifically for
              your unique health goals and lifestyle.
            </p>
            {productsAddedToCart && (
              <div className="mt-6 space-y-2">
                <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg">
                  <div className="relative">
                    <ShoppingCartIcon className="w-5 h-5" />
                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {recommendations.length}
                    </span>
                  </div>
                  <span className="font-medium">
                    All {recommendations.length} products automatically added to
                    your cart!
                  </span>
                </div>
                <div className="text-sm text-gray-600 text-center">
                  Cart has {cartState.totalItems} items ($
                  {cartState.totalPrice.toFixed(2)})
                </div>
              </div>
            )}
          </div>

          {/* Health Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Health Profile Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600 mb-1">
                  {recommendations.length}
                </div>
                <div className="text-sm text-gray-600">
                  {recommendations.length === 1
                    ? "Recommended Supplement"
                    : "Recommended Supplements"}
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  Primary
                </div>
                <div className="text-sm text-gray-600">
                  Focus: Energy & Immunity
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  92%
                </div>
                <div className="text-sm text-gray-600">Health Goal Match</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Your Recommended Supplements
              </h2>
              {recommendations.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-.01.01M11 21l-.01.01"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No supplements in your plan
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You&apos;ve removed all recommended supplements. Consider
                    retaking the quiz to get new recommendations.
                  </p>
                  <Link href="/quiz">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Retake Health Quiz
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {recommendations.map((supplement) => (
                    <div
                      key={supplement.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative"
                    >
                      {/* Delete Button */}
                      <button
                        onClick={() => removeProduct(supplement.id)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 group"
                        title="Remove from plan"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>

                      <div className="flex items-start space-x-4 pr-10">
                        <div className="flex-shrink-0">
                          <Image
                            src={supplement.image}
                            alt={supplement.name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                            style={{ width: "auto", height: "auto" }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {supplement.name}
                                </h3>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    supplement.priority === "high"
                                      ? "bg-red-100 text-red-800"
                                      : supplement.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {supplement.priority.toUpperCase()} PRIORITY
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3">
                                {supplement.description}
                              </p>
                              <div className="mb-3">
                                <h4 className="text-sm font-medium text-gray-900 mb-1">
                                  Key Benefits:
                                </h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {supplement.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-center">
                                      <svg
                                        className="w-4 h-4 text-emerald-500 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Recommended Dosage:</strong>{" "}
                                {supplement.dosage}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${supplement.price}
                              </div>
                              <div className="text-sm text-gray-500">
                                per month
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Monthly Plan
                </h3>

                {recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-3">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 8H6L5 9z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Your plan is empty
                    </p>
                    <Link href="/quiz">
                      <Button variant="outline" size="sm">
                        Retake Quiz
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {recommendations.map((supplement) => (
                        <div
                          key={supplement.id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {supplement.name}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${supplement.price}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">
                          ${getTotalPrice().toFixed(2)}
                        </span>
                      </div>
                      {recommendations.length > 1 && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-emerald-600">
                            Bundle Discount (20%)
                          </span>
                          <span className="text-emerald-600">
                            -$
                            {(getTotalPrice() - getDiscountedPrice()).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">
                          $
                          {(recommendations.length > 1
                            ? getDiscountedPrice()
                            : getTotalPrice()
                          ).toFixed(2)}
                          /month
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleProceedToCheckout}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-3"
                      >
                        {productsAddedToCart ? "Checkout" : "Start Plan"} - $
                        {(recommendations.length > 1
                          ? getDiscountedPrice()
                          : getTotalPrice()
                        ).toFixed(2)}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleViewCart}
                      >
                        {productsAddedToCart
                          ? "View Cart"
                          : "Customize Your Plan"}
                      </Button>
                    </div>
                  </>
                )}

                <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-emerald-800">
                      30-Day Money Back Guarantee
                    </span>
                  </div>
                  <ul className="text-xs text-emerald-700 space-y-1">
                    <li>• Free shipping on all orders</li>
                    <li>• Cancel or modify anytime</li>
                    <li>• Nutritionist support included</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Why These Supplements?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Based on Your Health Goals
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-emerald-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Boost immune system support
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-emerald-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Increase daily energy levels
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-emerald-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Support overall wellness
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Personalized for You
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-emerald-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Matched to your activity level
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-emerald-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Compatible with your diet
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-emerald-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Accounts for current supplements
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Start Your Health Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands who have already transformed their wellness with
              personalized nutrition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 px-8"
                onClick={handleProceedToCheckout}
              >
                {productsAddedToCart ? "Checkout Now" : "Start Your Plan"}
              </Button>
              <Link href="/quiz">
                <Button variant="outline" size="lg" className="px-8">
                  Retake Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizResults;
