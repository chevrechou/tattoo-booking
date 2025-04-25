'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Availability, Booking } from './lib/types';
import BookingCalendar from './components/BookingCalendar';
import { BookingModal } from './components/BookingModal';
import { Container, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';


export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  const fetchAvailabilities = async () => {
    try {
      const res = await axios.get('/api/availability');
      setAvailabilities(res.data);
    } catch (err) {
      console.error('Failed to fetch availabilities', err);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleBook = async (booking: Booking) => {
    try {
      // 1. Save booking
      await axios.post('/api/booking', booking);
  
      // 2. Mark availability as booked
      await axios.patch('/api/availability', {
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
  
      // 3. Notify user
      notifications.show({
        title: 'Booking Confirmed',
        message: 'Your appointment is locked in!',
        color: 'green',
      });
  
      setModalOpen(false);
      await fetchAvailabilities(); // Refresh availability view
    } catch (error) {
      console.error('Booking error:', error);
      notifications.show({
        title: 'Booking Failed',
        message: 'Something went wrong. Please try again.',
        color: 'red',
      });
    }
  };
  

  return (
    <Container mt="xl">
      <Title align="center" mb="md">Tattoo Booking Calendar</Title>
      <BookingCalendar onSelectDay={handleSelectDay} />
      <BookingModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        onBook={handleBook}
        availabilities={availabilities}
      />
    </Container>
  );
}
