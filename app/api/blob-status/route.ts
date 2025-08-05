import { NextResponse } from "next/server"

export async function GET() {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN

  return NextResponse.json({
    configured: !!blobToken,
    tokenExists: !!blobToken,
    tokenLength: blobToken ? blobToken.length : 0,
    tokenPrefix: blobToken ? blobToken.substring(0, 20) + "..." : "не найден",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}
