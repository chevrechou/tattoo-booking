'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Group, Button } from '@mantine/core';

export function Navbar() {
  const pathname = usePathname();

  return (
    <Container size="xl">
      <Group position="center" mb="xl" >
        <Link href="/" passHref>
          <Button
            variant={pathname === '/' ? 'filled' : 'light'}
            color="blue"
          >
            Booking Calendar
          </Button>
        </Link>
        <Link href="/portal" passHref>
          <Button
            variant={pathname === '/portal' ? 'filled' : 'light'}
            color="blue"
          >
            Artist Portal
          </Button>
        </Link>
      </Group>
    </Container>
  );
}
