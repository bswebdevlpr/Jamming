import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock framer-motion to render plain elements
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import {
  PositionTag,
  GenreTag,
  LocationTag,
  LevelTag,
  TagList,
} from "@/app/ui/tags/category-tag";

describe("Category Tags", () => {
  describe("PositionTag", () => {
    it("should render with mapped position text", () => {
      render(<PositionTag text="guitar" />);
      // MapDataToPosition should translate "guitar" to Korean
      const tag = screen.getByText(/기타|guitar/i);
      expect(tag).toBeDefined();
    });

    it("should render fallback text when key not found", () => {
      render(<PositionTag text="unknown_position" />);
      expect(screen.getByText("unknown_position")).toBeDefined();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <PositionTag text="guitar" className="custom-class" />
      );
      const tag = container.querySelector("p");
      expect(tag?.className).toContain("custom-class");
    });

    it("should have pink color style", () => {
      const { container } = render(<PositionTag text="guitar" />);
      const tag = container.querySelector("p");
      // JSDOM converts hex to rgb format
      expect(tag?.style.color).toBe("rgb(255, 55, 115)");
    });
  });

  describe("GenreTag", () => {
    it("should render with mapped genre text", () => {
      render(<GenreTag text="rock" />);
      const tag = screen.getByText(/록|rock/i);
      expect(tag).toBeDefined();
    });

    it("should have green color style", () => {
      const { container } = render(<GenreTag text="rock" />);
      const tag = container.querySelector("p");
      // JSDOM converts hex to rgb format
      expect(tag?.style.color).toBe("rgb(163, 255, 12)");
    });
  });

  describe("LocationTag", () => {
    it("should render with mapped location text", () => {
      render(<LocationTag text="seoul" />);
      const tag = screen.getByText(/서울|seoul/i);
      expect(tag).toBeDefined();
    });

    it("should have blue color style", () => {
      const { container } = render(<LocationTag text="seoul" />);
      const tag = container.querySelector("p");
      // JSDOM converts hex to rgb format
      expect(tag?.style.color).toBe("rgb(57, 148, 255)");
    });
  });

  describe("LevelTag", () => {
    it("should render with mapped level text", () => {
      render(<LevelTag text="beginner" />);
      const tag = screen.getByText(/초급|beginner/i);
      expect(tag).toBeDefined();
    });

    it("should have gray color style", () => {
      const { container } = render(<LevelTag text="beginner" />);
      const tag = container.querySelector("p");
      // JSDOM converts hex to rgb format
      expect(tag?.style.color).toBe("rgb(229, 229, 233)");
    });
  });

  describe("TagList", () => {
    it("should render multiple tags", () => {
      const tags = [
        <span key="1">Tag1</span>,
        <span key="2">Tag2</span>,
        <span key="3">Tag3</span>,
      ];
      render(<TagList tags={tags} />);
      expect(screen.getByText("Tag1")).toBeDefined();
      expect(screen.getByText("Tag2")).toBeDefined();
      expect(screen.getByText("Tag3")).toBeDefined();
    });

    it("should render with flex layout", () => {
      const tags = [<span key="1">Tag1</span>];
      const { container } = render(<TagList tags={tags} />);
      const div = container.querySelector("div");
      expect(div?.className).toContain("flex");
    });

    it("should render empty tag list", () => {
      const { container } = render(<TagList tags={[]} />);
      const div = container.querySelector("div");
      expect(div).toBeDefined();
      expect(div?.children.length).toBe(0);
    });
  });
});
