import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { User } from './modules/users/entities/user.entity';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './cronjob/cronjob.example';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      cache: false,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'test',
        entities: [User],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    CloudinaryModule,
  ],
  providers: [TasksService],
})
export class AppModule {}
