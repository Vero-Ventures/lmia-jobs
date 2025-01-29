import Heading from "@/components/heading";

export const mdxComponents = {
  h1: (props: string[]) => <Heading variant="h1" className="mb-8" {...props} />,
  h2: (props: string[]) => <Heading variant="h2" className="mb-4" {...props} />,
  h3: (props: string[]) => <Heading variant="h3" className="mb-4" {...props} />,
  p: (props: string[]) => (
    <p className="mb-8 text-base leading-7 text-foreground/80" {...props} />
  ),
  hr: (props: string[]) => <hr className="mb-2 mt-4" {...props} />,
};
