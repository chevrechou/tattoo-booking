import { NextResponse } from 'next/server';
import { saveBooking, getBookings } from '@/app/lib/bookings';
import { sendEmail } from '@/app/lib/email';
import { Booking } from '@/app/lib/types';

export async function POST(req: Request) {
  try {
    const body: Booking = await req.json();

    if (!body.name || !body.email || !body.date || !body.startTime || !body.endTime) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    console.log('Booking request body:', body);
    await saveBooking(body);
    await sendEmail(body);

    return NextResponse.json({ message: 'Booking confirmed' });
  } catch (error) {
    console.error('Error handling booking:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const bookings = await getBookings();
  return NextResponse.json(bookings);
}
