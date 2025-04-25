import { promises as fs } from "fs";
import path from "path";
import { Availability } from "./types";

const FILE_PATH = path.join(process.cwd(), "src/app/data/availabilities.json");

export async function getAvailabilities(): Promise<Availability[]> {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function updateAvailability(
  date: string,
  startTime: string,
  endTime: string
): Promise<void> {
  const availabilities = await getAvailabilities();

  const updated = availabilities.map((a) =>
    a.date === date && a.startTime === startTime && a.endTime === endTime
      ? { ...a, available: false }
      : a
  );

  await fs.writeFile(FILE_PATH, JSON.stringify(updated, null, 2));
}

export async function addAvailabilities(
  newSlots: Availability[]
): Promise<void> {
  const current = await getAvailabilities();

  const merged = [...current, ...newSlots].filter(
    (v, i, a) =>
      a.findIndex(
        (t) =>
          t.date === v.date &&
          t.startTime === v.startTime &&
          t.endTime === v.endTime
      ) === i
  );

  await fs.writeFile(FILE_PATH, JSON.stringify(merged, null, 2));
}

export async function deleteAvailability(
  date: string,
  startTime: string,
  endTime: string
): Promise<void> {
  const availabilities = await getAvailabilities();

  const filtered = availabilities.filter(
    (a) =>
      !(a.date === date && a.startTime === startTime && a.endTime === endTime)
  );

  await fs.writeFile(FILE_PATH, JSON.stringify(filtered, null, 2));
}
