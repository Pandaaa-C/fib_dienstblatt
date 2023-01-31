import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import * as process from "process";

async function bootstrap() {
    config();
    const app = await NestFactory.create(AppModule);

    await app.enableCors({
        credentials: true,
        maxAge: 60 * 60 * 24 * 7,
        origin: process.env.FRONTEND_URL
    });

    await app.use(cookieParser());
    await app.listen(3001);
}

bootstrap();
