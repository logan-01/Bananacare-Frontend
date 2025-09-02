import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    console.log("Request", data);

    // Validate required fields
    const { address, percentage, result, resultArr, imgUrl } = data;
    if (!address || !percentage || !result || !resultArr || !imgUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const saved = await prisma.scanResult.create({
      data: {
        address,
        percentage,
        result,
        resultArr,
        imgUrl,
      },
    });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error); // Log full error object
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
