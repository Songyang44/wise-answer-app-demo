// lib/cognito.ts
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
  } from "amazon-cognito-identity-js";
  
  const poolData = {
    UserPoolId: "USER_POOL_ID",
    ClientId: "APP_CLIENT_ID",
  };
  
  export const userPool = new CognitoUserPool(poolData);
  