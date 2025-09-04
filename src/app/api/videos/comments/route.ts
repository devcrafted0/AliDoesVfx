import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      select: { id: true, comments: true },
    });

    // Flatten all comments into one array
    const allComments = videos.flatMap(video =>
      Array.isArray(video.comments) ? video.comments : []
    );

    return NextResponse.json({ comments: allComments });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
