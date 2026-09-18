/**
 * Extracts an 11-character YouTube video ID from any common URL shape:
 *   - https://www.youtube.com/watch?v=VIDEOID
 *   - https://youtu.be/VIDEOID
 *   - https://www.youtube.com/shorts/VIDEOID
 *   - https://www.youtube.com/embed/VIDEOID
 *   - a bare 11-character video ID pasted directly
 *
 * Returns null if no valid ID could be found.
 */
export function extractYouTubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  // Already a bare video ID.
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return isValidId(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return isValidId(id) ? id : null;
      }
      const segments = url.pathname.split("/").filter(Boolean);
      if (
        (segments[0] === "shorts" || segments[0] === "embed" || segments[0] === "live") &&
        segments[1]
      ) {
        return isValidId(segments[1]) ? segments[1] : null;
      }
    }
  } catch {
    // Not a valid URL — fall through to null.
  }

  return null;
}

function isValidId(id: string | null | undefined): id is string {
  return !!id && /^[a-zA-Z0-9_-]{11}$/.test(id);
}

export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
export const ytThumbFallback = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
