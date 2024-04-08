import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  S3ServiceException,
} from '@aws-sdk/client-s3';

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

async function getObject(key: string): Promise<string | null> {
  try {
    const file = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    const fileBody = file.Body;
    if (!fileBody) {
      return null;
    }
    const fileString = await fileBody.transformToString();
    return fileString;
  } catch (e) {
    if (e instanceof S3ServiceException) {
      if (e.name === 'NoSuchKey') {
        return null;
      }
    }
    throw e;
  }
}

async function putObject(key: string, body: string): Promise<void> {
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }));
}

export { getObject, putObject };
