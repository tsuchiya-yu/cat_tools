import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "LLMS.txt");
    const body = await readFile(filePath, "utf-8");

    return new Response(body, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  } catch {
    return new Response("LLMS.txt not found", { status: 404 });
  }
}
