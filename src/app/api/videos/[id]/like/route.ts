import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const videoId = parseInt(id, 10);
    if (isNaN(videoId) || videoId <= 0) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    // check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId,
        },
      },
    });

    let liked = false;

    if (existingLike) {
      // 🔽 remove like
      await prisma.like.delete({ where: { id: existingLike.id } });
      await prisma.video.update({
        where: { id: videoId },
        data: { likes: { decrement: 1 } },
      });
    } else {
      // 🔼 add like
      await prisma.like.create({
        data: {
          userId: user.id,
          videoId,
        },
      });
      await prisma.video.update({
        where: { id: videoId },
        data: { likes: { increment: 1 } },
      });
      liked = true;
    }

    // always return updated state + count
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { likes: true },
    });

    return NextResponse.json(
      {
        message: liked ? "Like added" : "Like removed",
        liked,
        likeCount: video?.likes ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
