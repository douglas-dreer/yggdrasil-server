import { IUser } from '../interface/user.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsEmail, IsDate } from 'class-validator';

export class UserDTO implements IUser {

    @ApiPropertyOptional({ example: 'cuid_12345', description: 'User unique identifier' })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail({}, { message: 'Invalid email format' })
    email?: string;

    @ApiProperty({ example: 'P@ssw0rd', description: 'User password' })
    @IsString()
    password?: string;

    @ApiPropertyOptional({ example: '2025-02-18T12:00:00Z', description: 'User creation timestamp' })
    @IsOptional()
    @IsDate()
    created_at?: Date;

    @ApiPropertyOptional({ example: '2025-02-18T12:00:00Z', description: 'User last update timestamp' })
    @IsOptional()
    @IsDate()
    updated_at?: Date;

    @ApiPropertyOptional({ example: false, description: 'Indicates whether the user is deleted' })
    @IsOptional()
    @IsBoolean()
    deleted?: boolean;

    /**
     * Converts the DTO to an entity format.
     * This helps in mapping DTO data to the entity model.
     *
     * @returns A plain object representing the entity.
     */
    toEntity() {
        return { ...this };
    }
}
