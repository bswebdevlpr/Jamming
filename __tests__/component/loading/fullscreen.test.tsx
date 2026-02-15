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

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, width, height, style, ...rest }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={style}
      data-testid="loading-logo"
    />
  ),
}));

import FullScreenLoading from "@/app/ui/loading/fullscreen";

describe("FullScreenLoading", () => {
  it("should render when isTurnedOn is true (default)", () => {
    render(<FullScreenLoading />);
    const logo = screen.getByTestId("loading-logo");
    expect(logo).toBeDefined();
    expect(logo.getAttribute("src")).toBe("/logo.svg");
  });

  it("should render with isTurnedOn=true explicitly", () => {
    render(<FullScreenLoading isTurnedOn={true} />);
    expect(screen.getByTestId("loading-logo")).toBeDefined();
  });

  it("should not render when isTurnedOn is false", () => {
    render(<FullScreenLoading isTurnedOn={false} />);
    expect(screen.queryByTestId("loading-logo")).toBeNull();
  });

  it("should display logo image with correct dimensions", () => {
    render(<FullScreenLoading />);
    const logo = screen.getByTestId("loading-logo");
    expect(logo.getAttribute("width")).toBe("149");
    expect(logo.getAttribute("height")).toBe("138");
  });

  it("should have animation style on logo", () => {
    render(<FullScreenLoading />);
    const logo = screen.getByTestId("loading-logo") as HTMLImageElement;
    expect(logo.style.animation).toContain("infinite_rotate");
  });
});
