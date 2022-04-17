import uploadCondig from '@config/upload';
import AppError from '@shared/errors/AppError';
import DiskStorageProvider from '@shared/providers/storage-providers/DiskStorageProvider';
import S3StorageProvider from '@shared/providers/storage-providers/S3StorageProvider';
import { inject, injectable } from 'tsyringe';
import { IUpdateUserAvatar } from '../domain/models/IUpdateUserAvatar';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFilename }: IUpdateUserAvatar): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);
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

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
