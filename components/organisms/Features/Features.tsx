import {
  Badge,
  Group,
  Title,
  Text,
  SimpleGrid,
  Container,
} from '@mantine/core';
import classes from './style.module.css';
import CardGradient from '@/components/atoms/CardGradient';

export default function Features() {
  // const features = mockdata.map((feature) => (
  //   <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
  //     <feature.icon
  //       style={{ width: rem(50), height: rem(50) }}
  //       stroke={2}
  //       color="lime"
  //     />
  //     <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
  //       {feature.title}
  //     </Text>
  //     <Text fz="sm" c="dimmed" mt="sm">
  //       {feature.description}
  //     </Text>
  //   </Card>
  // ));

  return (
    <Container size="lg" py="xl">
      <Group justify="center">
        <Badge variant="filled" size="lg">
          Best company ever
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Integrate effortlessly with any technology stack
      </Title>

      <Text c="dimmed" className={classes.description} style={{margin:'auto'}} ta="center" mt="md">
        Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when
        hunger drives it to try biting a Steel-type Pokémoddddddn.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        <CardGradient />
        <CardGradient />
        <CardGradient />
      </SimpleGrid>

    </Container>
  );
}