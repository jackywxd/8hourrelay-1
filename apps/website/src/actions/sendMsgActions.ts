"use server";
import { sendMail } from "@/lib/sendMail";
import { slackSendText } from "@/lib/slack";
import { createMessage, insertMessageSchema } from "@8hourrelay/database";
import Mail from "nodemailer/lib/mailer";

const EMAILS = ["8hourrelay@gmail.com", "jackywxd@gmail.com"];

export async function sendMessage({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const text = `New message from ${name}/${email} Message:${message}`;
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    const emailOptions: Mail.Options = {
      text: message,
      from: process.env.FROM_EMAIL,
      to: EMAILS,
      subject: `New message from ${name} ${email}`,
    };

    const [response] = await Promise.all([
      sendMail(emailOptions),
      slackSendText(text),
    ]);

    const validatedData = insertMessageSchema.parse({
      name,
      email,
      message,
      response,
    });
    await createMessage(validatedData);
  } catch (err) {
    console.log(`Failed to send message!!`, err);
  }
}
