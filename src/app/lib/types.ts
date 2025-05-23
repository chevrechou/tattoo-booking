export type Booking = {
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  notes: string;
  confirmed?: boolean;
};

export type Availability = {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  confirmed?: boolean;
};

export interface BookingModalProps {
  opened: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onBook: (booking: Booking) => void;
  availabilities: Availability[];
}

export interface BookingCalendarProps {
  onSelectDay: (date: Date) => void;
}

export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  source: 'saved' | 'new';
  available: boolean;
  confirmed: boolean;
};
