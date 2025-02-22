import {
  CognitoJwtVerifier,
  InjectCognitoJwtVerifier,
} from "@nestjs-cognito/core";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  COGNITO_JWT_PAYLOAD_CONTEXT_PROPERTY,
  COGNITO_USER_CONTEXT_PROPERTY,
} from "./user/user.constants";
import { UserMapper } from "./user/user.mapper";
import { User } from "./user/user.model";

@Injectable()
export abstract class AbstractGuard implements CanActivate {
  constructor(
    @InjectCognitoJwtVerifier()
    private readonly jwtVerifier: CognitoJwtVerifier
  ) {}

  /**
   * Check if the user is authenticated
   * @param {ExecutionContext} context - The execution context
   * @returns {Promise<boolean>} - True or false if the user is authenticated or not and has the required roles
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const authorization = this.getAuthorizationToken(request);

    try {
      const payload = await this.jwtVerifier.verify(authorization);
      if (!Boolean(payload) || !Boolean(payload["sub"])) {
        throw new UnauthorizedException("User is not authenticated.");
      }
      request[COGNITO_JWT_PAYLOAD_CONTEXT_PROPERTY] = payload;
      request[COGNITO_USER_CONTEXT_PROPERTY] =
        UserMapper.fromCognitoJwtPayload(payload);

      return this.onValidate(this.getAuthenticatedUser(request));
    } catch (error) {
      throw new UnauthorizedException("Authentication failed.", { cause: error });
    }
  }

  /**
   * Validate the user
   * @param {User} user - The user
   * @returns {boolean} - True if the user is authenticated
   */
  protected abstract onValidate(user: User): boolean;

  /**
   * Get the request from the execution context
   * @param {ExecutionContext} context - The execution context
   * @returns {Request} - The request
   */
  protected abstract getRequest(context: ExecutionContext): any;

  /**
   * Get the authenticated user from the request
   * @param {Request} request - The request
   * @returns {User} - The user
   * @throws {UnauthorizedException} - If the user is not found
   */
  private getAuthenticatedUser(request): User {
    const user = request[COGNITO_USER_CONTEXT_PROPERTY];

    if (!Boolean(user)) {
      throw new UnauthorizedException("User is not authenticated.");
    }

    return request[COGNITO_USER_CONTEXT_PROPERTY];
  }

  /**
   * Get the authorization token from the request
   * @param {Request} request - The request
   * @returns {string} - The authorization token
   * @throws {UnauthorizedException} - If the authorization token is not found
   */
  private getAuthorizationToken(request): string {
    if (!Boolean(request)) {
      throw new ServiceUnavailableException("Request is undefined or null.");
    }

    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException("Authorization header is missing.");
    }

    return authorization.replace("Bearer ", "");
  }
}
