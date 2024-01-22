import { makeUser } from '@test/factories/make-user';
import { Confirmation, ConfirmationProps } from './confirmation';

describe('Confirmation Entity', () => {
  const user = makeUser();

  const expirationInMiliseconds = 1000 * 60 * 5;

  const initialConfirmationData: ConfirmationProps = {
    email: user.email,
    code: '123456',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + expirationInMiliseconds),
  };

  it('should create a confirmation', () => {
    const confirmation = Confirmation.create(initialConfirmationData);

    expect(confirmation.createdAt).toEqual(initialConfirmationData.createdAt);
    expect(confirmation.code).toEqual(initialConfirmationData.code);
    expect(confirmation.email).toEqual(initialConfirmationData.email);
    expect(confirmation.expiresAt).toEqual(initialConfirmationData.expiresAt);
    expect(confirmation.ConfirmedAt).toBeUndefined();
  });

  it('should confirm a confirmation', () => {
    const confirmation = Confirmation.create(initialConfirmationData);

    confirmation.confirm();

    expect(confirmation.ConfirmedAt).toBeInstanceOf(Date);
  });
});
