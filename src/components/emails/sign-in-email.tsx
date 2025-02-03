import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SignInEmailProps {
  otp: string;
}

export default function SignInEmail({ otp = "12345678" }: SignInEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign In to Manage Opportunites</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={upperSection}>
              <Text
                style={{
                  ...text,
                  fontSize: "30px",
                  fontWeight: "bold",
                }}>
                Sign In
              </Text>
              <Text style={mainText}>
                Please use the otp code below to sign in:
              </Text>
              <Section style={codeBox}>
                <Text style={confirmationCodeText}>{otp}</Text>
              </Section>
              <Text style={mainText}>
                If you did not request this email, you can safely ignore it.
              </Text>
              <Text style={mainText}>Thank you, The Opportunities Team.</Text>
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
  textAlign: "center" as const,
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const mainText = { ...text, marginBottom: "16px" };

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginBottom: "30px",
  padding: "40px 10px",
};

const confirmationCodeText = {
  fontSize: "40px",
  textAlign: "center" as const,
  verticalAlign: "middle",
  fontFamily: "sans-serif",
  fontWeight: 500,
};
