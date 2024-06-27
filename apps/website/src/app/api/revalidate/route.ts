import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  console.log(`secret`);
  // if (secret !== process.env.PATH_SECRET) {
  //   return NextResponse.error(403, "Forbittden");
  // }
  const path = request.nextUrl.searchParams.get("path") || "/";
  console.log(`validating... ${path}`);
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
