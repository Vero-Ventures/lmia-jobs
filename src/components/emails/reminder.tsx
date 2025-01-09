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
            <Text style={mainText}>
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
            <Text style={mainText}>
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
                <Text style={postText}>+{totalPosts - 3} More...</Text>
              )}
            </Section>
            <Text style={mainText}>
              Log in the following temporary credientals to setup your account.
            </Text>
            <Text style={credentialText}>
              Email: {email}
              <br />
              Temporary Password: {tempPassword}
            </Text>
            <Text style={footerText}>
              Setup Your Account Now:{" "}
              <span style={linkText}>
                <a href={`https://lmia-jobs.vercel.app/sign-in`}>Here</a>
              </span>
            </Text>
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

const body = {};

const container = {};

const bodySection = {};
const titleSection = {};
const postSection = {};
const footerSection = {};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Open Sans', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
};

const titleText = { ...text };
const mainText = { ...text };
const credentialText = { ...text };
const postText = { ...text };
const linkText = { ...text };
const footerText = { ...text };
