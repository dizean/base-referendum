import { NextResponse } from "next/server";
import { supabase } from "../client";

export async function POST(req: Request) {
  const { id } = await req.json();

  // First check if user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 = no rows found, which is fine
    return NextResponse.json({ error: fetchError.message }, { status: 400 });
  }

  if (existingUser) {
    // Already exists, return existing user
    return NextResponse.json({ data: existingUser });
  }

  // Otherwise insert new user
  const { data, error } = await supabase
    .from("users")
    .insert([{ wallet_address: id }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function GET() {
  const { data, error } = await supabase.from("users").select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
