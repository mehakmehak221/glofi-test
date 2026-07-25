import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    applinks: {
      apps: [],
      details: [
        {
          appID: "N7UUU5WQW7.app.glofiestates.com",
          paths: ["/property*", "/properties*", "/sign-up*"],
        },
      ],
    },
  };

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
