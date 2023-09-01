export function isValidUrl(url: string): boolean {
  try {
    const tempUrl = new URL(url);
    if (tempUrl.protocol === 'http:' || tempUrl.protocol === 'https:') {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
