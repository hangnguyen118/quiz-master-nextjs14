import { Container } from "@mantine/core";
import { Features, Hero } from "@/components"

export default function Home() {
  return (
    <Container size="lg">
      <main>
        <Hero />
        <Features />
      </main>
    </Container>
  );
}
