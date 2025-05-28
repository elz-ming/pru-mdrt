import { NextResponse } from "next/server";
import supabaseAdmin from "@/app/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      telegramId,
      encodedId,
      firstName,
      lastName,
      username,
      languageCode,
    } = body;

    if (!telegramId || !encodedId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upsert user into Supabase
    const { error } = await supabaseAdmin.from("users").upsert(
      {
        telegram_id: telegramId,
        encoded_id: encodedId,
        first_name: firstName,
        last_name: lastName,
        username,
        language_code: languageCode,
      },
      { onConflict: "telegram_id" }
    );

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User synced successfully" });
  } catch (err) {
    console.error("❌ API handler error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
