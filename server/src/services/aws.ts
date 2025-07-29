import AWS from "aws-sdk";
import config from "../common/app-config";

function getUniqueFilename() {
  const timestamp = new Date().getTime();
  const randomInteger = Math.floor(Math.random() * 1000000 + 1);
  return timestamp + "_" + randomInteger + ".png";
}

export function uploadImageToS3(base64EncodedImage: string) {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(base64EncodedImage.replace(/^data:image\/\w+;base64,/, ""), "base64");
    AWS.config.update({
      accessKeyId: config.aws.credentials.accessKeyId,
      secretAccessKey: config.aws.credentials.secretAccessKey,
      region: "us-east-1",
    });

    const key = getUniqueFilename();
    const s3 = new AWS.S3();
    s3.putObject(
      {
        Bucket: config.aws.bucket,
        Key: key,
        Body: buffer,
        ContentType: "image/png",
        ContentEncoding: "base64",
      },
      function (error) {
        if (!error) {
          // resolve()
          resolve(config.aws.cloudfrontAddress + key);
        } else {
          reject(error);
        }
      }
    );
  });
}
