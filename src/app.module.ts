import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationService } from './authentication/authentication.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    JwtModule,
    AuthenticationModule,
  ],
  controllers: [AppController, UsersController, AuthenticationController],
  providers: [
    AppService,
    UsersService,
    PrismaService,
    AuthenticationService,
    JwtService,
    ConfigService,
  ],
})
export class AppModule {}
