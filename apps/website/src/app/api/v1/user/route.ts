import dayjs from "dayjs";
import { NextRequest, NextResponse, type } from "next/server";

import { ApiError, revalidatePaths, setMeta } from "@/lib/utils";
import { authenticate, authorize, getAuth } from "@/queries/server/auth";
import { getUserAPI } from "@/queries/server/users";
import { createAdminClient, createClient } from "@/supabase/server";
import { getUser } from "@8hourrelay/database";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") as string;
  const username = searchParams.get("username") as string;

  let match = {};

  if (id) match = { ...match, id };
  if (username) match = { ...match, username };

  const user = await getUser(id);

  if (!user) {
    return NextResponse.json(
      { data: null, error: "User not found" },
      { status: 400 },
    );
  }

  const output = user ? setMeta(user) : user;

  return NextResponse.json({ data: output, error: null });
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") as string;

  const { data, options } = await request.json();
  const { authorized } = await authorize(id);
  const { user } = await getUserAPI(id);

  if (!authorized || !user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 },
    );
  }

  if (data?.username && user?.username_changed_at) {
    const now = dayjs();
    const startDate = dayjs(user?.username_changed_at);
    const endDate = startDate.add(1, "month");
    if (now < endDate) {
      const diff = endDate.diff(now, "days");
      const error = `You can change it after ${diff} days.`;
      return NextResponse.json(
        { data: null, error: new ApiError(403, error) },
        { status: 403 },
      );
    }
  }

  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from("users")
    .update(data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ data: null, error }, { status: 400 });
  }

  const revalidated = revalidatePaths(options?.revalidatePaths);

  return NextResponse.json({
    data: updated,
    error: null,
    revalidated,
    now: Date.now(),
  });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") as string;

  const { options } = await request.json();
  const { authorized } = await authorize(id);

  if (!authorized) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 },
    );
  }

  const supabase = createClient();
  const bucketId = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!;
  const { data: list } = await supabase.storage.from(bucketId).list(id);

  if (list) {
    const files = list.map((file) => `${id}/${file?.name}`);
    const removed = await supabase.storage.from(bucketId).remove(files);
    if (removed?.error) {
      return NextResponse.json(
        { data: null, error: removed?.error },
        { status: 400 },
      );
    }
  }

  const supabaseAdmin = createAdminClient();
  const account = await supabaseAdmin.deleteUser(id);

  if (account?.error) {
    return NextResponse.json(
      { data: null, error: account?.error },
      { status: 400 },
    );
  }

  const revalidated = revalidatePaths(options?.revalidatePaths);

  return NextResponse.json({
    data: null,
    error: null,
    revalidated,
    now: Date.now(),
  });
}
