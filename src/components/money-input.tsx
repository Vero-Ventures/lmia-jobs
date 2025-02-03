"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

import CurrencyInput from "react-currency-input-field";

type TextInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
};

export default function MoneyInput<T extends FieldValues>(
  props: TextInputProps<T>
) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <CurrencyInput
                defaultValue={field.value}
                intlConfig={{ locale: "en-CA", currency: "CAD" }}
                prefix="$"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                decimalsLimit={2}
                onValueChange={(_, __, values) => field.onChange(values?.float)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
