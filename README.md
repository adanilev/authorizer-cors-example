# authorizer-cors-example

## About

It's convenient to use `DefaultAuthorizer` when defining a `AWS::Serverless::Api` resource with SAM. However, SAM's default behaviour it to add the authorizer to CORS pre-flight requests which doesn't work. It took me a bit of time to get it going. Here's a simple example of a working configuration.

## Prerequisites

These things installed:

1. `yarn`
1. `sam-cli`
1. Setup your AWS credentials and region (e.g. use named profiles in `~/.aws/credentials` and `~/.aws/config` and run `export AWS_DEFAULT_PROFILE=your-profile-name`)

## Installation

1. `cp .env-example .env`
1. Edit `.env` and put in a bucket name where `sam` will store artifacts
1. `./deploy.sh`
1. `cd front-end && yarn`
1. `yarn start`
1. Open `http://localhost:8080` in a browser, click the button and observe the greatness

## Cleanup

1. `aws cloudformation delete-stack --stack-name authorizer-cors-example`
1. Delete the cloudwatch log groups if you like

## Gotchas

- The policy that the Authorizer returns is cached by default for **all resources** in the API's stage so you need to be careful about how you construct the policy. This example uses the methodArn from the request which wouldn't work if we added more resources. For example, if we first call `/foo/GET`, the policy will only allow that resouce and method to be called. If a subsequent call uses the same Authorization Token but calls `/foo/POST` or `/foo/bar/GET`, the cached policy will be used and the call will be rejected. See: https://forums.aws.amazon.com/thread.jspa?threadID=225934
