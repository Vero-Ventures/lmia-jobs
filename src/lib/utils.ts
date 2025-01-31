import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-CA", options).format(date);
}

const moneyFormatter = new Intl.NumberFormat("en-CA", {
  currency: "CAD",
});

export function formatMoney(num: number) {
  return moneyFormatter.format(num);
}

export async function tryCatch<T>(promise: Promise<T>) {
  let data = null;
  let error = null;
  try {
    data = await promise;
  } catch (e) {
    if (e instanceof Error) {
      error = e;
    }
  } finally {
    return { data, error };
  }
}
