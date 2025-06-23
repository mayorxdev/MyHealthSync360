import React from "react";
import { render, renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../CartContext";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

const TestComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <CartProvider>{children}</CartProvider>;

describe("CartContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe("useCart hook", () => {
    it("should provide initial cart state", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      expect(result.current.state).toEqual({
        items: [],
        isOpen: false,
        totalItems: 0,
        totalPrice: 0,
      });
    });

    it("should add item to cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 10.99,
        image: "/test.jpg",
        benefits: ["Test benefit"],
        inStock: true,
      };

      act(() => {
        result.current.addItem(testItem);
      });

      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0]).toEqual({
        ...testItem,
        quantity: 1,
      });
      expect(result.current.state.totalItems).toBe(1);
      expect(result.current.state.totalPrice).toBe(10.99);
    });

    it("should increase quantity when adding existing item", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 10.99,
        image: "/test.jpg",
        benefits: ["Test benefit"],
        inStock: true,
      };

      act(() => {
        result.current.addItem(testItem);
        result.current.addItem(testItem);
      });

      expect(result.current.state.items).toHaveLength(1);
      expect(result.current.state.items[0].quantity).toBe(2);
      expect(result.current.state.totalItems).toBe(2);
      expect(result.current.state.totalPrice).toBe(21.98);
    });

    it("should remove item from cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 10.99,
        image: "/test.jpg",
        benefits: ["Test benefit"],
        inStock: true,
      };

      act(() => {
        result.current.addItem(testItem);
      });

      expect(result.current.state.items).toHaveLength(1);

      act(() => {
        result.current.removeItem(1);
      });

      expect(result.current.state.items).toHaveLength(0);
      expect(result.current.state.totalItems).toBe(0);
      expect(result.current.state.totalPrice).toBe(0);
    });

    it("should update item quantity", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 10.99,
        image: "/test.jpg",
        benefits: ["Test benefit"],
        inStock: true,
      };

      act(() => {
        result.current.addItem(testItem);
      });

      act(() => {
        result.current.updateQuantity(1, 3);
      });

      expect(result.current.state.items[0].quantity).toBe(3);
      expect(result.current.state.totalItems).toBe(3);
      expect(result.current.state.totalPrice).toBe(32.97);
    });

    it("should remove item when quantity updated to 0", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 10.99,
        image: "/test.jpg",
        benefits: ["Test benefit"],
        inStock: true,
      };

      act(() => {
        result.current.addItem(testItem);
      });

      act(() => {
        result.current.updateQuantity(1, 0);
      });

      expect(result.current.state.items).toHaveLength(0);
    });

    it("should clear entire cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      const testItem = {
        id: 1,
        name: "Test Product",
        price: 10.99,
        image: "/test.jpg",
        benefits: ["Test benefit"],
        inStock: true,
      };

      act(() => {
        result.current.addItem(testItem);
        result.current.addItem(testItem);
      });

      expect(result.current.state.totalItems).toBe(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.state.items).toHaveLength(0);
      expect(result.current.state.totalItems).toBe(0);
      expect(result.current.state.totalPrice).toBe(0);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("cart");
    });

    it("should toggle cart visibility", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      expect(result.current.state.isOpen).toBe(false);

      act(() => {
        result.current.toggleCart();
      });

      expect(result.current.state.isOpen).toBe(true);

      act(() => {
        result.current.toggleCart();
      });

      expect(result.current.state.isOpen).toBe(false);
    });

    it("should open cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      act(() => {
        result.current.openCart();
      });

      expect(result.current.state.isOpen).toBe(true);
    });

    it("should close cart", () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      act(() => {
        result.current.openCart();
      });

      expect(result.current.state.isOpen).toBe(true);

      act(() => {
        result.current.closeCart();
      });

      expect(result.current.state.isOpen).toBe(false);
    });
  });

  describe("localStorage persistence", () => {
    it("should load cart from localStorage on initialization", () => {
      const savedItems = [
        {
          id: 1,
          name: "Saved Product",
          price: 15.99,
          image: "/saved.jpg",
          benefits: ["Saved benefit"],
          inStock: true,
          quantity: 2,
        },
      ];

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedItems));

      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      // Wait for effect to run
      act(() => {
        // Trigger effect
      });

      expect(result.current.state.items).toEqual(savedItems);
      expect(result.current.state.totalItems).toBe(2);
      expect(result.current.state.totalPrice).toBe(31.98);
    });

    it("should handle corrupted localStorage data gracefully", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid json");

      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      expect(result.current.state.items).toEqual([]);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("cart");
    });
  });

  describe("error handling", () => {
    it("should handle localStorage errors gracefully", () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      const { result } = renderHook(() => useCart(), {
        wrapper: TestComponent,
      });

      expect(result.current.state.items).toEqual([]);
    });
  });
});
