import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Public } from 'src/common/decorators';
import { AuthenticationToken } from './type/authenticationToken.type';
import { AuthenticationDto } from './dto/authentication.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authDto: AuthenticationDto): Promise<AuthenticationToken> {
    return this.authService.login(authDto);
  }

  @Public()
  @Post('/i/login')
  @HttpCode(HttpStatus.OK)
  internal_login(
    @Body() authDto: AuthenticationDto,
  ): Promise<AuthenticationToken> {
    return this.authService.internal_login(authDto);
  }
}
