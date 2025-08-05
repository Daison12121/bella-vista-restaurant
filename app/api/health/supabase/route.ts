import { supabase } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Простая проверка подключения к Supabase
    const { data, error } = await supabase.from("categories").select("count", { count: "exact", head: true })

    if (error) {
      return NextResponse.json({ status: "error", error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      status: "connected",
      timestamp: new Date().toISOString(),
      tablesAccessible: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
