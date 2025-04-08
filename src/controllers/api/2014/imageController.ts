import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Request, Response } from 'express';

import { awsS3Client } from '@/util/index.js';

const show = async (req: Request, res: Response) => {
  try {
    const params = {
      Bucket: 'dnd-5e-api-images',
      Key: req.url.slice(1),
    };

    const s3Response = await awsS3Client.send(new GetObjectCommand(params));
    const data = await s3Response.Body?.transformToByteArray();

    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.write(data, 'binary');
    res.end(null, 'binary');
  } catch (err: any) {
    if (err.name === 'NoSuchKey') {
      res.status(404).end('File Not Found');
    } else {
      res.status(500).end(`Error Fetching File: ${err.message}`);
    }
  }
};

export default {
  show,
};
