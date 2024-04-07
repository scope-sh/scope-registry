import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID as string;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY as string;
const bucket = process.env.CLOUDFLARE_R2_BUCKET as string;

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function putObject(key: string, body: string): Promise<void> {
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }));
}

// eslint-disable-next-line import/prefer-default-export
export { putObject };
