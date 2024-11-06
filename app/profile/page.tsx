"use client"
import { auth } from "@/_lib/firebase/firebase";
import { Button, Container, Flex, Group, Loader, Paper, PasswordInput, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from '@mantine/hooks';
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { useRouter } from 'next/navigation'
import { useEffect } from "react";

export default function Page() {
    const router = useRouter()
    const [loading, { toggle }] = useDisclosure(false);
    const form = useForm({
        initialValues: {
            email: auth.currentUser?.email ?? '',
            name: auth.currentUser?.displayName ?? '',
            password: '****************'
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            name: (val) => (val.trim().length > 0 ? null : 'Invalid name'),
            password: (val) => (val.length > 6 ? null : 'Password should include at least 6 characters'),
        },
    });
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log("1");
            if (user) {
                form.setFieldValue('email', user.email ?? '');
                form.setFieldValue('name', user.displayName ?? '');
            }
        });
    }, []);
    const handleSingout = () => {
        toggle();
        auth.signOut();
        router.push('/');
    }
    const updateName = () => {
        toggle();
        if (auth.currentUser) {
            updateProfile(auth.currentUser, {
                displayName: form.values.name,
            }).then(() => {
                console.log("update sucesss");
                toggle();
            }).catch((error) => {
                console.log(error);
            })
        }
    }
    const updateEmail = () => {

    }
    const updatePassword = () => {

    }
    return (
        <Container size="sm">
            <Paper radius="md" p="xl" withBorder={true}>
                <Text size="lg" fw={500} mb="md">
                    Edit Profile
                </Text>
                <form onSubmit={form.onSubmit(updateEmail)}>
                    <Flex align='end' justify="space-between" mt="sm">
                        <TextInput
                            label="Email"
                            placeholder={form.values.email}
                            value={form.values.email}
                            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                            error={form.errors.email && 'Invalid email'}
                            radius="md"
                            flex="1"
                            mr="xs"
                        />
                        <Button type="submit" radius="md">
                            Update
                            {loading && <Loader color="white" size={20} ml="xs" />}
                        </Button>
                    </Flex>
                </form>
                <form onSubmit={form.onSubmit(updateName)}>
                    <Flex align='end' justify="space-between" mt="sm">
                        <TextInput
                            label="Name"
                            placeholder={form.values.name}
                            value={form.values.name}
                            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                            error={form.errors.name && 'Invalid name'}
                            radius="md"
                            flex="1"
                            mr="xs" />
                        <Button type="submit" radius="md">
                            Update
                            {loading && <Loader color="white" size={20} ml="xs" />}
                        </Button>
                    </Flex>
                </form>
                <form onSubmit={form.onSubmit(updatePassword)}>
                    <Flex align='end' justify="space-between" mt="sm">
                        <PasswordInput
                            label="Password"
                            placeholder={form.values.password}
                            value={form.values.password}
                            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                            error={form.errors.password && 'Password should include at least 6 characters'}
                            radius="md"
                            flex="1"
                            mr="xs"
                        />
                        <Button type="submit" radius="md">
                            Update
                            {loading && <Loader color="white" size={20} ml="xs" />}
                        </Button>
                    </Flex>
                </form>
                <Group mt="xl">
                    <Button onClick={handleSingout} radius="xl" variant="outline" loading={loading}>
                        Logout
                        {loading && <Loader color="white" size={20} ml="xs" />}
                    </Button>
                </Group>
                {/* <form onSubmit={form.onSubmit(handleSubmit)}>
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
                        
                    </Group>
                </form> */}
            </Paper>
        </Container>
    )
}
