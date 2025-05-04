import { Request, Response } from 'express'
import { awsRegion } from '@/util/environmentVariables'

const BUCKET_NAME = 'dnd-5e-api-images'
const AWS_REGION = awsRegion || 'us-east-1'

const show = async (req: Request, res: Response) => {
  let key: string | undefined
  try {
    key = req.url.slice(1)
    if (!key) {
      return res.status(400).send('Invalid image path')
    }

    const publicUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`
    const s3Response = await fetch(publicUrl)

    if (!s3Response.ok) {
      return res.status(s3Response.status).send(await s3Response.text())
    }

    res.setHeader(
      'Content-Type',
      s3Response.headers.get('content-type') || 'application/octet-stream'
    )
    const contentLength = s3Response.headers.get('content-length')
    if (contentLength !== null) {
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
    console.error(`Error fetching image key "${key || 'unknown'}" from S3 URL:`, err)
    res.status(500).send('Failed to retrieve image due to server error')
  }
}

export default {
  show
}
