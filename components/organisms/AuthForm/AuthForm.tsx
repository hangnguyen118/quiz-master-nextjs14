"use client"
import { upperFirst, useDisclosure, useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { db } from "../../../lib/firebase/firebase";
import { doc, setDoc, serverTimestamp, getDoc} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
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
    Alert,
} from '@mantine/core';
import { IconBrandFacebook, IconBrandGoogleFilled, IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';

type ActionType = 'register' | 'login' | 'forgotPassword';

interface FormValues {
    email: string;
    password: string;
    formAction: ActionType;
}

export default function AuthForm(props: PaperProps) {
    const auth = getAuth();
    const router = useRouter();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailSentNotificationVisible, { toggle: toggleNotification }] = useDisclosure(false);
    const [type, toggle] = useToggle<ActionType>(['login', 'register', 'forgotPassword']);
    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            terms: false,
            formAction: type
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            name: (val) => type === 'register' && (val.trim().length > 0 ? null : 'Invalid password'),
            password: (val) => (type === 'register' || type === 'login') && (val.length > 6 ? null : 'Password should include at least 6 characters'),
            terms: (val) => type === 'register' && (val ? null : 'You need to accept terms and conditions'),
        },
    });
    const actions: Record<ActionType, (values: FormValues) => Promise<void> | void> = {
        async register(values: FormValues) {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            const formDataCopy = {
                "email": form.values.email,
                "name": form.values.name,
                "timestamp": serverTimestamp()
            }
            await setDoc(doc(db, "users", user.uid), formDataCopy);
            router.push('/profile');
        },
        async login(values: FormValues) {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            console.log("Đăng nhập thành công!\n" + user);
            router.push('/profile');
        },
        async forgotPassword(values: FormValues) {
            await sendPasswordResetEmail(auth, values.email)
            toggleNotification();
        }
    }
    const handleSubmit = async (values: FormValues) => {
        try {
            setLoading(true);
            await actions[type]?.(values);
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
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            router.push('/profile');
        } catch {
            setError(true);
        }
    }
    return (
        <Paper radius="md" p="xl" withBorder {...props}>
            <Text size="lg" fw={500}>
                {type === 'register' ?
                    'Register' :
                    type === 'login' ?
                        'Welcome back to Quizz! login' :
                        'Forgot Your Password'} with
            </Text>
            {
                (type === 'login' || type === 'register') && (
                    <>
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
                    </>
                )
            }
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
                    {(type === 'register' || type === 'login') &&
                        (
                            <PasswordInput
                                required
                                label="Password"
                                placeholder="Your password"
                                value={form.values.password}
                                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                                error={form.errors.password && 'Password should include at least 6 characters'}
                                radius="md"
                            />
                        )}
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
                            ? 'Forgot password?'
                            : type === 'login'
                                ? "Register or forgot password?"
                                : "Go back to Login?"}
                    </Anchor>
                    <Button type="submit" radius="xl">
                        {upperFirst(type)}
                        {loading && <Loader color="white" size={20} ml="xs" />}
                    </Button>
                </Group>
            </form>
            {
                emailSentNotificationVisible &&
                <Alert variant="light" color="blue" mt='md' title="Email sent" icon={<IconInfoCircle />}>
                    Please check your email.
                    <Anchor href="https://mail.google.com/" target="_blank" ml="5">
                        Go to Gmail
                    </Anchor>
                </Alert>
            }
            {
                error &&
                <Notification title={type.charAt(0).toUpperCase() + type.slice(1) + " không thành công!"} mt="xs" icon={<IconInfoCircle color='red' size={20} />} color='white' withCloseButton={false}>
                    Đã xảy ra lỗi trong quá trình {type}. Vui lòng kiểm tra thông tin và thử lại.
                </Notification>
            }
        </Paper>
    );
}