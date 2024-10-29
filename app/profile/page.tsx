'use client'
import { auth } from "@/lib/firebase/firebase";
import { Button, Container, Group, Loader, Paper, PaperProps, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation'

export default function Page(props: PaperProps) {
    const router = useRouter()
    const [loading, { toggle }] = useDisclosure(false);
    const form = useForm({
        initialValues: {
            email: auth.currentUser?.email ?? '' ,
            name: auth.currentUser?.displayName ?? '',
            password: ''
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            name: (val) => (val.trim().length > 0 ? null : 'Invalid password'),
            password: (val) => (val.length > 6 ? null : 'Password should include at least 6 characters'),
        },
    });
    const handleSubmit = () => {
        toggle();
        router.push('/dashboard');
        
    }
    const handleSingout = () => {
        toggle();
        auth.signOut();
        router.push('/')
    }
    return (
        <Container size="sm">
            <Paper radius="md" p="xl" withBorder {...props}>
                <Text size="lg" fw={500} mb="md">
                    My Profile
                </Text>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder={form.values.name}
                            value={form.values.name}
                            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                            error={form.errors.name && 'Invalid name'}
                            radius="md"
                        />
                        <TextInput
                            label="Email"
                            placeholder={form.values.email}
                            value={form.values.email}
                            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                            error={form.errors.email && 'Invalid email'}
                            radius="md"
                        />
                        <PasswordInput
                            label="Password"
                            placeholder={form.values.password}
                            value={form.values.password}
                            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                            error={form.errors.password && 'Password should include at least 6 characters'}
                            radius="md"
                        />
                    </Stack>
                    <Group justify="space-between" mt="xl">
                        <Button type="submit" radius="xl">
                            Save
                            {loading && <Loader color="white" size={20} ml="xs" />}
                        </Button>
                        <Button onClick={handleSingout} radius="xl" variant="outline" loading={loading} >
                            Logout
                            {loading && <Loader color="white" size={20} ml="xs" />}
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    )
}
