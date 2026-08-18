/**
 * Sorts an array of post objects dynamically by publication/creation date in descending order:
 * newest -> oldest.
 * 
 * Uses publishedAt date if available, otherwise falls back to createdAt date.
 */
export function sortByNewest(posts) {
  if (!Array.isArray(posts)) return [];
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}
