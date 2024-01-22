import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiKeyGuard } from './auth/guards/api-key/api-key.guard';
async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  const options = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // preflightContinue: false,
    credentials: true,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-KEY',
  };
  app.enableCors(options);
  //app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalGuards(new ApiKeyGuard());
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Stock Management API Docs')
    .setDescription('The Stock Management API description')
    .setVersion('1.0')
    .addApiKey({ name: 'x-api-key', in: 'header', type: 'apiKey' }, 'x-api-key')
    // .addBearerAuth({name: 'x-api-key', in: 'header', type: 'apiKey'})
    // .addGlobalParameters({
    //   in: 'header',
    //   name: 'x-api-key',
    //   allowEmptyValue: false,
    // })
    .addSecurityRequirements('x-api-key')
    .addTag('Stock Management API Endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, document, {
    swaggerOptions: {
      validatorUrl: null,
    },
    customSiteTitle: 'Stock Management API Docs',
  });

  await app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });
}
bootstrap();
