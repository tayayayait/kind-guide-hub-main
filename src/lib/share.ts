const isBrowser = typeof window !== "undefined";

type SharePayload = {
  title?: string;
  text?: string;
  url?: string;
};

export async function tryWebShare(payload: SharePayload): Promise<boolean> {
  if (!isBrowser) return false;
  if (!("share" in navigator)) return false;
  try {
    await navigator.share(payload);
    return true;
  } catch {
    return false;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser) return false;
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy copy
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
