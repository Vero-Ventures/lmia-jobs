import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function ReminderEmail({
  email,
  tempPassword,
  expiredDate,
  postNames,
  totalPosts,
}: {
  email: string;
  tempPassword: string;
  expiredDate: string;
  postNames: string[];
  totalPosts: number;
}) {
  return (
    <Html>
      <Head />
      <Preview>
        Dont Forget: Join Now For Easy Job Postings For Your LMIA
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={bodySection}>
            <Section style={titleSection}>
              <Text style={titleText}>
                You Have Limited Time To Join Opportunities And Easily Make And
                Manage Job Board Postings For Your LMIA Requirements.
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
              To get you started we created an account ready for you to get
              started with these postings already created. If you do not join
              and activate by {expiredDate}, this account will be deleted. The
              following job postings will be lost.
            </Text>
            <Section style={postSection}>
              {postNames.map((postName) => (
                <Text key={postName} style={postText}>
                  {postName}
                </Text>
              ))}
              {totalPosts > 3 && (
                <Text style={postText}>+{totalPosts - 3} More ...</Text>
              )}
            </Section>
            <Section style={accountSection}>
              <Text style={text}>
                Use the following temporary credientals to log into your account
                and recive an email verification message. Once verified, you
                will be able to reset your password or log in to your account.
              </Text>
              <Text style={credentialText}>
                Email: {email}
                <br />
                Temporary Password: {tempPassword}
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
                    href={`https://lmia-jobs.vercel.app/opt-out?account=${email}`}>
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

const credentialText = {
  ...text,
  fontWeight: "bold",
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
