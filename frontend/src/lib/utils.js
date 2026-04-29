/**
 * Merge class names (tailwind-friendly join; no tailwind-merge to avoid extra dep).
 * @param {...(string | undefined | null | false)} inputs
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
