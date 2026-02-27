import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
        const uploadDir = path.join(process.cwd(), "public", "uploads", "puppies");

        // Ensure the directory exists
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Return the public URL that Next.js can serve directly
        return NextResponse.json({ secure_url: `/uploads/puppies/${filename}` });
    } catch (error) {
        console.error("Error occurred while saving image locally: ", error);
        return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
    }
}
