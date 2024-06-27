import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { ApiError, revalidatePaths, setMeta } from "@/lib/utils";
import { authenticate } from "@/queries/server/auth";
import { getUserAPI } from "@/queries/server/users";
import { getAllRaces } from "@8hourrelay/database";

export async function GET(request: NextRequest) {
  const { authenticated } = await authenticate();
  if (!authenticated) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 },
    );
  }

  const data = await getAllRaces();

  const output = data ? setMeta(data) : data;

  return NextResponse.json({ data: output, error: null });
}
