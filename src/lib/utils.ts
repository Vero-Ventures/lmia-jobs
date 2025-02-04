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

export function formatTime(num: number) {
  const roundedNum = (num * 100) / 100;
  if (roundedNum % 1 === 0) {
    return String(roundedNum);
  } else {
    return String(num);
  }
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
