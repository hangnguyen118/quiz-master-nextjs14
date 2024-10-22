import { AuthForm } from "@/components";
import { Container } from "@mantine/core";

export default function Page() {
    return (
        <Container size="xs">
            <main>
                <AuthForm />
            </main>
        </Container>
    );
}