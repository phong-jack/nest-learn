import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { User } from './modules/users/entities/user.entity';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './cronjob/cronjob.example';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      cache: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'test',
        entities: [User],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    CloudinaryModule,
    AuthModule,
  ],
  // providers: [TasksService],
})
export class AppModule {}
