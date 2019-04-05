const { LAUNCHDARKLY_APIKEY, DYNAMODB_TABLE } = process.env

const LaunchDarkly = require('ldclient-node')
const DynamoDBFeatureStore = require('ldclient-node-dynamodb-store')
const store = DynamoDBFeatureStore(DYNAMODB_TABLE)
// use daemon mode, and don't send events (for user-facing things)
const config = { featureStore: store, useLdd: true, sendEvents: false }
const ldclient = LaunchDarkly.init(LAUNCHDARKLY_APIKEY, config)

module.exports.hello = async (event) => {
  console.log(JSON.stringify(event))
  const key = event.queryStringParameters.key
  const userKey = event.queryStringParameters.user

  await ldclient.waitForInitialization()

  const user = {
    key: userKey,
    country: event.headers['CloudFront-Viewer-Country']
  }

  // behind the scenes the LD client also makes a HTTPs request events.launchdarkly.com
  // to register the user, which doesn't count towards the server connections
  const showFeature = await ldclient.variation(key, user, true)

  return {
    statusCode: 200,
    body: JSON.stringify({
      showFeature
    })
  }
}
