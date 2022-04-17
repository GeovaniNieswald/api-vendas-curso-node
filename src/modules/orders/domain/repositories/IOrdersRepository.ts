import { ICreateOrder } from '../models/ICreateOrder';
import { IOrder } from '../models/IOrder';

export interface IOrdersRepository {
  create(createOrder: ICreateOrder): Promise<IOrder>;
  findById(id: string): Promise<IOrder | undefined>;
}
