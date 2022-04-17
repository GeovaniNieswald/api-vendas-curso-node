import EtherealMail from '@config/mail/EtherealMail';
import mailConfig from '@config/mail/mail';
import SESMail from '@config/mail/SESMail';
import AppError from '@shared/errors/AppError';
import path from 'path';
import { inject, injectable } from 'tsyringe';
import { ISendForgotPasswordEmail } from '../domain/models/ISendForgotPasswordEmail';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: ISendForgotPasswordEmail): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exists.');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

    const sendMailConfig = {
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de Senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    };

    if (mailConfig.driver === 'ses') {
      await SESMail.sendMail(sendMailConfig);
    } else {
      await EtherealMail.sendMail(sendMailConfig);
    }
  }
}

export default SendForgotPasswordEmailService;
