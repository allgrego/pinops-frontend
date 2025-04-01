/**
 * Transform a provided string date into a readable string
 *
 * @param {string} dateString
 * @param {string} defaultValue
 *
 * @returns {string}
 */
export const formatDate = (
  dateString: string | undefined | null,
  defaultValue = "- -",
  options?: Intl.DateTimeFormatOptions
) => {
  if (!dateString) return defaultValue;

  return new Date(dateString).toLocaleDateString("en-GB", {
    ...options,
  });
};
