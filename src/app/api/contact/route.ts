import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { firstName, lastName, email, message } = body as {
      firstName: string;
      lastName: string;
      email: string;
      message: string;
    };

    await prisma.contact.create({
      data: { firstName, lastName, email, message },
    });

    return NextResponse.json({ message: "Contact saved successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error saving contact:", error);
    return NextResponse.json({ error: "Failed to save contact." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}
