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
  postNames,
  totalPosts,
  email,
}: {
  postNames: string[];
  totalPosts: number;
  email: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Reminder: Easy Job Postings For Your LMIA</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={bodySection}>
            <Section style={titleSection}>
              <Text style={titleText}>
                You Habe Limited Time To Join Opportunities For Your LMIA
                Related Jobs Postings
              </Text>
            </Section>
            <Text style={mainText}>
              Your account is ready to go with these postings already created.
              Join now and activate your account to keep these postings up as
              long as you want.
            </Text>
            <Text style={mainText}>
              If you do not join within a month of the account creation date,
              your account will be deleted and you will have to create a new
              one. The following job postings will be lost if the account is not
              activated.
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
            <Section style={footerSection}>
              <Text style={footerText}>
                Join Opportunities Now For Easy Job Postings For Your LMIA
                Requirements
              </Text>
              <Text style={footerText}>
                Opt Out From Further Messages:{" "}
                <span style={optOutLink}>
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
  backgroundColor: "#fff",
  color: "#212121",
};

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
const postText = { ...text };
const footerText = { ...text };
const optOutLink = { ...text };
