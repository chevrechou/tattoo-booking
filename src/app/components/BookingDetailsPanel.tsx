'use client';

import { Booking } from '../lib/types';
import { ActionIcon, Paper, Text, Title } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

type BookingDetailsPanelProps = {
  booking: Booking | null;
  onClear: () => void;
};

export default function BookingDetailsPanel({
  booking,
  onClear,
}: BookingDetailsPanelProps) {
  if (!booking) {
    return (
      <div style={{ color: '#888', fontStyle: 'italic' }}>
        Click a booked slot to view its details
      </div>
    );
  }

  return (
    <Paper
      shadow="sm"
      radius="md"
      p="lg"
      withBorder
      style={{ position: 'relative' }}
    >
      <ActionIcon
        color="red"
        variant="light"
        size="sm"
        onClick={onClear}
        style={{ position: 'absolute', top: 12, right: 12 }}
        aria-label="Clear"
      >
        <IconX size={16} />
      </ActionIcon>

      <Title order={4} mb="md">
        Booking Details
      </Title>

      <Text>
        <strong>Name:</strong> {booking.name}
      </Text>
      <Text>
        <strong>Email:</strong> {booking.email}
      </Text>
      <Text>
        <strong>Date:</strong> {booking.date}
      </Text>
      <Text>
        <strong>Time:</strong> {booking.startTime} – {booking.endTime}
      </Text>
      {booking.notes && (
        <Text>
          <strong>Notes:</strong> {booking.notes}
        </Text>
      )}
    </Paper>
  );
}
