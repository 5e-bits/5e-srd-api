import aws from 'aws-sdk';

const s3 = new aws.S3({ params: { Bucket: 'dnd-5e-api-images' } });

const show = async (req, res, next) => {
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
        res.attachment(params.Key); // Set Filename
        res.type(data.ContentType); // Set FileType
        res.send(data.Body); // Send File Buffer
      }
    });
  } catch (err) {
    return next(err);
  }
};

export default {
  show,
};
