import { NextFunction, Request, Response } from 'express'

import { awsRegion } from '@/util/environmentVariables'

const BUCKET_NAME = 'dnd-5e-api-images'
const AWS_REGION = awsRegion || 'us-east-1'

const show = async (req: Request, res: Response, next: NextFunction) => {
  let key: string | undefined
  try {
    key = req.url.slice(1)
    if (!key || !/^[a-zA-Z0-9/._-]+$/.test(key)) {
      return res.status(400).send('Invalid image path')
    }

    const publicUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`
    const s3Response = await fetch(publicUrl)

    if (!s3Response.ok) {
      return res.status(s3Response.status).send(await s3Response.text())
    }

    const contentTypeFromHeader = s3Response.headers.get('content-type')
    const actualContentType =
      contentTypeFromHeader != null ? contentTypeFromHeader : 'application/octet-stream'
    res.setHeader('Content-Type', actualContentType)
    const contentLength = s3Response.headers.get('content-length')
    if (typeof contentLength === 'string' && contentLength) {
      res.setHeader('Content-Length', contentLength)
    }

    if (s3Response.body) {
      const reader = s3Response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
      res.end()
    } else {
      throw new Error('Response body from S3 was null')
    }
  } catch (err: any) {
    if (err !== null) {
      res.status(404).end('File Not Found')
    } else {
      console.error('Error fetching image from S3:', err)
      next(err)
    }
  }
}

export default {
  show
}
