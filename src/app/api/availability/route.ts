import { NextResponse } from "next/server";
import {
  addAvailabilities,
  deleteAvailability,
  getAvailabilities,
  updateAvailability,
} from "@/app/lib/availability";

export async function GET() {
  const data = await getAvailabilities();
  return NextResponse.json(data);
}

export async function PATCH(req: Request) {
  const { date, startTime, endTime } = await req.json();

  if (!date || !startTime || !endTime) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await updateAvailability(date, startTime, endTime);
  return NextResponse.json({ message: "Slot marked as booked" });
}

export async function POST(req: Request) {
  // const isArtist =
  //   req.headers.get("authorization") === `Bearer ${process.env.ARTIST_SECRET}`;

  // if (!isArtist) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  const newSlots = await req.json();

  if (!Array.isArray(newSlots)) {
    return NextResponse.json(
      { error: "Expected an array of slots" },
      { status: 400 }
    );
  }

  await addAvailabilities(newSlots);
  return NextResponse.json({ message: "Availability saved" });
}

export async function DELETE(req: Request) {
  // const isArtist =
  //   req.headers.get("authorization") === `Bearer ${process.env.ARTIST_SECRET}`;

  // if (!isArtist) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  const { date, startTime, endTime } = await req.json();

  if (!date || !startTime || !endTime) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await deleteAvailability(date, startTime, endTime);
  return NextResponse.json({ message: "Availability deleted" });
}
