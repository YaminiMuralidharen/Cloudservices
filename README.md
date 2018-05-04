# Cloudservices

1.Set up Cognito user pool and identity pool with open id connect .
2.Create a domain name in user pool
3.Open google developer console and create a project 
4.Give the Javascript origin as localhost/public domain name   and redirect uri is your cognito domain name 
5.Create a OAUTH client id from google developer console
6.Create an OIDC identity provider in IAM console with the client id 
7.Choose provider type as open id connect
8.Provider url  as https://accounts.google.com
9.Audience -> Google app id that ends with "apps.googleusercontent.com"
10.Enable accounts.google.com as the provider under openid in Cognito
11.Create workmail domain and  create users
12.Verify user email by sending email via SES verified sender (workmail admin user)

13.In index.html
14.Replace YOUR_GOOGLE_CLIENT_ID with client id from developer console( ends with apps.googleusercontent.com)
      <meta name="google-signin-client_id" content="YOUR_GOOGLE_CLIENT_ID">
      
15. Replace REGION_NAME, IDENTITY_POOL_NAME, USER_POOL_ID, CLIENT_ID with your Cognito credentials 
    AWSCognito.config.region = 'REGION_NAME';
    var identityPoolId = 'IDENTITY_POOL_NAME';
    var poolData = { 
            UserPoolId : 'USER_POOL_ID',
            ClientId : 'CLIENT_ID'
        };
16. Run the app on localhost on port 8080 with http-server
   Use the command ->  http-server -o -p 8080
   
 
