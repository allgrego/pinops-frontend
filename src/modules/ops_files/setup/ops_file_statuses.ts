export enum OperationStatusIds {
  CLOSED = 0,
  OPENED = 1,
  PENDING = 2,
  PENDING_FOR_QUOTATION = 3,
  IN_TRANSIT = 4,
  ON_DESTINATION = 5,
  IN_WAREHOUSE = 6,
  PREALERTED = 7,
  CANCELLED = 8,
  // Note: Must be consistent with DB. There could be others
}
