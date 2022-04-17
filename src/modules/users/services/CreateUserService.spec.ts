import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import { ICreateUser } from '../domain/models/ICreateUser';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let createUser: CreateUserService;

let userExample: ICreateUser;

describe('CreateUser', () => {
  beforeEach(() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    userExample = {
      name: 'Geovani Alex Nieswald',
      email: 'contato@geovanidev.com.br',
      password: '1234',
    };
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute(userExample);

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with the same email', async () => {
    await createUser.execute(userExample);

    expect(createUser.execute(userExample)).rejects.toBeInstanceOf(AppError);
  });
});
