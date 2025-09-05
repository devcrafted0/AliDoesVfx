import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// Getting A Specific Video
export async function GET( req, { params }) {
  try {
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    // 👇 New logic: check if user liked this video
    const user = await currentUser();
    let initialLiked = false;

    if (user) {
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_videoId: {
            userId: user.id,
            videoId: id,
          },
        },
      });
      initialLiked = !!existingLike;
    }

    // ✅ Merge the new field without breaking existing shape
    return NextResponse.json({
      ...video,
      initialLiked,
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
//Deleting a specific Video
export async function DELETE(req,  { params }) {
  try {
    const videoId = parseInt(params.id, 10);

    // Delete dependent records first
    await prisma.view.deleteMany({ where: { videoId } });
    await prisma.like.deleteMany({ where: { videoId } });

    // Now delete the video
    const deletedVideo = await prisma.video.delete({
      where: { id: videoId },
    });

    return NextResponse.json(
      { message: "Video deleted successfully", video: deletedVideo },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete video", details: error.message },
      { status: 500 }
    );
  }
}
// Updating a Specific Video
export async function PATCH(req, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    
    const { title, youtubeUrl, description, thumbnail, publishedAt, createdAt } = body;

    // Validation
    if (!title || !youtubeUrl || !publishedAt) {
      return NextResponse.json(
        { error: "title, youtubeUrl, and publishedAt are required" },
        { status: 400 }
      );
    }

    // Complete replacement - all fields must be provided
    const updatedVideo = await prisma.video.update({
      where: { id },
      data: {
        title,
        youtubeUrl,
        description: description || null,
        thumbnail: thumbnail || null,
        publishedAt: new Date(publishedAt),
        createdAt
      },
    });

    return NextResponse.json(updatedVideo, { status: 200 });
  } catch (error) {
    console.error('PUT Error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to replace video", details: error.message },
      { status: 500 }
    );
  }
}
// Adding A View To The Specific Video
export async function POST( req, context) {
  try {
    const { id } = await context.params;
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const videoId = parseInt(id, 10);
    if (isNaN(videoId) || videoId <= 0) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { id: true },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const existingView = await prisma.view.findFirst({
      where: {
        userId: user.id,
        videoId,
      },
    });

    if (existingView) {
      return NextResponse.json(
        { message: "User already viewed this video", newView: false },
        { status: 200 }
      );
    }

    await prisma.view.create({
      data: {
        userId: user.id,
        videoId,
      },
    });

    await prisma.video.update({
      where: { id: videoId },
      data: {
        views: { increment: 1 },
      },
    });

    return NextResponse.json(
      { message: "View recorded successfully", newView: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error tracking video view:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}