import { render, screen } from "@testing-library/react";
import Card from "./Card";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

// Fix for Problem 4: Mock the image assets so Vitest doesn't choke on them
vi.mock("../../../app/assets/match/matchAssets", () => ({
  cardSuitIcons: {
    spade: "spade-icon.png",
    heart: "heart-icon.png",
    diamond: "diamond-icon.png",
    club: "club-icon.png",
  },
}));

describe("Card Component", () => {
  // Common props to satisfy CardInterface
  const defaultProps = {
    side: "face-up" as const,
    currentLocation: "p1" as const,
    isDiscarded: false,
    deckDesign: "default",
  };

  it("renders the correct rank and suit icon", () => {
    // Fix for Problem 1 & 2: Added missing required props
    render(<Card value="A" suit="spade" {...defaultProps} />);

    const rankElements = screen.getAllByText(/A/i);

    // Fix for Problem 3: Removed 'as any' (requires @testing-library/jest-dom)
    expect(rankElements[0]).toBeInTheDocument();
    expect(rankElements.length).toBe(2);
  });

  it('applies a "red" class for hearts and diamonds', () => {
    const { container } = render(
      <Card value="Q" suit="heart" {...defaultProps} />,
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass("text-red");
  });
});
