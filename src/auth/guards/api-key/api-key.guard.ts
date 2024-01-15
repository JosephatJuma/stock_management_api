import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    // Check if the API key matches the one set in environment variables
    if (!apiKey) {
      throw new UnauthorizedException('Access denied. API key is required');
    } else if (apiKey === process.env.API_KEY) {
      return true;
    }
    // If API key is missing or incorrect, throw an Unauthorized exception
    throw new UnauthorizedException('Invalid API key');
  }
}
