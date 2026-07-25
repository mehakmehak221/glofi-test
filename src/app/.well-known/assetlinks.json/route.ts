import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "app.glofiestates.com",
        "sha256_cert_fingerprints": [
          "2D:B2:97:4D:28:2B:6B:D8:01:E8:22:DB:D8:A2:C9:48:6F:6D:5C:13:D2:D3:D6:42:B6:23:CA:89:3F:04:00:1C"
        ]
      }
    }
  ];

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
