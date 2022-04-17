import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { IPaginateCustomer } from '@modules/customers/domain/models/IPaginateCustomer';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';

import { v4 as uuidv4 } from 'uuid';

export default class FakeCustomersRepository implements ICustomersRepository {
  private customers: Array<Customer> = [];

  public async create(createCustomer: ICreateCustomer): Promise<Customer> {
    const customer = new Customer();

    customer.id = uuidv4();
    customer.name = createCustomer.name;
    customer.email = createCustomer.email;

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(findCustomer => findCustomer.id === customer.id);

    this.customers[findIndex] = customer;

    return customer;
  }

  public async remove(customer: Customer): Promise<void> {
    // Temp code
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.name === name);
    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.id === id);
    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.email === email);
    return customer;
  }

  public async findAll(): Promise<IPaginateCustomer> {
    // Temp code

    const iPaginateCustomer: IPaginateCustomer = {
      from: 0,
      to: 0,
      per_page: 0,
      total: 0,
      current_page: 0,
      prev_page: null,
      next_page: null,
      data: [],
    };

    return iPaginateCustomer;
  }
}
