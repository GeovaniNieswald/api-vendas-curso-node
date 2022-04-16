import uploadCondig from '@config/upload';
import AppError from '@shared/errors/AppError';
import DiskStorageProvider from '@shared/providers/storage-providers/DiskStorageProvider';
import S3StorageProvider from '@shared/providers/storage-providers/S3StorageProvider';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import { UsersRepository } from '../typeorm/repositories/UsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found.');
    }

    let storageProvider: DiskStorageProvider | S3StorageProvider;

    if (uploadCondig.driver === 'disk') {
      storageProvider = new DiskStorageProvider();
    } else {
      storageProvider = new S3StorageProvider();
    }

    if (user.avatar) {
      await storageProvider.deleteFile(user.avatar);
    }

    const fileName = await storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
