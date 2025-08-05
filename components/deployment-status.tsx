"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, ExternalLink, Database, ImageIcon, Settings } from "lucide-react"

interface DeploymentStatusProps {
  showInAdmin?: boolean
}

export function DeploymentStatus({ showInAdmin = false }: DeploymentStatusProps) {
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "connected" | "error">("checking")
  const [blobStatus, setBlobStatus] = useState<"checking" | "configured" | "not-configured">("checking")

  useEffect(() => {
    checkSupabaseConnection()
    checkBlobConfiguration()
  }, [])

  const checkSupabaseConnection = async () => {
    try {
      const response = await fetch("/api/health/supabase")
      if (response.ok) {
        setSupabaseStatus("connected")
      } else {
        setSupabaseStatus("error")
      }
    } catch {
      setSupabaseStatus("error")
    }
  }

  const checkBlobConfiguration = async () => {
    try {
      const response = await fetch("/api/blob-status")
      const data = await response.json()
      setBlobStatus(data.configured ? "configured" : "not-configured")
    } catch {
      setBlobStatus("not-configured")
    }
  }

  if (!showInAdmin) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Статус развертывания
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supabase Status */}
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <Database className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="font-medium">База данных (Supabase)</p>
              <div className="flex items-center gap-2 mt-1">
                {supabaseStatus === "connected" ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Подключена</span>
                  </>
                ) : supabaseStatus === "error" ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">Ошибка подключения</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Проверка...</span>
                )}
              </div>
            </div>
          </div>

          {/* Blob Status */}
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <ImageIcon className="w-5 h-5 text-purple-500" />
            <div className="flex-1">
              <p className="font-medium">Хранилище изображений</p>
              <div className="flex items-center gap-2 mt-1">
                {blobStatus === "configured" ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Vercel Blob настроен</span>
                  </>
                ) : blobStatus === "not-configured" ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-amber-600">Используются placeholder</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Проверка...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {(supabaseStatus === "error" || blobStatus === "not-configured") && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-medium text-blue-800 mb-2">📋 Инструкции по настройке:</p>
            <div className="space-y-2 text-sm text-blue-700">
              {supabaseStatus === "error" && <p>• Проверьте переменные окружения Supabase в настройках проекта</p>}
              {blobStatus === "not-configured" && (
                <p>• Создайте Blob Store в Vercel Dashboard и добавьте BLOB_READ_WRITE_TOKEN</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 bg-transparent"
              onClick={() => window.open("https://vercel.com/dashboard", "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Открыть Vercel Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
