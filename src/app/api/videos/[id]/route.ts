import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    return NextResponse.json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: {params : {id : string}}) {
  try {
    const userId = parseInt(params.id, 10);

    const deletedUser = await prisma.video.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User deleted successfully", user: deletedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete user", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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
  } catch (error: any) {
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