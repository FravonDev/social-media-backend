import { UseCaseError } from '@/core/errors/use-case-error';

export class NotFollowUserError extends Error implements UseCaseError {
  constructor() {
    super(`Not following this user.`);
  }
}
