import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({ description: 'Optional updated name' })
    name?: string;

    @ApiPropertyOptional({ description: 'Optional updated email' })
    email?: string;
}
