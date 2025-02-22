import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { COGNITO_JWT_PAYLOAD_CONTEXT_PROPERTY } from "../user.constants";

/**
 * Decorator that can be used to inject the cognito user into a controller.
 * @param {string} [propertyName] The name of the property to inject the user into.
 * @returns {(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => any}
 * @example @CognitoUser() user: CognitoJwtPayload
 * @example @CognitoUser("username") username: string
 * @example @CognitoUser(["cognito:username", "email"]) { username, email }: { username: string, email: string }
 */
export const CognitoUser = createParamDecorator(
  (data: string | string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const payload = request[COGNITO_JWT_PAYLOAD_CONTEXT_PROPERTY];

    if (!data) {
      return payload;
    }

    if (Array.isArray(data)) {
      return data.reduce((result, key) => {
        result[key] = payload[`cognito:${key}`] || payload[key];
        return result;
      }, {});
    }

    return payload[`cognito:${data}`] || payload[data];
  }
);
