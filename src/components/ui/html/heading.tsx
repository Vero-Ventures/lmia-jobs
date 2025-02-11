import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const headingVariants = cva(null, {
  variants: {
    variant: {
      h1: "text-3xl font-bold tracking-tighter",
      h2: "text-xl font-semibold",
      h3: "text-lg font-semibold",
    },
  },
  defaultVariants: {
    variant: "h1",
  },
});
interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

export default function Heading({
  variant,
  className,
  ...props
}: HeadingProps) {
  const HeadingComponent = variant ?? "h1";
  return (
    <HeadingComponent
      {...props}
      className={cn(headingVariants({ variant, className }))}
    />
  );
}
