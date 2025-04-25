'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box } from '@mantine/core';
import { useEffect, useState } from 'react';
import { BookingCalendarProps } from '../lib/types';
import { Availability } from '../lib/types';

export default function BookingCalendar({ onSelectDay }: BookingCalendarProps) {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  useEffect(() => {
    fetch('/api/availability')
      .then((res) => res.json())
      .then(setAvailabilities);
  }, []);

  const isDateUnavailable = (date: Date) => {
    const isoDate = date.toISOString().split('T')[0];
    const slots = availabilities.filter((a) => a.date === isoDate);

    // If there are no entries for that day, disable it
    if (slots.length === 0) return true;

    // If all slots are booked, disable it
    const allBooked = slots.every((s) => !s.available);
    return allBooked;
  };

  return (
    <Box maw={400} mx="auto">
      <Calendar
        onClickDay={onSelectDay}
        tileDisabled={({ date }) => isDateUnavailable(date)}
        minDetail="month"
      />
    </Box>
  );
}
