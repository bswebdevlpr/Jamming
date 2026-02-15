import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, style, className, type, ...rest }: any) => (
      <button
        onClick={onClick}
        style={style}
        className={className}
        type={type}
      >
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import ButtonTemplate, {
  ButtonBasicActiveStyle,
  ButtonBasicInactiveStyle,
} from "@/app/ui/templates/buttons";
import CompleteButton from "@/app/ui/buttons/complete";

describe("ButtonTemplate", () => {
  it("should render button with text", () => {
    render(<ButtonTemplate text="Click Me" />);
    expect(screen.getByText("Click Me")).toBeDefined();
  });

  it("should call onClick when clicked", () => {
    const onClick = vi.fn();
    render(<ButtonTemplate text="Click" onClick={onClick} />);
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("should apply active styles when isActive is true", () => {
    const { container } = render(
      <ButtonTemplate text="Active" isActive={true} />
    );
    const button = container.querySelector("button");
    // JSDOM converts hex "#A3FF0C" to rgb format
    expect(button?.style.color).toBe("rgb(163, 255, 12)");
  });

  it("should apply inactive styles when isActive is false", () => {
    const { container } = render(
      <ButtonTemplate text="Inactive" isActive={false} />
    );
    const button = container.querySelector("button");
    // JSDOM converts hex "#9F9FA2" to rgb format
    expect(button?.style.color).toBe("rgb(159, 159, 162)");
  });

  it("should not call onClick when isActive is false", () => {
    const onClick = vi.fn();
    render(
      <ButtonTemplate text="Disabled" onClick={onClick} isActive={false} />
    );
    fireEvent.click(screen.getByText("Disabled"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("should default to submit type", () => {
    const { container } = render(<ButtonTemplate text="Submit" />);
    const button = container.querySelector("button");
    expect(button?.type).toBe("submit");
  });

  it("should support custom type", () => {
    const { container } = render(
      <ButtonTemplate text="Button" type="button" />
    );
    const button = container.querySelector("button");
    expect(button?.type).toBe("button");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <ButtonTemplate text="Styled" className="w-full" />
    );
    const button = container.querySelector("button");
    expect(button?.className).toContain("w-full");
  });
});

describe("CompleteButton", () => {
  it("should render with '완료' text", () => {
    render(<CompleteButton />);
    expect(screen.getByText("완료")).toBeDefined();
  });

  it("should call onClick when active", () => {
    const onClick = vi.fn();
    render(<CompleteButton isActive={true} onClick={onClick} />);
    fireEvent.click(screen.getByText("완료"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("should not call onClick when inactive", () => {
    const onClick = vi.fn();
    render(<CompleteButton isActive={false} onClick={onClick} />);
    fireEvent.click(screen.getByText("완료"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
