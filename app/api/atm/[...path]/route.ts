import { NextRequest, NextResponse } from "next/server";

const ATM_BACKEND_URL = "http://204.90.115.200:5999";

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const targetPath = path.join("/");
  const search = request.nextUrl.search;
  const targetUrl = `${ATM_BACKEND_URL}/${targetPath}${search}`;

  try {
    const init: RequestInit = {
      method: request.method,
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.headers = {
        ...init.headers,
        "Content-Type": request.headers.get("content-type") ?? "application/json",
      };
      init.body = await request.text();
    }

    const response = await fetch(targetUrl, init);
    const contentType = response.headers.get("content-type") ?? "application/json";
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "ATM backend is unreachable from the frontend proxy.",
      },
      { status: 502 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}
