import { TokenEnum } from '../enum';

export type JwtPayload = {
  email: string;
  sub: number;
  role: string;
  token_type: TokenEnum;
};
