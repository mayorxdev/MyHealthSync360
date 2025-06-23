import { cn } from "../utils";

describe("Utils", () => {
  describe("cn (className utility)", () => {
    it("should merge class names correctly", () => {
      const result = cn("base-class", "additional-class");
      expect(result).toContain("base-class");
      expect(result).toContain("additional-class");
    });

    it("should handle conditional classes", () => {
      const result = cn(
        "base-class",
        true && "conditional-class",
        false && "hidden-class"
      );
      expect(result).toContain("base-class");
      expect(result).toContain("conditional-class");
      expect(result).not.toContain("hidden-class");
    });

    it("should handle undefined and null values", () => {
      const result = cn("base-class", undefined, null, "visible-class");
      expect(result).toContain("base-class");
      expect(result).toContain("visible-class");
      expect(result).not.toContain("undefined");
      expect(result).not.toContain("null");
    });

    it("should handle empty values", () => {
      const result = cn("", "class1", "", "class2");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
    });

    it("should handle Tailwind class conflicts correctly", () => {
      const result = cn("bg-red-500", "bg-blue-500");
      // Should prioritize the last conflicting class
      expect(result).toContain("bg-blue-500");
    });

    it("should handle object notation", () => {
      const result = cn({
        "base-class": true,
        "conditional-class": false,
        "active-class": true,
      });
      expect(result).toContain("base-class");
      expect(result).toContain("active-class");
      expect(result).not.toContain("conditional-class");
    });

    it("should handle array inputs", () => {
      const result = cn(["class1", "class2"], "class3");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
      expect(result).toContain("class3");
    });
  });
});
