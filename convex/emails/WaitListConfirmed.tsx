import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function WaitListConfirmed() {
  return (
    <Html>
      <Head />
      <Preview>
        Great news! You&apos;ve been added to our waitlist for Job Bank.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={upperSection}>
              <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                You&apos;re on the list!
              </Text>
              <Text style={mainText}>Hi,</Text>
              <Text style={validityText}>
                Great news! You&apos;ve been added to our waitlist for Job Bank.
              </Text>
              <Text style={validityText}>
                We&apos;ll notify you as soon as it becomes available.
              </Text>
              <Text style={validityText}>Thank you for your interest!</Text>
              <Section style={{ paddingTop: "16px" }}>
                <Text style={footerText}>Best,</Text>
                <Text style={{ ...footerText, fontWeight: "bold" }}>
                  Yaniv Talmor
                </Text>
                <Text style={footerText}>Founder, Vero Ventures</Text>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Open Sans', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  margin: "24px 0",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const validityText = {
  ...text,
  margin: "0px",
  marginBottom: "16px",
  textAlign: "left" as const,
};

const footerText = {
  ...text,
  margin: "0px",
  marginBottom: "8px",
  textAlign: "left" as const,
};

const mainText = { ...text, marginBottom: "16px" };
