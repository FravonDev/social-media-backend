import { UseCaseError } from '@/core/errors/use-case-error';

export class AlreadyFollowUserError extends Error implements UseCaseError {
  constructor() {
    super(`Already following this user.`);
  }
}
