import redisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateProduct } from '../domain/models/ICreateProduct';
import { IProduct } from '../domain/models/IProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(createProduct: ICreateProduct): Promise<IProduct> {
    const productExists = await this.productsRepository.findByName(createProduct.name);
    if (productExists) {
      throw new AppError('There is already one product with this name');
    }

    const product = await this.productsRepository.create(createProduct);

    await redisCache.invalidate(process.env.REDIS_CACHE_KEY_PRODUCTS || '');

    return product;
  }
}

export default CreateProductService;
