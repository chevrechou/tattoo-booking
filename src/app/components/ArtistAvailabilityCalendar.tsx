'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  SlotInfo,
} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import axios from 'axios';
import { useMediaQuery } from '@mantine/hooks';
import { Grid, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { Availability, Booking } from '../lib/types';
import { waitAtLeast } from '../utils/waitAtLeast';

import BookingDetailsPanel from './BookingDetailsPanel';
import DeleteSlotModal from './DeleteSlotModal';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type CalendarView = 'month' | 'week' | 'work_week' | 'day' | 'agenda';

export default function ArtistAvailabilityCalendar() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [selectedSlots, setSelectedSlots] = useState<SlotInfo[]>([]);
  const [existingAvailabilities, setExistingAvailabilities] = useState<Availability[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<null | { start: Date; end: Date }>(null);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>('week');

  // ADDED: make loadData reusable so we can reload after confirming
  const loadData = async () => {
    const [availabilityRes, bookingsRes] = await Promise.all([
      axios.get('/api/availability'),
      axios.get('/api/booking'),
    ]);
    setExistingAvailabilities(availabilityRes.data);
    setBookings(bookingsRes.data);
  };

  useEffect(() => {
    setCurrentView(isMobile ? 'day' : 'week');
  }, [isMobile]);

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectSlot = (slot: SlotInfo) => {
    setSelectedSlots((prev) => [...prev, slot]);
  };

  const handleSave = async () => {
    if (selectedSlots.length === 0) return;

    const payload = selectedSlots.map((s) => ({
      date: s.start.toISOString().split('T')[0],
      startTime: format(s.start, 'h:mm a'),
      endTime: format(s.end, 'h:mm a'),
      available: true,
    }));

    setIsSaving(true);

    try {
      await waitAtLeast(axios.post('/api/availability', payload));
      setSelectedSlots([]);

      await loadData(); // CHANGED: reload after saving
    } catch (err) {
      console.error('Failed to save availability', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSlot = async ({
    date,
    startTime,
    endTime,
  }: {
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    try {
      await axios.delete('/api/availability', {
        data: { date, startTime, endTime },
      });

      await loadData(); // CHANGED: reload after deleting

      notifications.show({
        title: 'Slot Deleted',
        message: `${startTime} – ${endTime} on ${date} removed`,
        color: 'green',
      });
    } catch (err) {
      console.error('Failed to delete slot', err);
      notifications.show({
        title: 'Delete Failed',
        message: 'Could not remove this availability. Please try again.',
        color: 'red',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const availabilityEvents = existingAvailabilities.map((a) => {
    const start = new Date(`${a.date} ${a.startTime}`);
    const end = new Date(`${a.date} ${a.endTime}`);

    let title = 'Available';

    if (!a.available) {
      const matchingBooking = bookings.find(
        (b) =>
          b.date === a.date &&
          b.startTime === a.startTime &&
          b.endTime === a.endTime
      );
      title = matchingBooking ? `Booked: ${matchingBooking.email}` : 'Booked';
    }

    return {
      title,
      start,
      end,
      source: 'saved',
      available: a.available,
      confirmed: a.confirmed || false, // ADDED: track confirmed
    };
  });

  const newEvents = selectedSlots.map((slot) => ({
    title: 'Unsaved',
    start: slot.start,
    end: slot.end,
    source: 'new',
    available: true,
    confirmed: false, // ADDED: consistent fields
  }));

  const handleSelectEvent = (event: any) => {
    if (event.source === 'saved') {
      if (!event.available) {
        const booking = bookings.find(
          (b) =>
            b.date === event.start.toISOString().split('T')[0] &&
            b.startTime === format(event.start, 'h:mm a') &&
            b.endTime === format(event.end, 'h:mm a')
        );
        if (booking) setViewBooking(booking);
      } else {
        setViewBooking(null);
        setDeleteTarget({ start: event.start, end: event.end });
      }
    }
  };

  return (
    <Grid gutter="lg" align="flex-start">
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Calendar
          localizer={localizer}
          defaultView={isMobile ? 'day' : 'week'}
          view={currentView}
          onView={(view) => setCurrentView(view)}
          views={{ day: true, week: true }}
          step={30}
          timeslots={1}
          defaultDate={new Date()}
          min={new Date(2025, 0, 1, 8, 0)}
          max={new Date(2025, 0, 1, 20, 0)}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          style={{ height: 600, width: '100%' }}
          selectable
          events={[...availabilityEvents, ...newEvents]}
          eventPropGetter={(event) => {
            console.log(event)
            if (event.source === 'new') {
              return { style: { backgroundColor: '#ccc', color: 'black' } };
            }
            if (event.confirmed) {
              return { style: { backgroundColor: '#40c057', color: 'white' } }; // CHANGED: green for confirmed
            }
            if (!event.available) {
              return { style: { backgroundColor: '#fa5252', color: 'white' } };
            }
            return { style: { backgroundColor: '#4dabf7', color: 'white' } };
          }}
        />

        <Button
          mt="md"
          fullWidth
          onClick={handleSave}
          disabled={isSaving}
          loading={isSaving}
          mb="xl"
        >
          Save Availability
        </Button>

        <DeleteSlotModal
          opened={!!deleteTarget}
          target={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteSlot}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <BookingDetailsPanel
          booking={viewBooking}
          onClear={() => setViewBooking(null)}
          reload={loadData} // ADDED: pass reload down
        />
      </Grid.Col>
    </Grid>
  );
}
