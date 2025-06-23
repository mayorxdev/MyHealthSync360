"use client";

import React from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CartDrawer: React.FC = () => {
  const { state, removeItem, updateQuantity, closeCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  const handleContinueShopping = () => {
    closeCart();
    router.push("/catalog");
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Cart Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              🛍️ Your Health Pack ({state.totalItems})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              ✕
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Add some products to get started!
                </p>
                <Button
                  onClick={handleContinueShopping}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                        style={{ width: "auto", height: "auto" }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg font-bold text-emerald-600">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice &&
                          item.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                      </div>
                      {item.benefits && item.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.benefits.slice(0, 2).map((benefit, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      )}
                      {!item.inStock && (
                        <div className="mt-1">
                          <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center space-y-3">
                      {/* Enhanced Quantity Selector */}
                      <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex items-center justify-center w-10 h-10 text-xl font-bold text-gray-600 hover:text-white hover:bg-red-500 rounded-l-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>

                        <div className="flex items-center justify-center w-12 h-10 bg-gray-50 border-x border-gray-200">
                          <span className="text-lg font-bold text-gray-900">
                            {item.quantity}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex items-center justify-center w-10 h-10 text-xl font-bold text-gray-600 hover:text-white hover:bg-emerald-500 rounded-r-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600"
                          disabled={!item.inStock}
                          aria-label="Increase quantity"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 group"
                        aria-label="Remove item"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({state.totalItems} items)</span>
                  <span>${state.totalPrice.toFixed(2)}</span>
                </div>
                {state.items.length > 1 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Bundle Discount (20%)</span>
                    <span>-${(state.totalPrice * 0.2).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">
                    {state.totalPrice > 50 ? "Free" : "$4.99"}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (estimated)</span>
                  <span>
                    $
                    {(
                      (state.totalPrice -
                        (state.items.length > 1 ? state.totalPrice * 0.2 : 0)) *
                      0.08
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>
                      $
                      {(
                        state.totalPrice -
                        (state.items.length > 1 ? state.totalPrice * 0.2 : 0) +
                        (state.totalPrice > 50 ? 0 : 4.99) +
                        (state.totalPrice -
                          (state.items.length > 1
                            ? state.totalPrice * 0.2
                            : 0)) *
                          0.08
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Proceed to Checkout
                </Button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full text-emerald-600 hover:text-emerald-700 py-2 font-medium transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
