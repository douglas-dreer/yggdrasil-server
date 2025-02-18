import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './users/users.module';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  controllers: [AppController],
  providers: [AppService],
    imports: [
        UserModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'Admin@123',
            database: 'yggdrasil',
            autoLoadEntities: true,
            synchronize: true,
        }),
    ],
})
export class AppModule {}
