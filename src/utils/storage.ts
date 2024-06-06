import { Readable } from 'node:stream';

import * as Minio from 'minio';

const endpoint = process.env.MINIO_PUBLIC_ENDPOINT as string;
const accessKey = process.env.MINIO_ACCESS_KEY as string;
const secretKey = process.env.MINIO_SECRET_KEY as string;
const bucket = process.env.MINIO_BUCKET as string;

const minioClient = new Minio.Client({
  endPoint: endpoint,
  port: 443,
  accessKey,
  secretKey,
});

async function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';

    stream.on('data', (chunk) => {
      data += chunk;
    });

    stream.on('end', () => {
      resolve(data);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}

async function getObject(key: string): Promise<string | null> {
  try {
    const file = await minioClient.getObject(bucket, key);
    const fileString = await streamToString(file);
    return fileString;
  } catch (e) {
    return null;
  }
}

async function putObject(key: string, body: string): Promise<void> {
  await minioClient.putObject(bucket, key, body);
}

async function putReadableObject(key: string, stream: Readable): Promise<void> {
  await minioClient.putObject(bucket, key, stream);
}

export { getObject, putObject, putReadableObject };
