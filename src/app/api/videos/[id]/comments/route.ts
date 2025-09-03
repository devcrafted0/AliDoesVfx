import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Add New Comments
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const videoId = parseInt(id, 10);

    if (isNaN(videoId) || videoId <= 0) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const body = await req.json();
    const { username, userId, comment, imageURL } = body;

    if (!username || !userId || !comment) {
      return NextResponse.json(
        { error: "username, userId and comment are required" },
        { status: 400 }
      );
    }

    // get existing comments
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { comments: true },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const existingComments = (video.comments as any[]) || [];

    const newComment = {
      username,
      userId,
      comment,
      createdAt: new Date().toISOString(),
      imageURL
    };

    const updatedComments = [...existingComments, newComment];

    // update db
    await prisma.video.update({
      where: { id: videoId },
      data: { comments: updatedComments },
    });

    return NextResponse.json(
      { message: "Comment added successfully", comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}