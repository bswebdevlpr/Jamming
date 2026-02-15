import { describe, it, expect } from "vitest";
import {
  toggleEnumValue,
  toggleEnumValueTuple,
  emptyStringToNull,
  nullToEmptyString,
} from "@/app/lib/utils/form";

describe("toggleEnumValue", () => {
  it("should add value when not present", () => {
    const result = toggleEnumValue(["a", "b"], "c");
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should remove value when already present", () => {
    const result = toggleEnumValue(["a", "b", "c"], "b");
    expect(result).toEqual(["a", "c"]);
  });

  it("should handle empty array", () => {
    const result = toggleEnumValue([], "a");
    expect(result).toEqual(["a"]);
  });

  it("should remove the only element", () => {
    const result = toggleEnumValue(["a"], "a");
    expect(result).toEqual([]);
  });

  it("should work with enum values", () => {
    enum TestEnum {
      A = "a",
      B = "b",
      C = "c",
    }
    const result = toggleEnumValue([TestEnum.A], TestEnum.B);
    expect(result).toEqual([TestEnum.A, TestEnum.B]);
  });

  it("should work with numbers", () => {
    const result = toggleEnumValue([1, 2, 3], 2);
    expect(result).toEqual([1, 3]);
  });
});

describe("toggleEnumValueTuple", () => {
  it("should add value when not present", () => {
    const result = toggleEnumValueTuple(["a"] as [string, ...string[]], "b");
    expect(result).toEqual(["a", "b"]);
  });

  it("should remove value when present (more than 1 element)", () => {
    const result = toggleEnumValueTuple(
      ["a", "b"] as [string, ...string[]],
      "a"
    );
    expect(result).toEqual(["b"]);
  });

  it("should keep the value when it is the last one (cannot be empty)", () => {
    const result = toggleEnumValueTuple(["a"] as [string, ...string[]], "a");
    // When trying to remove the last element, it should keep at least one
    expect(result).toEqual(["a"]);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("should return tuple type (at least 1 element)", () => {
    const result = toggleEnumValueTuple(
      ["a", "b", "c"] as [string, ...string[]],
      "b"
    );
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("should add to the end", () => {
    const result = toggleEnumValueTuple(
      ["a", "b"] as [string, ...string[]],
      "c"
    );
    expect(result).toEqual(["a", "b", "c"]);
  });
});

describe("emptyStringToNull", () => {
  it("should convert empty string to null", () => {
    expect(emptyStringToNull("")).toBeNull();
  });

  it("should convert whitespace-only string to null", () => {
    expect(emptyStringToNull("   ")).toBeNull();
  });

  it("should return trimmed value for non-empty string", () => {
    expect(emptyStringToNull("  hello  ")).toBe("hello");
  });

  it("should return value as-is for no-whitespace string", () => {
    expect(emptyStringToNull("hello")).toBe("hello");
  });

  it("should handle single space", () => {
    expect(emptyStringToNull(" ")).toBeNull();
  });
});

describe("nullToEmptyString", () => {
  it("should convert null to empty string", () => {
    expect(nullToEmptyString(null)).toBe("");
  });

  it("should convert undefined to empty string", () => {
    expect(nullToEmptyString(undefined)).toBe("");
  });

  it("should return value as-is for non-null string", () => {
    expect(nullToEmptyString("hello")).toBe("hello");
  });

  it("should return empty string as-is", () => {
    expect(nullToEmptyString("")).toBe("");
  });
});
