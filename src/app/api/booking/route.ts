import { NextResponse } from 'next/server';
import { saveBooking, getBookings, confirmBooking, cancelBooking } from '@/app/lib/bookings';
import { sendEmail } from '@/app/lib/email';
import { Booking } from '@/app/lib/types';

/**
 * Handle new booking creation
 */
async function handleCreateBooking(body: Booking) {
  if (!body.name || !body.email || !body.date || !body.startTime || !body.endTime) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  console.log('Booking request body:', body);

  await saveBooking(body);
  await sendEmail(body);

  return NextResponse.json({ message: 'Booking created successfully' });
}

/**
 * Handle confirming an existing booking
 */
async function handleConfirmBooking(body: Booking) {
  const { date, startTime, endTime } = body;

  if (!date || !startTime || !endTime) {
    return NextResponse.json({ message: 'Missing fields for confirmation' }, { status: 400 });
  }

  await confirmBooking(date, startTime, endTime);

  return NextResponse.json({ message: 'Booking confirmed successfully' });
}

/**
 * Handle cancelling an existing booking
 */
async function handleCancelBooking(body: Booking) {
  const { date, startTime, endTime } = body;

  if (!date || !startTime || !endTime) {
    return NextResponse.json({ message: 'Missing fields for cancellation' }, { status: 400 });
  }

  await cancelBooking(date, startTime, endTime);

  return NextResponse.json({ message: 'Booking cancelled and slot made available' });
}

/**
 * POST Handler
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.confirm) {
      return handleConfirmBooking(body);
    } else if (body.cancel) {
      console.log('adf')
      return handleCancelBooking(body);
    } else {
      return handleCreateBooking(body);
    }
  } catch (error) {
    console.error('Error handling booking:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET Handler
 */
export async function GET() {
  const bookings = await getBookings();
  return NextResponse.json(bookings);
}
