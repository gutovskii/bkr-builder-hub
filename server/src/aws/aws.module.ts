import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Module({
  providers: [
    AwsService,
    {
      provide: S3,
      useFactory(config: ConfigService) {
        return new S3({
          region: config.get('AWS_REGION'),
          accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
          secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [AwsService],
})
export class AwsModule {}
