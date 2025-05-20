import { userPool } from "./cognito";
import { CognitoUser } from "amazon-cognito-identity-js";

export const getCurrentUserSession = () => {
  return new Promise<{ id: string; avatarUrl: string | null }>((resolve, reject) => {
    const user = userPool.getCurrentUser();
    if (!user) return reject("No session");

    user.getSession((err: any, session: any) => {
      if (err || !session.isValid()) {
        reject("Invalid session");
      } else {
        const payload = session.getIdToken().decodePayload();
        resolve({
          id: payload["sub"],
          avatarUrl: payload["picture"] || null,
        });
      }
    });
  });
};
