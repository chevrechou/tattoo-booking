'use client';

import { useState } from 'react';
import { Booking } from '../lib/types';
import { ActionIcon, Badge, Button, Center, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

type BookingDetailsPanelProps = {
  booking: Booking | null;
  onClear: () => void;
  reload: () => void;
};

const HARDCODED_TRANSACTION_ID = 'abc123';

export default function BookingDetailsPanel({
  booking,
  onClear,
  reload,
}: BookingDetailsPanelProps) {
  const [transactionId, setTransactionId] = useState('');

  if (!booking) {
    return (
      <div style={{ color: '#888', fontStyle: 'italic' }}>
        Click a booked slot to view its details
      </div>
    );
  }

  const handleConfirmDeposit = async () => {
    if (transactionId.trim() !== HARDCODED_TRANSACTION_ID) {
      notifications.show({
        title: 'Transaction ID Error',
        message: 'The Transaction ID does not match.',
        color: 'red',
      });
      return;
    }

    try {
      await axios.post('/api/booking', {
        confirm: true,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });

      notifications.show({
        title: 'Booking Confirmed',
        message: 'The booking has been confirmed successfully!',
        color: 'green',
      });

      reload();
      onClear();
    } catch (err) {
      console.error('Failed to confirm booking', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to confirm the booking. Please try again.',
        color: 'red',
      });
    }
  };

  const handleCancelAppointment = async () => {
    try {
      await axios.post('/api/booking', {
        cancel: true, // 🔥 Add this line
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
  
      notifications.show({
        title: 'Appointment Cancelled',
        message: 'The appointment has been cancelled and slot made available.',
        color: 'blue',
      });
  
      reload();
      onClear();
    } catch (err) {
      console.error('Failed to cancel appointment', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to cancel appointment. Please try again.',
        color: 'red',
      });
    }
  };
  
  return (
    <Paper shadow="sm" radius="md" p="lg" withBorder style={{ position: 'relative' }}>
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

      {booking.confirmed && (
        <Center mb="md">
          <Badge color="green" variant="filled" size="lg">
            ✅ Appointment Confirmed
          </Badge>
        </Center>
      )}

      <Stack gap="xs">
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
      </Stack>

      {!booking.confirmed && (
        <>
          <TextInput
            label="Transaction ID"
            placeholder="Enter transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.currentTarget.value)}
            mt="md"
          />

          <Button
            onClick={handleConfirmDeposit}
            color="green"
            fullWidth
            mt="md"
          >
            Confirm Deposit
          </Button>
        </>
      )}

      {/* 🔥 Updated Cancel Button */}
      <Button
        onClick={handleCancelAppointment}
        color="red" // 🔥 RED color
        variant="filled"
        fullWidth
        mt="md"
      >
        Cancel Appointment
      </Button>
    </Paper>
  );
}
