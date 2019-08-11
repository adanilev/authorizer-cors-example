#!/bin/bash

source .env

if [[ -z "$AUTH_CORS_S3_BUCKET" ]]; then
  echo "Error: look at .env-example. Bucket name for SAM artifacts needs to be defined in .env"
  exit 1
fi

sam package --template-file sam-template.yml --output-template-file sam-pkg-template.yml --s3-bucket $AUTH_CORS_S3_BUCKET

sam deploy --template-file sam-pkg-template.yml --stack-name authorizer-cors-example --capabilities CAPABILITY_IAM

echo "var helloWorldUrl = '$(aws cloudformation describe-stacks --stack-name authorizer-cors-example --query 'Stacks[].Outputs[?OutputKey==`HelloWorldApi`].OutputValue')';" > ./front-end/.env.js