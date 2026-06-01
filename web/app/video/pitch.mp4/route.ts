import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHUNK_SIZE = 1024 * 1024;
const VIDEO_PATH = path.join(process.cwd(), "app", "video.mp4");

export async function GET(request: Request) {
  return streamLocalVideo(request);
}

async function streamLocalVideo(request: Request) {
  let videoStat;
  try {
    videoStat = await stat(VIDEO_PATH);
  } catch {
    return new Response("Video file not found", { status: 404 });
  }

  const fileSize = videoStat.size;
  const range = request.headers.get("range");
  const baseHeaders = {
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store",
    "Content-Type": "video/mp4",
  };

  if (!range) {
    return new Response(toResponseBody(createReadStream(VIDEO_PATH)), {
      status: 200,
      headers: {
        ...baseHeaders,
        "Content-Length": String(fileSize),
      },
    });
  }

  const parsedRange = parseRange(range, fileSize);
  if (!parsedRange) {
    return new Response("Invalid range", {
      status: 416,
      headers: {
        ...baseHeaders,
        "Content-Range": `bytes */${fileSize}`,
      },
    });
  }

  const { start, end } = parsedRange;
  const contentLength = end - start + 1;

  return new Response(
    toResponseBody(createReadStream(VIDEO_PATH, { start, end })),
    {
      status: 206,
      headers: {
        ...baseHeaders,
        "Content-Length": String(contentLength),
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      },
    },
  );
}

function toResponseBody(stream: Readable) {
  return Readable.toWeb(stream) as unknown as BodyInit;
}

function parseRange(range: string, fileSize: number) {
  const match = range.match(/^bytes=(\d*)-(\d*)$/);

  if (!match) {
    return null;
  }

  const [, rawStart, rawEnd] = match;
  let start = rawStart ? Number(rawStart) : 0;
  let end = rawEnd ? Number(rawEnd) : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

  if (!rawStart && rawEnd) {
    const suffixLength = Number(rawEnd);
    start = Math.max(fileSize - suffixLength, 0);
    end = fileSize - 1;
  }

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    start < 0 ||
    end < start ||
    start >= fileSize
  ) {
    return null;
  }

  return {
    start,
    end: Math.min(end, fileSize - 1),
  };
}
