import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './users';

@Module({
  controllers: [UsersController],
  providers: [UsersService, Users]
})
export class UsersModule {}
