import { NextFunction, Request, Response } from 'express';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { awsS3Client } from '../../../util/index.js';

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = {
      Bucket: 'dnd-5e-api-images',
      Key: req.url.slice(1),
    };

    try {
      const s3Response = await awsS3Client.send(new GetObjectCommand(params));
      const data = await s3Response.Body?.transformToByteArray();

      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.write(data, 'binary');
      res.end(null, 'binary');
    } catch {
      res.status(200);
      res.end('Error Fetching File');
    }
  } catch (err) {
    return next(err);
  }
};

export default {
  show,
};
