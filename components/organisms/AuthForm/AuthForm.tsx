"use client"
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db } from "../../../lib/firebase/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'
import {
    TextInput,
    PasswordInput,
    Text,
    Paper,
    Group,
    PaperProps,
    Button,
    Divider,
    Checkbox,
    Anchor,
    Stack,
    ActionIcon,
    Notification,
    Loader,
} from '@mantine/core';
import { IconBrandFacebook, IconBrandGoogleFilled, IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';

interface FormValues {
    email: string;
    password: string;
}

export default function AuthForm(props: PaperProps) {
    const router = useRouter();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [type, toggle] = useToggle(['login', 'register']);
    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            terms: false,
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            name: (val) => (val.trim().length > 0 ? null : 'Invalid name'),
            password: (val) => (val.length > 6 ? null : 'Password should include at least 6 characters'),
            terms: (val) => val ? null : 'You need to accept terms and conditions',
        },
    });
    const handleSubmit = async (values: FormValues) => {
        try {
            setLoading(true);
            if(type=='register'){
                const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
                const user = userCredential.user;
                const formDataCopy = {
                    "email": form.values.email,
                    "name": form.values.name,
                    "timestamp": serverTimestamp()
                }
                await setDoc(doc(db, "users", user.uid), formDataCopy);
            }
            else {
                console.log("login");
                const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
                const user = userCredential.user;
                console.log("Đăng nhập thành công!\n"+user);
            }
            router.push('/');
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    const changeForm = () => {
        toggle();
        setError(false);
    }
    const onGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const credential = await signInWithPopup(auth, provider);
            const user = credential.user;
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if(!docSnap.exists()){
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            router.push('/');
        } catch {
            setError(true);
        }
    }
    return (
        <Paper radius="md" p="xl" withBorder {...props}>
            <Text size="lg" fw={500}>
                Welcome to Mantine, {type} with
            </Text>
            <Group grow mb="md" mt="md">
                <ActionIcon
                    variant="gradient"
                    size="xl"
                    aria-label="Gradient action icon"
                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                >
                    <IconBrandFacebook />
                </ActionIcon>
                <ActionIcon
                    variant="gradient"
                    size="xl"
                    aria-label="Gradient action icon"
                    gradient={{ from: 'grape', to: 'indigo', deg: 203 }}
                    onClick={onGoogleClick}
                >
                    <IconBrandGoogleFilled />
                </ActionIcon>
            </Group>

            <Divider label="Or continue with email" labelPosition="center" my="lg" />

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    {type === 'register' && (
                        <TextInput
                            label="Name"
                            placeholder="Your name"
                            value={form.values.name}
                            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                            error={form.errors.name && 'Invalid name'}
                            radius="md"
                        />
                    )}

                    <TextInput
                        required
                        label="Email"
                        placeholder="hello@mantine.dev"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Invalid email'}
                        radius="md"
                    />

                    <PasswordInput
                        required
                        label="Password"
                        placeholder="Your password"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        error={form.errors.password && 'Password should include at least 6 characters'}
                        radius="md"
                    />

                    {type === 'register' && (
                        <Checkbox
                            label="I accept terms and conditions"
                            checked={form.values.terms}
                            onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                            error={form.errors.terms && 'You need to accept terms and conditions'}
                        />
                    )}
                </Stack>

                <Group justify="space-between" mt="xl">
                    <Anchor component="button" type="button" c="dimmed" onClick={changeForm} size="xs">
                        {type === 'register'
                            ? 'Already have an account? Login'
                            : "Don't have an account? Register"}
                    </Anchor>
                    <Button type="submit" radius="xl">
                        {upperFirst(type)}
                        {loading && <Loader color="white" size={20} ml="xs"/>}
                    </Button>
                </Group>
            </form>
            {
                error &&
                <Notification title={type.charAt(0).toUpperCase() + type.slice(1)+" không thành công!"} mt="xs" icon={<IconInfoCircle color='red' size={20} />} color='white' withCloseButton={false}>
                    Đã xảy ra lỗi trong quá trình {type}. Vui lòng kiểm tra thông tin và thử lại.
                </Notification>
            }

        </Paper>
    );
}