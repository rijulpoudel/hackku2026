import { buildImageUrl } from "@/lib/image";

describe("image", () => {
  it("builds an image URL with encoded prompt and deterministic seed", () => {
    vi.spyOn(Date, "now").mockReturnValue(1234567890);
    const url = buildImageUrl("person looking at budget spreadsheet");

    expect(url).toContain("https://image.pollinations.ai/prompt/");
    expect(url).toContain(
      encodeURIComponent(
        "person looking at budget spreadsheet, flat digital illustration, warm muted colors, no text in image, clean lines, financial life moment",
      ),
    );
    expect(url).toContain("?width=800&height=450&nologo=true&seed=1234567890");
  });
});
