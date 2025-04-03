import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(
    private readonly s3: S3,
    private readonly config: ConfigService,
  ) {}

  async uploadFileByBuffer(
    fileName: string,
    extWithDot: string,
    buffer: Buffer,
  ) {
    const key = `${fileName}${extWithDot}`; // 12aa21-1488-1337-1357.pdf

    const result = await this.s3
      .upload({
        Bucket: this.config.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: buffer,
        Key: key,
      })
      .promise();

    return result.Location;
  }

  async removeObject(key: string) {
    await this.s3
      .deleteObject({
        Key: key,
        Bucket: this.config.get('AWS_PUBLIC_BUCKET_NAME'),
      })
      .promise();
  }
}
