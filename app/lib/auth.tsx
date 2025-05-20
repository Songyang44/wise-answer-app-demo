import {
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute,
  } from "amazon-cognito-identity-js";
  import { userPool } from "./cognito";
  
  // register
  export const signUp = (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      userPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: "email", Value: email })],
        [],
        (err, result) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  };
  
  // login
  export const signIn = (email: string, password: string) => {
    return new Promise<{ id: string; avatarUrl: string | null }>((resolve, reject) => {
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
  
      const user = new CognitoUser({
        Username: email,
        Pool: userPool,
      });
  
      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
          const idToken = result.getIdToken().getJwtToken();
          const payload = result.getIdToken().decodePayload();
          resolve({
            id: payload["sub"],
            avatarUrl: payload["picture"] || null,
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };
  
  // logout
  export const signOut = (email: string) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    user.signOut();
  };
  