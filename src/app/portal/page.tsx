'use client';

import dynamic from 'next/dynamic';
import { Container, Title, Loader, Center } from '@mantine/core';

// Dynamic import with fallback UI
const ArtistAvailabilityCalendar = dynamic(
  () => import('../components/ArtistAvailabilityCalendar'),
  {
    ssr: false,
    loading: () => (
      <Center mt="xl">
        <Loader size="lg" />
      </Center>
    ),
  }
);

export default function ArtistPortalPage() {
  return (
    <Container size="xl" mt="xl" pb="xl">
      <Title align="center" mb="md">Artist Availability Portal</Title>
      <ArtistAvailabilityCalendar />
    </Container>
  );
}
