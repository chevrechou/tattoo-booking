import nodemailer from "nodemailer";
import { Booking } from "./types";

export async function sendEmail(booking: Booking): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465, // true for port 465 (SSL), false for 587 (TLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Tattoo Booking" <${process.env.EMAIL_USER}>`, // safer: use your SMTP identity
    to: process.env.ARTIST_EMAIL,
    subject: `New Tattoo Booking – ${booking.date} at ${booking.startTime} - ${booking.endTime}`,
    text: `
📅 Date: ${booking.date}
🕒 Time: ${booking.startTime} to ${booking.endTime}
👤 Name: ${booking.name}
📧 Email: ${booking.email}
📝 Notes: ${booking.notes || "None"}
    `,
    replyTo: booking.email, // allows direct reply to customer
  };

  await transporter.sendMail(mailOptions);
}
