import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function InviteEmail({
  email,
  expiredDate,
  postNames,
  totalPosts,
}: {
  email: string;
  expiredDate: string;
  postNames: string[];
  totalPosts: number;
}) {
  return (
    <Html>
      <Head />
      <Preview>
        Join Now For Easy Job Board Postings To Help With Your LMIA
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={bodySection}>
            <Section style={titleSection}>
              <Text style={titleText}>
                Join Us Here At Opportunities To Easily Make And Manage Job
                Board Postings For Your LMIA Requirements.
              </Text>
            </Section>
            <Text style={text}>
              Our goal is to help you to get your job postings up across
              multiple job boards quickly and easily. All you have to do is
              create the post you want to make once in our admin dashboard. Our
              system will then automatically populated it across our 5 different
              job boards for key groups. We aim to make it quick and easy to
              advertise to key groups such as: At-Risk Youth, Asylum Seeksers,
              Disbabled Indeviduals, Indigenous Groups, and Recent Immigrants.
              Avoid the hassle of having to create and keep track of multiple
              job postings across each job board and join us at Opportunities.
            </Text>
            <Text style={text}>
              Join now to create an account and keep these postings up as long
              as you want. If you do not create an the account and claim your
              posts before <span className="font-bold">{expiredDate}</span>, the
              postings will be lost.
            </Text>
            <Section style={postSection}>
              {postNames.map((postName) => (
                <Text key={postName} style={postText}>
                  {postName}
                </Text>
              ))}
              {totalPosts > 3 && (
                <Text style={postText}>And {totalPosts - 3} more...</Text>
              )}
            </Section>
            <Section style={accountSection}>
              <Text style={text}>
                Use the your email to to log into your account and recive an
                email verification message. Once verified, you will be able to
                log in to your account.
              </Text>
              <Text style={linkText}>
                <a href={`https://lmia-jobs.vercel.app/sign-in`}>
                  Setup Your Account Now
                </a>
              </Text>
            </Section>
            <Section style={footerSection}>
              <Text style={footerText}>
                Join Opportunities Now For Easy To Manage Job Postings That Make
                Handling Your LMIA Easier
              </Text>
              <Text style={footerText}>
                Opt Out From Further Messages:{" "}
                <span style={linkText}>
                  <a
                    href={`https://lmia-jobs.vercel.app/opt-out?email=${email}`}>
                    Opt Out
                  </a>
                </span>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  margin: "0",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Open Sans', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
  margin: "0 auto",
};

const bodySection = {
  marginBottom: "20px",
};

const titleSection = {
  marginBottom: "15px",
  textAlign: "center" as const,
};

const postSection = {
  backgroundColor: "#f4f4f4",
  padding: "10px",
  border: "1px solid #000000",
  borderRadius: "5px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "50%",
  margin: "10px auto",
  textAlign: "center" as const,
};

const accountSection = {
  textAlign: "center" as const,
};

const footerSection = {
  marginTop: "30px",
  paddingTop: "20px",
  borderTop: "1px solid #dddddd",
  textAlign: "center" as const,
};

const text = {
  color: "#333333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Open Sans', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  lineHeight: "1.5",
};

const titleText = {
  ...text,
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1a73e8",
};

const postText = {
  ...text,
  color: "#000000",
  fontWeight: "bold",
};

const linkText = {
  ...text,
  color: "#1a73e8",
  textDecoration: "none",
};

const footerText = {
  ...text,
  fontSize: "14px",
  color: "#777777",
};
