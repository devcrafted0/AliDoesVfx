import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log('API route hit - starting video creation');
    
    // Parse request body
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { title, youtubeUrl, description, thumbnail, publishedAt } = body;

    // Validation
    if (!title || !youtubeUrl || !publishedAt) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json(
        { error: "title, youtubeUrl, and publishedAt are required" },
        { status: 400 }
      );
    }

    // Validate publishedAt format
    const publishedDate = new Date(publishedAt);
    if (isNaN(publishedDate.getTime())) {
      console.log('Invalid date format:', publishedAt);
      return NextResponse.json(
        { error: "publishedAt must be a valid date" },
        { status: 400 }
      );
    }

    console.log('Creating video with data:', {
      title,
      youtubeUrl,
      description: description || null,
      thumbnail: thumbnail || null,
      publishedAt: publishedDate
    });

    // Check if prisma is properly initialized
    if (!prisma) {
      console.error('Prisma client not initialized');
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    // Create video record
    const newVideo = await prisma.video.create({
      data: {
        title,
        youtubeUrl,
        description: description || null,
        thumbnail: thumbnail || null,
        publishedAt: publishedDate,
      },
    });

    console.log('Video created successfully:', newVideo.id);
    return NextResponse.json(newVideo, { status: 201 });

  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });

    // Handle Prisma-specific errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "A video with this data already exists (unique constraint violation)" },
        { status: 409 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Record not found or foreign key constraint failed" },
        { status: 404 }
      );
    }

    // Database connection errors
    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: "Cannot connect to database" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to create video", 
        details: error.message,
        code: error.code || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
}