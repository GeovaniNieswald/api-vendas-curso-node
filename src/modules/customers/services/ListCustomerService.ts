import { inject, injectable } from 'tsyringe';
import { IPaginateCustomer } from '../domain/models/IPaginateCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(): Promise<IPaginateCustomer> {
    const customers = await this.customersRepository.findAll();

    return customers;
  }
}

export default ListCustomerService;
