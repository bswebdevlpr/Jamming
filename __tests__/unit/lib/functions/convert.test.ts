import { describe, it, expect } from "vitest";
import { convertBPMToTempo } from "@/app/lib/functions/convert";

describe("convertBPMToTempo", () => {
  it("should return 'Presto' for BPM >= 180", () => {
    expect(convertBPMToTempo(180)).toBe("Presto");
    expect(convertBPMToTempo(200)).toBe("Presto");
    expect(convertBPMToTempo(250)).toBe("Presto");
  });

  it("should return 'Vivace' for BPM 168-179", () => {
    expect(convertBPMToTempo(168)).toBe("Vivace");
    expect(convertBPMToTempo(175)).toBe("Vivace");
    expect(convertBPMToTempo(179)).toBe("Vivace");
  });

  it("should return 'Allegro' for BPM 132-167", () => {
    expect(convertBPMToTempo(132)).toBe("Allegro");
    expect(convertBPMToTempo(150)).toBe("Allegro");
    expect(convertBPMToTempo(167)).toBe("Allegro");
  });

  it("should return 'Allegretto' for BPM 120-131", () => {
    expect(convertBPMToTempo(120)).toBe("Allegretto");
    expect(convertBPMToTempo(125)).toBe("Allegretto");
    expect(convertBPMToTempo(131)).toBe("Allegretto");
  });

  it("should return 'Moderato' for BPM 108-119", () => {
    expect(convertBPMToTempo(108)).toBe("Moderato");
    expect(convertBPMToTempo(115)).toBe("Moderato");
    expect(convertBPMToTempo(119)).toBe("Moderato");
  });

  it("should return 'Andante' for BPM 76-107", () => {
    expect(convertBPMToTempo(76)).toBe("Andante");
    expect(convertBPMToTempo(90)).toBe("Andante");
    expect(convertBPMToTempo(107)).toBe("Andante");
  });

  it("should return 'Adagio' for BPM 60-75", () => {
    expect(convertBPMToTempo(60)).toBe("Adagio");
    expect(convertBPMToTempo(70)).toBe("Adagio");
    expect(convertBPMToTempo(75)).toBe("Adagio");
  });

  it("should return 'Largo' for BPM 40-59", () => {
    expect(convertBPMToTempo(40)).toBe("Largo");
    expect(convertBPMToTempo(50)).toBe("Largo");
    expect(convertBPMToTempo(59)).toBe("Largo");
  });

  it("should return 'Grave' for BPM 20-39", () => {
    expect(convertBPMToTempo(20)).toBe("Grave");
    expect(convertBPMToTempo(30)).toBe("Grave");
    expect(convertBPMToTempo(39)).toBe("Grave");
  });

  it("should return empty string for BPM < 20", () => {
    expect(convertBPMToTempo(0)).toBe("");
    expect(convertBPMToTempo(10)).toBe("");
    expect(convertBPMToTempo(19)).toBe("");
  });

  it("should handle boundary values correctly", () => {
    // Exact boundary tests
    expect(convertBPMToTempo(19)).toBe("");
    expect(convertBPMToTempo(20)).toBe("Grave");
    expect(convertBPMToTempo(39)).toBe("Grave");
    expect(convertBPMToTempo(40)).toBe("Largo");
    expect(convertBPMToTempo(59)).toBe("Largo");
    expect(convertBPMToTempo(60)).toBe("Adagio");
    expect(convertBPMToTempo(75)).toBe("Adagio");
    expect(convertBPMToTempo(76)).toBe("Andante");
    expect(convertBPMToTempo(107)).toBe("Andante");
    expect(convertBPMToTempo(108)).toBe("Moderato");
  });
});
