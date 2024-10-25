import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const simpleHandleCatch = (e: any) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    throw new HttpException(e.code, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  console.log(e);
  throw new HttpException(
    'Internal Server Error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
