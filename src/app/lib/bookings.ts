import { promises as fs } from 'fs';
import path from 'path';
import { Booking } from './types';

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
