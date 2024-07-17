
# User CRUD Microservice 
I decided to go with a proxy handler that points to a Node.js Express application instead of defining all the events separately in different handlers. Setup a v1 router and built a custom DynamoDB ORM service called DynOrm. I have middleware that handles validating inbound requests with Joi.

### Local Development
Requires [Docker app](https://docs.docker.com/desktop/install/mac-install/) running so we can spin up the local dynamodb instance, which is a lot easier then installing the Java instance.

1) Install deps with `npm install`
2) Run the function in offline mode with `npm run dev`

When first running, it will spin up a docker container for the local dynamoDB instance and create a new table called `development-users`

You can access the lambda express application at `http://localhost:3000/api/v1/health`

### Running Tests
I decided to add some E2E controller specs alongside my service specs which ensures good integration with the entity services and the db model functions. 

Simply run `npm run test`


### Deploy to AWS
The fastest and least problamatic way to deploy to production is to have the lastest AWS CLI installed on your machine ([instructions here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))

Next please run `aws configure` to [setup](https://docs.aws.amazon.com/cli/latest/reference/configure/) the region and enter any credentials from your AWS account.

Next add a `.env.production` with ```AWS_DYNAMODB_ENDPOINT=https://dynamodb.{AWS_REGION}.amazonaws.com``` and replace the AWS_REGION var with whatever you set when you ran `aws configure`. 

Lastly, run `npm run deploy` which will return you an endpoint once successfully deployed

### Routes
GET: /api/v1/health --- Get the application status, I have a habit of setting these for canary deploy checks

POST: /api/v1/users --- Create a new user

GET: /api/v1/users/{user_id} --- Get an existing user

PUT: /api/v1/users/{user_id} --- Update an existing user

DELETE: /api/v1/users/{user_id} --- Delete an existing user

### Existing Deployed Resources
https://1ysyd81oza.execute-api.us-east-1.amazonaws.com/api/v1/health

https://1ysyd81oza.execute-api.us-east-1.amazonaws.com/api/v1/users

### Extra
For [Postman](https://www.postman.com/) lovers, there is a collection file in the source that you can import to quickly test any local or live instances of this function. Download `postman-user-api.json``
