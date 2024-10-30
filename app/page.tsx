import { Container } from "@mantine/core";
import { Features, Hero } from "@/_components"

export default function Home() {
  return (
    <Container size="lg">
      <Hero />
      <Features />
    </Container>
  );
}
