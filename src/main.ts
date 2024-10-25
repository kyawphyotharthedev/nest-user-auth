import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Handler, Context, Callback } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

const expressApp = express();

async function createNestServer() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  const config = new DocumentBuilder()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Bearer',
    )
    .setTitle('User Authentication Service')
    .setDescription('User Authentication Backend API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 8001, process.env.HOST || '127.0.0.1');
}
createNestServer();

export const handler: Handler = (
  event: any,
  context: Context,
  callback: Callback,
) => {
  serverlessExpress({ app: expressApp })(event, context, callback);
};
