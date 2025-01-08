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
      <Preview>Join Now For Easy Job Postings For Your LMIA</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={bodySection}>
            <Section style={titleSection}>
              <Text style={titleText}>
                Join Us At At Opportunities To Easily Post Jobs For Your LMIA
              </Text>
            </Section>
            <Text style={mainText}>
              Our goal is to make it easy for you to get your job postings up
              across multiple job boards quickly and easily. Just create the
              post once in our dashboard and we will automatically populated it
              across our different job boards. Easily advertise to key groups
              such as: At-Risk Youth, Asylum Seeksers, Disbabled Indeviduals,
              Indigenous Groups, and Recent Immigrants.
            </Text>
            <Text style={mainText}>
              To get you started we have have an account ready for you with
              these postings already created. Join now and activate your
              pre-made account to keep these postings up as long as you want.
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
