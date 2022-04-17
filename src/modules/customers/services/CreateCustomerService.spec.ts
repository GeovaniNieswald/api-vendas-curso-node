import AppError from '@shared/errors/AppError';
import 'reflect-metadata';
import FakeCustomersRepository from '../domain/repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from './CreateCustomerService';

let createCustomer: CreateCustomerService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    const fakeCustomersRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomer.execute({
      name: 'Geovani Alex Nieswald',
      email: 'contato@geovanidev.com.br',
    });

    expect(customer).toHaveProperty('id');
  });

  it('should not be able to create two customers with the same email', async () => {
    const customer = {
      name: 'Geovani Alex Nieswald',
      email: 'contato@geovanidev.com.br',
    };

    await createCustomer.execute(customer);

    expect(createCustomer.execute(customer)).rejects.toBeInstanceOf(AppError);
  });
});
