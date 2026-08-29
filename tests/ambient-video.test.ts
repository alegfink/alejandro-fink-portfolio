import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("ambient project videos", () => {
  it("keeps the iOS inline-autoplay contract and a manual playback fallback", () => {
    const source = readFileSync(join(root, "components/v2/ambient-video.tsx"), "utf8");

    expect(source).toContain("video.defaultMuted = true");
    expect(source).toContain("video.muted = true");
    expect(source).toContain("video.playsInline = true");
    expect(source).toContain('video.setAttribute("webkit-playsinline", "")');
    expect(source).toContain("<button");
    expect(source).toContain("onClick={playFromControl}");
    expect(source).toContain('type="video/mp4"');
  });

  it.each([
    "public/media/projects/torvena/page-preview.mp4",
    "public/media/projects/luca-ds/hero-transition.mp4",
  ])("ships %s as fast-start H.264", (relativePath) => {
    const bytes = readFileSync(join(root, relativePath));
    const atoms = bytes.toString("latin1");
    const codecPosition = atoms.indexOf("avc1");
    const moovPosition = atoms.indexOf("moov");
    const mediaPosition = atoms.indexOf("mdat");

    expect(codecPosition).toBeGreaterThanOrEqual(0);
    expect(moovPosition).toBeGreaterThanOrEqual(0);
    expect(mediaPosition).toBeGreaterThan(moovPosition);
  });
});
