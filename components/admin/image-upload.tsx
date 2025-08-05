"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon, AlertCircle, CheckCircle, Info, Loader2, Settings } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

interface BlobStatus {
  configured: boolean
  tokenExists: boolean
  tokenLength: number
  tokenPrefix: string
  environment: string
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"error" | "warning" | "success">("error")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [blobStatus, setBlobStatus] = useState<BlobStatus | null>(null)
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Проверяем статус Blob при загрузке компонента
  useEffect(() => {
    checkBlobStatus()
  }, [])

  const checkBlobStatus = async () => {
    try {
      const response = await fetch("/api/blob-status")
      const status = await response.json()
      setBlobStatus(status)
    } catch (error) {
      console.error("Ошибка проверки статуса Blob:", error)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Проверяем тип файла
    if (!file.type.startsWith("image/")) {
      setMessage("Пожалуйста, выберите изображение (JPG, PNG, WebP)")
      setMessageType("error")
      return
    }

    // Проверяем размер файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage("Размер файла не должен превышать 10MB")
      setMessageType("error")
      return
    }

    setIsUploading(true)
    setMessage("Загружаем изображение...")
    setMessageType("success")
    setUploadProgress(0)

    try {
      // Создаем FormData для загрузки
      const formData = new FormData()
      formData.append("file", file)

      // Симулируем прогресс загрузки
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      // Загружаем файл через API route
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка загрузки файла")
      }

      onChange(data.url)

      // Показываем соответствующее сообщение
      if (data.isPlaceholder) {
        setMessage(data.message || "Используется placeholder изображение")
        setMessageType("warning")
      } else {
        const sizeInMB = (data.size / 1024 / 1024).toFixed(2)
        setMessage(`Изображение успешно загружено в Vercel Blob (${sizeInMB}MB)`)
        setMessageType("success")
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error)
      setMessage(error instanceof Error ? error.message : "Ошибка загрузки изображения")
      setMessageType("error")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemove = () => {
    onChange("")
    setMessage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUsePlaceholder = () => {
    const placeholderUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent("Блюдо")}`
    onChange(placeholderUrl)
    setMessage("Используется placeholder изображение")
    setMessageType("warning")
  }

  const getMessageIcon = () => {
    if (isUploading) return <Loader2 className="w-4 h-4 animate-spin" />

    switch (messageType) {
      case "error":
        return <AlertCircle className="w-4 h-4" />
      case "warning":
        return <Info className="w-4 h-4" />
      case "success":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getMessageColor = () => {
    switch (messageType) {
      case "error":
        return "text-red-600 bg-red-50 border-red-200"
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "success":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {value ? (
        <div className="relative group">
          <img
            src={value || "/placeholder.svg"}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg transition-all duration-300 group-hover:brightness-75"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Overlay с информацией */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="text-white text-center">
              <p className="text-sm font-medium">Нажмите X чтобы удалить</p>
              <p className="text-xs opacity-75">или загрузите новое изображение</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-300 transition-colors">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Загрузите изображение высокого качества</p>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="relative"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Загрузка {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Выбрать файл
                </>
              )}
            </Button>

            <Button type="button" variant="ghost" size="sm" onClick={handleUsePlaceholder} className="text-gray-500">
              Использовать placeholder
            </Button>
          </div>
        </div>
      )}

      {/* Прогресс бар */}
      {isUploading && uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {message && (
        <div className={`flex items-center gap-2 text-sm p-3 rounded-lg border ${getMessageColor()}`}>
          {getMessageIcon()}
          <span>{message}</span>
        </div>
      )}

      {/* Статус Vercel Blob */}
      <div className="space-y-2">
        {blobStatus && (
          <div
            className={`p-3 rounded-lg border ${
              blobStatus.configured
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {blobStatus.configured ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span className="font-medium">Vercel Blob: {blobStatus.configured ? "Настроен" : "Не настроен"}</span>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowDiagnostics(!showDiagnostics)}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            {showDiagnostics && (
              <div className="mt-2 text-xs space-y-1 font-mono bg-white/50 p-2 rounded">
                <div>Токен найден: {blobStatus.tokenExists ? "✅" : "❌"}</div>
                <div>Длина токена: {blobStatus.tokenLength}</div>
                <div>Префикс: {blobStatus.tokenPrefix}</div>
                <div>Окружение: {blobStatus.environment}</div>
              </div>
            )}
          </div>
        )}

        {!blobStatus?.configured && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="font-medium text-blue-800 mb-2">🔧 Как настроить Vercel Blob:</p>
            <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
              <li>Перейдите в Vercel Dashboard → Storage</li>
              <li>Создайте новый Blob Store</li>
              <li>Скопируйте Read-Write Token</li>
              <li>Добавьте переменную BLOB_READ_WRITE_TOKEN</li>
              <li>Перезапустите приложение</li>
            </ol>
            <Button type="button" variant="outline" size="sm" className="mt-2 bg-transparent" onClick={checkBlobStatus}>
              Проверить снова
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <div className="bg-gray-50 border border-gray-200 rounded p-2">
            <p className="font-medium mb-1">📸 Поддерживаемые форматы:</p>
            <p>JPG, PNG, WebP • Максимум 10MB • Автоматическая оптимизация</p>
          </div>
        </div>
      </div>
    </div>
  )
}
