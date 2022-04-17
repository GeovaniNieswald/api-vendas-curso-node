import redisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IProduct } from '../domain/models/IProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
class ListProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(): Promise<IProduct[]> {
    let products = await redisCache.recover<IProduct[]>(process.env.REDIS_CACHE_KEY_PRODUCTS || '');

    if (!products) {
      products = await this.productsRepository.findAll();

      await redisCache.save(process.env.REDIS_CACHE_KEY_PRODUCTS || '', products);
    }

    return products;
  }
}

export default ListProductsService;
