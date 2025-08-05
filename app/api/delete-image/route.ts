import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get("url")

    if (!imageUrl) {
      return NextResponse.json({ error: "URL изображения не указан" }, { status: 400 })
    }

    // Проверяем, что это URL от Vercel Blob
    if (!imageUrl.includes("blob.vercel-storage.com")) {
      return NextResponse.json({ message: "Изображение не из Vercel Blob, удаление не требуется" })
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN

    if (!blobToken) {
      return NextResponse.json({ error: "Токен Blob не настроен" }, { status: 500 })
    }

    try {
      await del(imageUrl, { token: blobToken })
      console.log(`Изображение удалено из Blob: ${imageUrl}`)

      return NextResponse.json({ message: "Изображение успешно удалено" })
    } catch (blobError) {
      console.error("Ошибка удаления из Blob:", blobError)
      return NextResponse.json({ error: "Ошибка удаления изображения" }, { status: 500 })
    }
  } catch (error) {
    console.error("Общая ошибка удаления:", error)
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 })
  }
}
