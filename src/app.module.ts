import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {UserModule} from './users/users.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CompaniesModule} from "./companies/companies.module";

@Module({
  controllers: [],
  providers: [AppService],
    imports: [
        UserModule,
        CompaniesModule,
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
