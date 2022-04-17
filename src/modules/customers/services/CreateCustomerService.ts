import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateCustomer } from '../domain/models/ICreateCustomer';
import { ICustomer } from '../domain/models/ICustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(createCustomer: ICreateCustomer): Promise<ICustomer> {
    const emailExists = await this.customersRepository.findByEmail(createCustomer.email);
    if (emailExists) {
      throw new AppError('Email address alredy used.');
    }

    const customer = await this.customersRepository.create(createCustomer);

    return customer;
  }
}

export default CreateCustomerService;
