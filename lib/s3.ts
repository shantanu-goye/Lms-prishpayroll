import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY || !process.env.S3_BUCKET) {
  console.warn("S3 environment variables are not fully configured. File uploads specifically for assignments might fail.");
}

const s3Client = new S3Client({
  region: process.env.S3_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function uploadToS3(file: File, pathPrefix: string = "submissions") {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds 50MB limit`)
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const key = `${pathPrefix}/${filename}`;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET || "",
      Key: key,
      Body: buffer,
      ContentType: file.type,
    },
  });

  await upload.done();

  const url = `https://media.pixelperfects.in/${key}`;

  return { url, key };
}

export default s3Client;
