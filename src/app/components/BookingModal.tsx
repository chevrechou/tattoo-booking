'use client';

import {
  Modal,
  Select,
  TextInput,
  Textarea,
  Button,
  Stack,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Booking, BookingModalProps, Availability } from '../lib/types';

export function BookingModal({
  opened,
  onClose,
  selectedDate,
  onBook,
  availabilities,
}: BookingModalProps & { availabilities: Availability[] }) {
  const [slot, setSlot] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const isoDate = selectedDate?.toISOString().split('T')[0];

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const slotOptions = useMemo(() => {
    if (!isoDate) return [];

    const slotsForDate = availabilities.filter((a) => a.date === isoDate);

    return slotsForDate.map((slot) => ({
      value: `${slot.startTime}-${slot.endTime}`,
      label: slot.available
        ? `${slot.startTime} – ${slot.endTime}`
        : `${slot.startTime} – ${slot.endTime} (Booked)`,
      disabled: !slot.available,
    }));
  }, [availabilities, selectedDate]);

  const handleSubmit = () => {
    if (!selectedDate || !slot || !name || !email) return;

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError(null); // Clear error

    const [startTime, endTime] = slot.split('-');

    const booking: Booking = {
      date: isoDate!,
      startTime,
      endTime,
      name,
      email,
      notes,
    };

    onBook(booking);

    // Reset
    setSlot('');
    setName('');
    setEmail('');
    setNotes('');
  };

  const isFormInvalid =
    !slot || !name || !email || !!emailError || !isValidEmail(email);

  return (
    <Modal opened={opened} onClose={onClose} title="Book a Tattoo Session" centered>
      <Stack>
        <Select
          label="Time Slot"
          placeholder="Pick a time"
          data={slotOptions}
          value={slot}
          onChange={(value) => setSlot(value || '')}
          required
        />
        <TextInput
          label="Your Name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Your Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
            if (emailError && isValidEmail(e.currentTarget.value)) {
              setEmailError(null);
            }
          }}
          onBlur={() => {
            if (!isValidEmail(email)) {
              setEmailError('Please enter a valid email address');
            } else {
              setEmailError(null);
            }
          }}
          error={emailError}
          required
          rightSection={
            isValidEmail(email) && !emailError ? (
              <IconCheck size={18} color="green" />
            ) : null
          }
          styles={{
            input: {
              borderColor: email && !isValidEmail(email) ? '#fa5252' : undefined,
            },
          }}
        />
        <Textarea
          label="Notes (Optional)"
          placeholder="Describe your tattoo idea..."
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
        />
        <Button onClick={handleSubmit} disabled={isFormInvalid}>
          Submit Booking
        </Button>
      </Stack>
    </Modal>
  );
}
