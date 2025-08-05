import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 })
    }

    // Проверяем тип файла
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Файл должен быть изображением" }, { status: 400 })
    }

    // Проверяем размер файла (10MB для лучшего качества)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Размер файла не должен превышать 10MB" }, { status: 400 })
    }

    // Проверяем наличие токена Blob
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN

    if (!blobToken) {
      console.warn("BLOB_READ_WRITE_TOKEN не настроен, используется placeholder")

      // Если токен не настроен, возвращаем placeholder URL
      const fileName = file.name.split(".")[0] || "image"
      const placeholderUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(fileName)}`

      return NextResponse.json({
        url: placeholderUrl,
        isPlaceholder: true,
        message: "Vercel Blob не настроен. Используется placeholder изображение.",
      })
    }

    try {
      // Генерируем уникальное имя файла с временной меткой
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 8)
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const filename = `restaurant/${timestamp}-${randomId}.${extension}`

      console.log(`Загружаем файл: ${filename}, размер: ${(file.size / 1024 / 1024).toFixed(2)}MB`)

      // Загружаем в Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
        token: blobToken,
        // Добавляем метаданные
        addRandomSuffix: false, // мы уже добавили случайный суффикс
      })

      console.log(`Файл успешно загружен: ${blob.url}`)

      return NextResponse.json({
        url: blob.url,
        isPlaceholder: false,
        message: "Изображение успешно загружено в Vercel Blob",
        size: file.size,
        filename: filename,
      })
    } catch (blobError) {
      console.error("Ошибка Vercel Blob:", blobError)

      // Fallback на placeholder если Blob не работает
      const fileName = file.name.split(".")[0] || "image"
      const placeholderUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(fileName)}`

      return NextResponse.json({
        url: placeholderUrl,
        isPlaceholder: true,
        message: `Ошибка загрузки в Vercel Blob: ${blobError instanceof Error ? blobError.message : "Неизвестная ошибка"}`,
      })
    }
  } catch (error) {
    console.error("Общая ошибка загрузки файла:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Неизвестная ошибка загрузки файла",
      },
      { status: 500 },
    )
  }
}
