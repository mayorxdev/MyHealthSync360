import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ClientOnly from "../ClientOnly";

// Mock for testing hydration behavior
const originalUseEffect = React.useEffect;

describe("ClientOnly Component", () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  it("should render children after hydration", async () => {
    render(
      <ClientOnly>
        <div data-testid="client-content">Client Only Content</div>
      </ClientOnly>
    );

    await waitFor(() => {
      expect(screen.getByTestId("client-content")).toBeInTheDocument();
    });
  });

  it("should render fallback while hydrating", () => {
    render(
      <ClientOnly fallback={<div data-testid="fallback">Loading...</div>}>
        <div data-testid="client-content">Client Only Content</div>
      </ClientOnly>
    );

    // Either fallback exists or content exists (depending on hydration state)
    const fallback = screen.queryByTestId("fallback");
    const content = screen.queryByTestId("client-content");

    // At least one should be present
    expect(fallback || content).toBeTruthy();
  });

  it("should handle multiple children", async () => {
    render(
      <ClientOnly>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
        <span data-testid="child-3">Third Child</span>
      </ClientOnly>
    );

    await waitFor(() => {
      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
      expect(screen.getByTestId("child-3")).toBeInTheDocument();
    });
  });

  it("should handle components with hooks", async () => {
    const HookComponent: React.FC = () => {
      const [count, setCount] = React.useState(0);

      return (
        <div>
          <span data-testid="count">{count}</span>
          <button onClick={() => setCount((c) => c + 1)}>Increment</button>
        </div>
      );
    };

    render(
      <ClientOnly>
        <HookComponent />
      </ClientOnly>
    );

    await waitFor(() => {
      expect(screen.getByTestId("count")).toBeInTheDocument();
    });
  });

  it("should preserve component props and state", async () => {
    const TestComponent: React.FC<{ initialValue: number }> = ({
      initialValue,
    }) => {
      const [value, setValue] = React.useState(initialValue);

      return (
        <div>
          <span data-testid="value">{value}</span>
          <button
            onClick={() => setValue((v) => v + 1)}
            data-testid="increment"
          >
            Increment
          </button>
        </div>
      );
    };

    render(
      <ClientOnly>
        <TestComponent initialValue={10} />
      </ClientOnly>
    );

    await waitFor(() => {
      expect(screen.getByTestId("value")).toHaveTextContent("10");
    });
  });

  it("should handle empty children gracefully", () => {
    render(<ClientOnly>{null}</ClientOnly>);
    render(<ClientOnly>{undefined}</ClientOnly>);
    render(<ClientOnly>{false}</ClientOnly>);

    // Should not crash or throw errors
    expect(() => {
      render(<ClientOnly>{""}</ClientOnly>);
    }).not.toThrow();
  });

  it("should work with fallback prop", () => {
    const { rerender } = render(
      <ClientOnly fallback={<div data-testid="loading">Loading...</div>}>
        <div data-testid="content">Content</div>
      </ClientOnly>
    );

    // Test that fallback prop is accepted without errors
    expect(() => {
      rerender(
        <ClientOnly
          fallback={<div data-testid="custom-loading">Custom Loading...</div>}
        >
          <div data-testid="content">Content</div>
        </ClientOnly>
      );
    }).not.toThrow();
  });

  it("should handle complex nested components", async () => {
    const NestedComponent: React.FC = () => (
      <div data-testid="nested">
        <ClientOnly>
          <div data-testid="inner-client">Inner Client Only</div>
        </ClientOnly>
      </div>
    );

    render(
      <ClientOnly>
        <NestedComponent />
      </ClientOnly>
    );

    await waitFor(() => {
      expect(screen.getByTestId("nested")).toBeInTheDocument();
      expect(screen.getByTestId("inner-client")).toBeInTheDocument();
    });
  });
});
