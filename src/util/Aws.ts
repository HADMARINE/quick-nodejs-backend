/* eslint-disable @typescript-eslint/ban-ts-comment */
import AWS from 'aws-sdk';
import error from '@error/ErrorDictionary';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import deasync from 'deasync';
import _logger from 'clear-logger';
const logger = _logger.customName('AWS');

const MULTIPART_SIZE = 5 * 1024 * 1024;

enum status {
  'INITIAL',
  'RESOLVED',
  'ERROR',
}

type SESParam = {
  address: {
    to: string[];
    cc?: string[];
    bcc?: string[];
  };
  subject: string;
  source: string;
  replyTo: string[];
  html: string;
};

async function SES(param: SESParam): Promise<unknown> {
  const ses = new AWS.SES({
    accessKeyId: process.env.SES_PUB_KEY,
    secretAccessKey: process.env.SES_PRIV_KEY,
    region: process.env.SES_REGION,
  });

  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      ToAddresses: param.address.to,
      CcAddresses: param.address.cc,
      BccAddresses: param.address.bcc,
    },
    Message: {
      Body: {
        Html: {
          Data: param.html,
          Charset: 'utf-8',
        },
      },
      Subject: {
        Data: param.subject, // 제목 내용
        Charset: 'utf-8',
      },
    },
    Source: param.source, // 보낸 사람 주소
    ReplyToAddresses: param.replyTo, // 답장 받을 이메일 주소
  };

  const result = await new Promise(function (resolve, reject) {
    ses.sendEmail(params).send((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  })
    .then((data) => {
      return data;
    })
    .catch(() => {
      throw error.aws.SES();
    });
  return result;
}

// async function SNS

async function S3UPLOAD(
  param: AWS.S3.PutObjectRequest,
): Promise<ManagedUpload.SendData> {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_PUB_KEY,
    secretAccessKey: process.env.S3_PRIV_KEY,
    region: process.env.S3_REGION,
  });

  return await new Promise(function (resolve, reject) {
    s3.upload(param, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  })
    .then((data) => {
      return data as ManagedUpload.SendData;
    })
    .catch(() => {
      throw error.aws.S3();
    });
}

async function S3UPLOAD_ACCELERATE(
  param: AWS.S3.PutObjectRequest,
): Promise<ManagedUpload.SendData> {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_PUB_KEY,
    secretAccessKey: process.env.S3_PRIV_KEY,
    region: process.env.S3_REGION,
    useAccelerateEndpoint: true,
  });

  return await new Promise(function (resolve, reject) {
    s3.upload(param, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  })
    .then((data) => {
      return data as ManagedUpload.SendData;
    })
    .catch(() => {
      throw error.aws.S3();
    });
}

function S3_GET_SIGNED_URL(param: {
  Bucket: string;
  Key: string;
  Expires?: number;
}): Promise<string> {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_PUB_KEY,
    secretAccessKey: process.env.S3_PRIV_KEY,
    region: process.env.S3_REGION,
  });
  return new Promise(function (resolve, reject) {
    s3.getSignedUrl('getObject', param, function (err, url) {
      if (err) reject(err);
      resolve(url);
    });
  })
    .then((url) => {
      return url as string;
    })
    .catch((err: Error) => {
      throw error.aws.S3(err.message);
    });
}

function S3_GET_SIGNED_URL_SYNC(
  param: {
    Bucket: string;
    Key: string;
    Expires?: number;
  },
  syncOptions: { timeout?: number; tick?: number } = {},
): string {
  // TODO: check cpu utilization
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_PUB_KEY,
    secretAccessKey: process.env.S3_PRIV_KEY,
    region: process.env.S3_REGION,
  });

  let STATUS = status.INITIAL;
  let ERROR;
  let RESULT = '';
  const timeouts = syncOptions.timeout || 10 * 1000;
  const tick = syncOptions.tick || 100;
  const waitUntil = new Date(new Date().getTime() + timeouts);

  s3.getSignedUrl('getObject', param, function (err, url) {
    if (err) {
      STATUS = status.ERROR;
      ERROR = err;
    } else {
      STATUS = status.RESOLVED;
      RESULT = url;
    }
  });

  while (STATUS === status.INITIAL && waitUntil > new Date()) {
    deasync.sleep(tick);
  }

  // @ts-ignore
  if (STATUS === status.RESOLVED) {
    return RESULT;
    // @ts-ignore
  } else if (STATUS === status.ERROR) {
    throw ERROR;
  } else {
    throw new Error(`TIMEOUT FOR S3_GET_SIGNED_URL_SYNC`);
  }
}

export default {
  SES,
  S3: {
    upload: S3UPLOAD,
    uploadAccelerate: S3UPLOAD_ACCELERATE,
    // uploadMultipartAccelerate: S3UPLOAD_MULTIPART_ACCELRATE,
    getSignedUrl: S3_GET_SIGNED_URL,
    getSignedUrlSync: S3_GET_SIGNED_URL_SYNC,
  },
};
