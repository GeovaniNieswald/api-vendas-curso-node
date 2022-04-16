import redisCache from '@shared/cache/RedisCache';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductsRepository } from '../typeorm/repositories/ProductsRepository';

class ListProductService {
  public async execute(): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductsRepository);

    let products = await redisCache.recover<Product[]>(process.env.REDIS_CACHE_KEY_PRODUCTS || '');

    if (!products) {
      products = await productsRepository.find();

      await redisCache.save(process.env.REDIS_CACHE_KEY_PRODUCTS || '', products);
    }

    return products;
  }
}

export default ListProductService;
