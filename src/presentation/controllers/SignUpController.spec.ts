import { User } from '../../domain/entities/User';
import { CreateUser } from '../../domain/interactors/CreateUser';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { HttpRequest, HttpResponse } from '../protocols/Http';
import { EmailValidator } from '../validators/EmailValidator';
import { SignUpController } from './SignUpController';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeCreateUser = (): CreateUser => {
  class CreateUserUseCaseStub implements CreateUser {
    async execute(user: Omit<User, 'id'>): Promise<User> {
      return {
        id: 'valid_id',
        ...user,
      };
    }
  }

  return new CreateUserUseCaseStub();
};

export interface SutType {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  createUserStub: CreateUser
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const createUserStub = makeCreateUser();
  const sut = new SignUpController(emailValidatorStub, createUserStub);

  return {
    sut,
    emailValidatorStub,
    createUserStub,
  };
};

describe('SignUp Controller', () => {
  describe('when create user', () => {
    const { sut, emailValidatorStub, createUserStub } = makeSut();
    let httpRequest: HttpRequest;
    let httpResponse: HttpResponse;

    describe('and name is not provided', () => {
      beforeAll(async () => {
        httpRequest = {
          body: {
            email: 'any_email',
            password: 'any_password',
            passwordConfirmation: 'any_password',
          },
        };
        httpResponse = await sut.handle(httpRequest);
      });
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400);
      });

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
      });
    });

    describe('and email is not provided', () => {
      beforeAll(async () => {
        httpRequest = {
          body: {
            name: 'any_name',
            password: 'any_password',
            passwordConfirmation: 'any_password',
          },
        };
        httpResponse = await sut.handle(httpRequest);
      });
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400);
      });

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
      });
    });

    describe('and password is not provided', () => {
      beforeAll(async () => {
        httpRequest = {
          body: {
            name: 'any_name',
            email: 'any_email',
            passwordConfirmation: 'any_password',
          },
        };
        httpResponse = await sut.handle(httpRequest);
      });
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400);
      });

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
      });
    });

    describe('and password confirmation is not provided', () => {
      beforeAll(async () => {
        httpRequest = {
          body: {
            name: 'any_name',
            email: 'any_email',
            password: 'any_password',
          },
        };
        httpResponse = await sut.handle(httpRequest);
      });
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400);
      });

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
      });
    });

    describe('and password confirmation fails', () => {
      beforeAll(async () => {
        httpRequest = {
          body: {
            name: 'any_name',
            email: 'any_email',
            password: 'any_password',
            passwordConfirmation: 'invalid_password_confirmation',
          },
        };
        httpResponse = await sut.handle(httpRequest);
      });
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400);
      });

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
      });
    });

    describe('and email is invalid', () => {
      beforeAll(async () => {
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
        httpRequest = {
          body: {
            email: 'invalid_email',
            name: 'any_name',
            password: 'any_password',
            passwordConfirmation: 'any_password',
          },
        };
        httpResponse = await sut.handle(httpRequest);
      });

      it('should call EmailValidator with correct email', () => {
        expect(emailValidatorStub.isValid).toHaveBeenCalledWith('invalid_email');
      });

      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(400);
      });

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
      });
    });

    describe('and EmailValidator throws', () => {
      beforeAll(async () => {
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
          throw new Error();
        });
        httpRequest = {
          body: {
            name: 'any_name',
            email: 'any_email',
            password: 'any_password',
            passwordConfirmation: 'any_password',
          },
        };
        httpResponse = await sut.handle(httpRequest);
      });
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(500);
      });

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new ServerError());
      });
    });

    describe('and call CreateUser', () => {
      beforeAll(async () => {
        jest.spyOn(createUserStub, 'execute');
        httpRequest = {
          body: {
            email: 'invalid_email',
            name: 'any_name',
            password: 'any_password',
            passwordConfirmation: 'any_password',
          },
        };
        httpResponse = await sut.handle(httpRequest);
      });

      it('should call EmailValidator with correct email', () => {
        expect(createUserStub.execute).toHaveBeenCalledWith({
          email: 'invalid_email',
          name: 'any_name',
          password: 'any_password',
        });
      });
    });

    describe('and CreateUser throws', () => {
      beforeAll(async () => {
        jest.spyOn(createUserStub, 'execute').mockImplementationOnce(() => {
          throw new Error();
        });
        httpRequest = {
          body: {
            name: 'any_name',
            email: 'any_email',
            password: 'any_password',
            passwordConfirmation: 'any_password',
          },
        };
        httpResponse = await sut.handle(httpRequest);
      });
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(500);
      });

      it('should body return error', () => {
        expect(httpResponse.body).toEqual(new ServerError());
      });
    });

    describe('and data is correct', () => {
      beforeAll(async () => {
        httpRequest = {
          body: {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
            passwordConfirmation: 'valid_password',
          },
        };
        httpResponse = await sut.handle(httpRequest);
      });
      it('should status code return 400', () => {
        expect(httpResponse.statusCode).toBe(200);
      });

      it('should body return error', () => {
        expect(httpResponse.body).toEqual({
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email',
          password: 'valid_password',
        });
      });
    });
  });
});
