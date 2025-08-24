import { NextResponse } from "next/server";
import { supabase } from "../client";

// GET all referendums
export async function GET() {
  const { data, error } = await supabase.from("referendums").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { question, link, owner, options, deadline } = body;

  const { data, error } = await supabase
    .from("referendums")
    .insert([{
      question,
      link,
      owner_wallet: owner,
      options,
      deadline
    }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}
