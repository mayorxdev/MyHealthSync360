describe("Basic Test Setup", () => {
  it("should run basic tests", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle string operations", () => {
    const str = "Hello World";
    expect(str).toContain("World");
    expect(str).toHaveLength(11);
  });

  it("should handle arrays", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr).toHaveLength(5);
    expect(arr).toContain(3);
  });

  it("should handle objects", () => {
    const obj = { name: "Test", value: 42 };
    expect(obj).toHaveProperty("name");
    expect(obj.name).toBe("Test");
    expect(obj.value).toBe(42);
  });

  it("should handle async operations", async () => {
    const promise = Promise.resolve("success");
    await expect(promise).resolves.toBe("success");
  });
});
