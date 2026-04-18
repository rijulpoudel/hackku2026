export function buildImageUrl(prompt: string): string {
  const styleAddition =
    ", flat digital illustration, warm muted colors, no text in image, clean lines, financial life moment";
  const fullPrompt = prompt + styleAddition;
  const encoded = encodeURIComponent(fullPrompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&nologo=true&seed=${Date.now()}`;
}
