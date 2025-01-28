import PrivacyPolicy from "@/app/admin/(marketing)/privacy-policy/privacy-policy.mdx";

export default async function Page() {
  const components = {
    h1: (props: string[]) => (
      <p
        className="mb-2 text-center text-2xl font-bold mb:text-3xl sm:text-4xl"
        {...props}
      />
    ),
    h2: (props: string[]) => (
      <p className="mb-2 mt-6 text-xl font-semibold" {...props} />
    ),
    p: (props: string[]) => <p className="leading-8" {...props} />,
  };

  return (
    <main className="mx-auto my-6 w-3/4 max-w-4xl flex-grow rounded-lg border-4 border-gray-400 border-opacity-60 bg-white p-4 mb:p-8 sm:my-8 lg:w-2/3">
      <PrivacyPolicy components={components} />
    </main>
  );
}
