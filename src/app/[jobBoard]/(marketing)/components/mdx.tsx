import Heading from "@/components/ui/html/heading";

export const mdxComponents = {
  // Define CSS rules for components of MDX content rendered in marketing pages.
  h1: (props: string[]) => <Heading variant="h1" className="mb-8" {...props} />,
  h2: (props: string[]) => <Heading variant="h2" className="mb-4" {...props} />,
  h3: (props: string[]) => <Heading variant="h3" className="mb-4" {...props} />,
  p: (props: string[]) => (
    <p className="text-foreground/80 mb-8 text-base leading-7" {...props} />
  ),
  hr: (props: string[]) => <hr className="mt-4 mb-2" {...props} />,
};
