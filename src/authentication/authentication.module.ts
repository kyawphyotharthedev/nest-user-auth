import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [JwtModule.register({})],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
