import { UndefinedInitialDataOptions } from "@tanstack/react-query";

export type CustomQueryProps<T = unknown> = Partial<
  Omit<UndefinedInitialDataOptions<T, Error, T, readonly unknown[]>, "queryFn">
>;
