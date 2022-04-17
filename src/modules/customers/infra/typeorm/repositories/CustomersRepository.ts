import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { IPaginateCustomer } from '@modules/customers/domain/models/IPaginateCustomer';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { getRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';

export default class CustomersRepository implements ICustomersRepository {
  private ormRespository: Repository<Customer>;

  constructor() {
    this.ormRespository = getRepository(Customer);
  }

  public async create(createCustomer: ICreateCustomer): Promise<Customer> {
    const customer = this.ormRespository.create(createCustomer);

    return await this.ormRespository.save(customer);
  }

  public async save(customer: Customer): Promise<Customer> {
    return await this.ormRespository.save(customer);
  }

  public async remove(customer: Customer): Promise<void> {
    await this.ormRespository.remove(customer);
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    const customer = await this.ormRespository.findOne({
      where: {
        name,
      },
    });

    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = await this.ormRespository.findOne({
      where: {
        id,
      },
    });

    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = await this.ormRespository.findOne({
      where: {
        email,
      },
    });

    return customer;
  }

  public async findAll(): Promise<IPaginateCustomer> {
    const customers = await this.ormRespository.createQueryBuilder().paginate();

    return customers as IPaginateCustomer;
  }
}
