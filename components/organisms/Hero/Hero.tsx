import { Title, Button, Group, Text } from '@mantine/core';
import classes from './style.module.css';

export default function Hero() {
    return (
        <div className={classes.inner}>
            <div className={classes.content}>
                <Title className={classes.title}>
                    A <span className={classes.highlight}>modern</span> React <br /> components library
                </Title>
                <Text c="dimmed" mt="md">
                    Build fully functional accessible web applications faster than ever – Mantine includes
                    more than 120 customizable components and hooks to cover you in any situation
                </Text>
                <Group mt={30}>
                    <Button radius="xl" size="md" className={classes.control}>
                        Get started
                    </Button>
                    <Button variant="default" radius="xl" size="md" className={classes.control}>
                        Source code
                    </Button>
                </Group>
            </div>
            <div className={classes.image}></div>
        </div>
    )
}
