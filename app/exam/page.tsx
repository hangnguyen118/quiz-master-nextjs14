"use client"
import { useCounter } from '@mantine/hooks';
import { Button, Container, Group, Radio, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export default function Page() {
    const initialTime = 1 * 60;
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [count, handlers] = useCounter(0, { min: 0, max: 100 });
    useEffect(() => {
        if (timeLeft === 0) return; // Nếu hết giờ thì dừng lại
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer); // Cleanup khi component unmount
    }, [timeLeft]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    return (
        <Container size="lg">
            <div style={{ textAlign: 'center' }}>
                <h1>Thời gian làm bài:</h1>
                <div style={{ fontSize: '2rem', margin: '20px 0' }}>{formatTime(timeLeft)}</div>
                {timeLeft === 0 && <h2>Hết giờ!</h2>}
                <Text>Bài làm: {count}/100</Text>
                
            </div>
            <Radio.Group 
                name="favoriteFramework"
                label="Câu 1: Chọn câu trả lời đúng"
            >
                <Group mt="xs">
                    <Radio value="1" label="React" />
                    <Radio value="2" label="Svelte" />
                    <Radio value="3" label="Angular" />
                    <Radio value="4" label="Vue" />
                </Group>
                <Button onClick={handlers.increment} mt="sm">Lưu</Button>
            </Radio.Group>
        </Container>
    )
}
