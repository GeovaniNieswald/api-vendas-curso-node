import 'reflect-metadata';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionsService from './CreateSessionsService';

let fakeUsersRepository = new FakeUsersRepository();
let createSession: CreateSessionsService;

let userExample: ICreateUser;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    createSession = new CreateSessionsService(fakeUsersRepository, fakeHashProvider);

    userExample = {
      name: 'Geovani Alex Nieswald',
      email: 'contato@geovanidev.com.br',
      password: '1234',
    };
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create(userExample);

    const response = await createSession.execute(userExample);

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existent user', async () => {
    expect(createSession.execute(userExample)).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create(userExample);

    userExample.password = '154541';

    expect(createSession.execute(userExample)).rejects.toBeInstanceOf(AppError);
  });
});
