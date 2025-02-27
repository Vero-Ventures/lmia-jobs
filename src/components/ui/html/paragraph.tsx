import { cn } from "@/lib/utils";

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export default function P({ ...props }: ParagraphProps) {
  return (
    <p
      className={cn("text-foreground/80 text-base leading-7", props.className)}
      {...props}
    />
  );
}
