import { Request, Response, NextFunction } from 'express';
import aws from 'aws-sdk';

const s3 = new aws.S3({ params: { Bucket: 'dnd-5e-api-images' } });

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = {
      Bucket: 'dnd-5e-api-images',
      Key: req.url.slice(1),
      Range: req.headers.range,
    };
    return s3.getObject(params, function(err, data) {
      if (err) {
        res.status(200);
        res.end('Error Fetching File');
      } else {
        res.writeHead(200, { 'Content-Type': data.ContentType });
        res.write(data.Body, 'binary');
        res.end(null, 'binary');
      }
    });
  } catch (err) {
    return next(err);
  }
};

export default {
  show,
};
