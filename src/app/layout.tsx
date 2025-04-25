'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, MantineProvider, Container } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Navbar } from './components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="light">
          <Notifications />
          <Container fluid mt="md">
            <Navbar />
            {children}
          </Container>
        </MantineProvider>
      </body>
    </html>
  );
}
