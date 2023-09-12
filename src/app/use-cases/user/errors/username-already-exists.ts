import { UseCaseError } from '@/core/errors/use-case-error';

export class UsernameAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Username "${identifier}" already exists.`);
  }
}
