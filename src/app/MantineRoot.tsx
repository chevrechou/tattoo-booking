'use client';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

export function MantineRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider defaultColorScheme="light">
        <Notifications position="top-center" />
        {children}
      </MantineProvider>
    </>
  );
}
