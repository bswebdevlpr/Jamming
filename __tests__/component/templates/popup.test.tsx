import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, style, className, ...rest }: any) => (
      <div style={style} className={className} data-testid="popup-wrapper">
        {children}
      </div>
    ),
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import PopupTemplate from "@/app/ui/templates/popup";

describe("PopupTemplate", () => {
  it("should render children when isTurnedOn is true", () => {
    render(
      <PopupTemplate isTurnedOn={true}>
        <p>Popup Content</p>
      </PopupTemplate>
    );
    expect(screen.getByText("Popup Content")).toBeDefined();
  });

  it("should not render children when isTurnedOn is false", () => {
    render(
      <PopupTemplate isTurnedOn={false}>
        <p>Hidden Content</p>
      </PopupTemplate>
    );
    expect(screen.queryByText("Hidden Content")).toBeNull();
  });

  it("should apply custom className", () => {
    render(
      <PopupTemplate isTurnedOn={true} className="custom-popup">
        <p>Content</p>
      </PopupTemplate>
    );
    const wrapper = screen.getByTestId("popup-wrapper");
    expect(wrapper.className).toContain("custom-popup");
  });

  it("should apply fixed positioning", () => {
    render(
      <PopupTemplate isTurnedOn={true}>
        <p>Content</p>
      </PopupTemplate>
    );
    const wrapper = screen.getByTestId("popup-wrapper");
    expect(wrapper.className).toContain("fixed");
  });

  it("should apply custom style", () => {
    render(
      <PopupTemplate
        isTurnedOn={true}
        style={{ backgroundColor: "#000" }}
      >
        <p>Content</p>
      </PopupTemplate>
    );
    const wrapper = screen.getByTestId("popup-wrapper");
    // JSDOM converts hex "#000" to rgb format
    expect(wrapper.style.backgroundColor).toBe("rgb(0, 0, 0)");
  });

  it("should use default background color when not provided", () => {
    render(
      <PopupTemplate isTurnedOn={true}>
        <p>Content</p>
      </PopupTemplate>
    );
    const wrapper = screen.getByTestId("popup-wrapper");
    expect(wrapper.style.backgroundColor).toBe("var(--background)");
  });
});
