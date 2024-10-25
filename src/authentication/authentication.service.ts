import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticationDto } from './dto/authentication.dto';
import { AuthenticationToken } from './type/authenticationToken.type';
import * as argon from 'argon2';
import { JwtPayload } from './type/jwtPayload.type';
import { JwtService } from '@nestjs/jwt';
import { TokenEnum } from './enum';
import { UsersRole } from '@prisma/client';

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async internal_login(
    authDto: AuthenticationDto,
  ): Promise<AuthenticationToken> {
    const user = await this.prisma.users.findUnique({
      where: {
        email: authDto.email,
      },
    });
    if (!user)
      throw new HttpException(
        'Incorrect Email or Password',
        HttpStatus.UNAUTHORIZED,
      );
    if (user.role === UsersRole.E_User)
      throw new HttpException('Unauthroized Login.', HttpStatus.UNAUTHORIZED);

    const passwordMatched = await argon.verify(user.password, authDto.password);
    if (!passwordMatched)
      throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);

    const [at, rt] = await Promise.all([
      this.generateToken(
        {
          email: user.email,
          sub: user.id,
          role: user.role,
          token_type: TokenEnum.ACCESS,
        },
        this.config.get('JWT_ACCESS_SECRET'),
      ),
      this.generateToken(
        {
          email: user.email,
          sub: user.id,
          role: user.role,
          token_type: TokenEnum.REFRESH,
        },
        this.config.get('JWT_REFRESH_SECRET'),
        '4h',
      ),
    ]);
    return { access_token: at, refresh_token: rt, type: 'Bearer' };
  }

  async login(authDto: AuthenticationDto): Promise<AuthenticationToken> {
    const user = await this.prisma.users.findUnique({
      where: {
        email: authDto.email,
      },
    });
    if (!user)
      throw new HttpException(
        'Incorrect Email Or Password',
        HttpStatus.UNAUTHORIZED,
      );
    if (user.role !== UsersRole.E_User)
      throw new HttpException('Unauthorized Login', HttpStatus.UNAUTHORIZED);

    const passwordMatched = await argon.verify(user.password, authDto.password);
    if (!passwordMatched)
      throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);

    const [at, rt] = await Promise.all([
      this.generateToken(
        {
          email: user.email,
          sub: user.id,
          role: user.role,
          token_type: TokenEnum.ACCESS,
        },
        this.config.get('JWT_ACCESS_SECRET'),
      ),
      this.generateToken(
        {
          email: user.email,
          sub: user.id,
          role: user.role,
          token_type: TokenEnum.REFRESH,
        },
        this.config.get('JWT_REFRESH_SECRET'),
        '4h',
      ),
    ]);
    return { access_token: at, refresh_token: rt, type: 'Bearer' };
  }

  // async refresh(userId: number, rt: string): Promise<AuthenticationToken> {
  //   const user = await this.prisma.users.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //   });

  //   const at = await this.generateToken(
  //     {
  //       email: user.email,
  //       sub: user.id,
  //       role: user.role,
  //       token_type: TokenEnum.ACCESS,
  //     },
  //     this.config.get('JWT_ACCESS_SECRET'),
  //   );
  //   return { access_token: at, refresh_token: rt, type: 'Bearer' };
  // }

  private async generateToken(
    payload: JwtPayload,
    secret: string,
    expiresIn = '15m',
  ) {
    const token = await this.jwt.signAsync(payload, { expiresIn, secret });
    return token;
  }

  validateJwt(token: any) {
    return this.jwt.verify(token, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
    });
  }
}
