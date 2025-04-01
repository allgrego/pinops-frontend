/**
 * Short a UUID
 *
 * @param {string} uuid
 *
 * @return {string}
 */
export const shortUUID = (uuid: string): string => {
  return uuid?.substring(0, 8)?.toUpperCase() || "";
};
