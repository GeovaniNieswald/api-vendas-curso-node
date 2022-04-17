import AppError from '@shared/errors/AppError';
import 'reflect-metadata';
import { ICreateCustomer } from '../domain/models/ICreateCustomer';
import FakeCustomersRepository from '../domain/repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from './CreateCustomerService';

let createCustomer: CreateCustomerService;
let customerExample: ICreateCustomer;

describe('CreateCustomer', () => {
  beforeEach(() => {
    const fakeCustomersRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomersRepository);

    customerExample = {
      name: 'Geovani Alex Nieswald',
      email: 'contato@geovanidev.com.br',
    };
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomer.execute(customerExample);

    expect(customer).toHaveProperty('id');
  });

  it('should not be able to create two customers with the same email', async () => {
    await createCustomer.execute(customerExample);

    expect(createCustomer.execute(customerExample)).rejects.toBeInstanceOf(AppError);
  });
});
