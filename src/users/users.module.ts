import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entity/user.entity';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {BCryptUtil} from "../validators/bcrypt.utils";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, BCryptUtil],
})
export class UserModule {
}
