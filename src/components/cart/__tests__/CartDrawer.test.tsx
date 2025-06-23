import React from "react";
import { render, screen, act } from "@testing-library/react";
import CartDrawer from "../CartDrawer";
import { CartProvider } from "@/contexts/CartContext";

// Mock Next.js router
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: "/",
  route: "/",
  query: {},
  asPath: "/",
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isReady: true,
};

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

// Mock Next.js Image component
jest.mock("next/image", () => {
  const MockImage = ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  );
  MockImage.displayName = "MockImage";
  return MockImage;
});

// Test wrapper with CartProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CartProvider>{children}</CartProvider>
);
TestWrapper.displayName = "TestWrapper";

describe("CartDrawer Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without crashing when cart is closed", () => {
    expect(() => {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  it("should not display anything when cart is closed by default", () => {
    const { container } = render(
      <TestWrapper>
        <CartDrawer />
      </TestWrapper>
    );

    // Cart should not be visible when closed
    expect(container.firstChild).toBeNull();
  });

  it("should handle cart context properly", () => {
    // This test ensures the CartDrawer can access the cart context without errors
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <TestWrapper>
        <CartDrawer />
      </TestWrapper>
    );

    // No console errors should be logged from missing context
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringMatching(/useCart must be used within a CartProvider/)
    );

    consoleSpy.mockRestore();
  });

  it("should integrate with CartProvider successfully", () => {
    // Test that the component integrates with CartProvider without throwing errors
    let renderError: Error | null = null;

    try {
      render(
        <TestWrapper>
          <CartDrawer />
        </TestWrapper>
      );
    } catch (error) {
      renderError = error as Error;
    }

    expect(renderError).toBeNull();
  });
});
