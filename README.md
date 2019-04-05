# LaunchDarklyRelay

This project contains a CloudFormation template that runs the [LaunchDarkly Relay](https://github.com/launchdarkly/ld-relay) in ECS Fargate.

The template takes two parameters:

* `Stage`: the name of the environment, e.g. `dev`, `staging`, `production`.

* `ApiKey`: your LaunchDarkly SDK key

## Deployment

You can deploy this stack using SAM or CDK, or the AWS CLI.

For example, with SAM:

```bash
sam deploy --template-file template.yml --stack-name <name of stack> --capabilities CAPABILITY_IAM --parameter-overrides ApiKey=<LaunchDarkly API key> Stage=<name of stage>
```

With AWS CLI:

```bash
aws cloudformation deploy --template-file template.yml --stack-name <name of stack> --capabilities CAPABILITY_IAM --parameter-overrides ApiKey=<LaunchDarkly API key> Stage=<name of stage>
```

## Example

See the [example](/example) folder for a sample Serverless function that uses [node-dynamodb-store](https://github.com/launchdarkly/node-dynamodb-store) to read feature toggles from DynamoDB instead of LaunchDarkly directly.

There are two things you should note from the example project:

1. The LaunchDarkly client is initialized with daemon mode set to `true` (see snippet below). This tells the client to read the feature toggles from DynamoDB instead of LaunchDarkly directly.

2. When you call `ldclient.variation` the LaunchDarkly would also make a HTTPs request to `events.launchdarkly.com` to register the user. But this doesn't happen realibly because the Node process is frozen when the invocation finishes. You can call `ldclient.flush` to flush the events synchronously and wait for it to finish, but this seems to take ~300ms. You also have the option of disabling sending events as well (see snippet below).

```javascript
const config = { featureStore: store, useLdd: true, sendEvents: false }
```
