import { promises as fs} from 'fs';
import path from 'path';
import { Availability, Booking } from './types';

const AVAILABILITY_PATH = path.join(process.cwd(), "src/app/data/availabilities.json");

const BOOKINGS_FILE = path.join(process.cwd(), 'src/app/data/bookings.json');

export async function saveBooking(newBooking: Booking): Promise<void> {
  const bookings = await getBookings();
  bookings.push(newBooking);

  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const data = await fs.readFile(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet — return empty array
    console.error('Error reading bookings file:', error);
    return [];
  }
}

export async function confirmBooking(date: string, startTime: string, endTime: string) {
  // Update Booking (booking.json)
  const bookingData = await fs.readFile(BOOKINGS_FILE, 'utf-8');
  const bookings: Booking[] = JSON.parse(bookingData);

  const updatedBookings = bookings.map((b) => {
    if (b.date === date && b.startTime === startTime && b.endTime === endTime) {
      return {
        ...b,
        confirmed: true,
      };
    }
    return b;
  });

  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(updatedBookings, null, 2));

  // Update Availability (availabilities.json)
  const availabilityData = await fs.readFile(AVAILABILITY_PATH, 'utf-8');
  const availabilities: Availability[] = JSON.parse(availabilityData);

  const updatedAvailabilities = availabilities.map((a) => {
    if (a.date === date && a.startTime === startTime && a.endTime === endTime) {
      return {
        ...a,
        confirmed: true,
      };
    }
    return a;
  });

  await fs.writeFile(AVAILABILITY_PATH, JSON.stringify(updatedAvailabilities, null, 2));
}



export async function cancelBooking(date: string, startTime: string, endTime: string): Promise<void> {
  // Cancel booking (remove from bookings.json)
  const bookingsData = await fs.readFile(BOOKINGS_FILE, 'utf-8');
  const bookings: Booking[] = JSON.parse(bookingsData);

  const updatedBookings = bookings.filter(
    (b) => !(b.date === date && b.startTime === startTime && b.endTime === endTime)
  );
  console.log(updatedBookings)

  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(updatedBookings, null, 2));

  // Reset availability (set available: true, confirmed: false)
  const availabilitiesData = await fs.readFile(AVAILABILITY_PATH, 'utf-8');
  const availabilities: Availability[] = JSON.parse(availabilitiesData);

  const updatedAvailabilities = availabilities.map((a) => {
    if (a.date === date && a.startTime === startTime && a.endTime === endTime) {
      return {
        ...a,
        available: true,
        confirmed: false,
      };
    }
    return a;
  });

  await fs.writeFile(AVAILABILITY_PATH, JSON.stringify(updatedAvailabilities, null, 2));
}
