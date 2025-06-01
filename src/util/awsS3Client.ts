import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3'

import {
  awsAccessKeyId,
  awsConfigEnv,
  awsRegion,
  awsSecretAccessKey
} from '@/util/environmentVariables'

const awsS3ClientConfigs = {
  prod: {
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey
    }
  } as S3ClientConfig,
  // Assumes localstack is running and s3 is available at http://localhost:4566
  // with the bucket dnd-5e-api-images created with a folder named 'monsters'
  // containing image files.
  localstack_dev: {
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'test',
      secretAccessKey: 'test'
    },
    endpoint: 'http://s3.localhost.localstack.cloud:4566',
    forcePathStyle: true
  } as S3ClientConfig
}

export default new S3Client(awsS3ClientConfigs[awsConfigEnv as keyof typeof awsS3ClientConfigs])
