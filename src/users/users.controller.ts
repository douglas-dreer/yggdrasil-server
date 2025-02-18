import {Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res,} from '@nestjs/common';
import {Response} from 'express';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger'; // Importa as anotações do Swagger
import {IUser} from './interface/user.interface';
import {CreateUserDto} from './dto/create-user.dto';
import {UsersService} from './users.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserDTO} from './dto/user.dto';
import {StatusType} from '../enum/status.type';
import {ResponseDto} from "../companies/dto/response.dto";

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({summary: 'Create a new user'})
  @ApiBody({
    type: CreateUserDto,
    examples: {
      createUser: {
        summary: 'Valid user request',
        description: 'An example of a valid user creation request',
        value: {
          email: 'john.doe@example.com',
          password: 'SecureP@ssw0rd',
        },
      },
    },
  })

  @ApiResponse({
    status: 201, description: 'User successfully created', type: UserDTO, example: {
      'application/json': {
        "email": "douglas@mail.com",
        "password": "Senha@123",
        "id": "zpr7578g6p7314x0x568eu3i",
        "created_at": "2025-02-18T04:40:34.671Z",
        "deleted": false,
        "updated_at": null
      },
    },
  })
  async createUser(@Body() user: CreateUserDto, @Res() res: Response): Promise<Response<IUser>> {
    const result = await this.userService.createUser(user);
    return res.status(HttpStatus.CREATED).json(result?.toDTO());
  }

  @Get()
  @ApiOperation({summary: 'Get all users'})
  @ApiResponse({
    status: 200, description: 'List of all users', type: [UserDTO], example: {
      'application/json': [
        {
          "email": "douglas@mail.com",
          "password": "Senha@123",
          "id": "zpr7578g6p7314x0x568eu3i",
          "created_at": "2025-02-18T04:40:34.671Z",
          "deleted": false,
          "updated_at": null
        }
      ],
    }
  })
  async findAll(@Res() res: Response): Promise<Response<IUser[]>> {
    return res.status(HttpStatus.OK).json(await this.userService.listUsers());
  }

  @Get(':status/status')
  @ApiOperation({summary: 'Get users by status'})
  @ApiParam({name: 'status', enum: StatusType})
  @ApiResponse({status: 200, description: 'List of users by status', type: [UserDTO], example: {
      'application/json': [
        {
          "email": "douglas@mail.com",
          "password": "Senha@123",
          "id": "zpr7578g6p7314x0x568eu3i",
          "created_at": "2025-02-18T04:40:34.671Z",
          "deleted": false,
          "updated_at": null
        }
      ],
    }
  })
  async findAllByStatus(@Param('status') status: StatusType, @Res() res: Response): Promise<Response<IUser[]>> {
    return res.status(HttpStatus.OK).json(await this.userService.listUsersByStatus(status));
  }

  @Get(':id')
  @ApiOperation({summary: 'Get user by ID'})
  @ApiParam({name: 'id', description: 'User ID'})
  @ApiResponse({
    status: 200, description: 'User details', type: UserDTO, example: {
      'application/json': {
        "email": "douglas@mail.com",
        "password": "Senha@123",
        "id": "zpr7578g6p7314x0x568eu3i",
        "created_at": "2025-02-18T04:40:34.671Z",
        "deleted": false,
        "updated_at": null
      },
    }
  })
  @ApiResponse({
    status: 404, description: 'User not found', type: NotFoundException, example: {
      'application/json': {
        "message": "No user found with the id: 99",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<Response<IUser>> {
    return res.status(HttpStatus.OK).json(await this.userService.findById(id));
  }

  @Put(':id')
  @ApiOperation({summary: 'Update user details'})
  @ApiParam({name: 'id', description: 'User ID'})
  @ApiBody({type: UpdateUserDto, examples: {
        validPayload: {
          summary: 'Valid user request',
          description: 'An example of a valid user update request',
          value: {
            email: 'john.doe@example.com',
            password: 'SecureP@ssw0rd',
          },
        },
        invalidPayload: {
          summary: 'Invalid user request',
          description: 'An example of a invalid payload, email already',
          value: {
            email: 'user.lastname@email.com',
            password: 'InvalidP@ssword'
          }
        }
      },
  })
  @ApiResponse({
    status: 200, description: 'User updated successfully', type: UserDTO, example: {
      'application/json': {
        "email": "douglas@mail.com",
        "password": "Senha@123",
        "id": "zpr7578g6p7314x0x568eu3i",
        "created_at": "2025-02-18T04:40:34.671Z",
        "deleted": false,
        "updated_at": '2025-02-18T04:40:34.671Z'
      },
    },
  })
  @ApiResponse({
    status: 400, description: 'User not found', type: UserDTO, example: {
      'application/json': {
        "statusCode": 400,
        "message": "A user with the email 'email@email.com.br' already exists."
      }
    }
  })
  @ApiResponse({
    status: 404, description: 'User not found', type: UserDTO, example: {
      'application/json': {
        "message": "No user found with the id: 99",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  async update(@Param('id') id: string, @Body() data: UpdateUserDto, @Res() res: Response): Promise<Response<IUser>> {
    const result = await this.userService.updateUser(id, data);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete a user'}) // Descrição do que o endpoint faz
  @ApiParam({name: 'id', description: 'User ID'}) // Define o parâmetro de ID
  @ApiResponse({status: 200, description: 'User successfully deleted'}) // Resposta de sucesso
  @ApiResponse({
    status: 404, description: 'User not found', type: UserDTO, example: {
      'application/json': {
        "message": "No user found with the id: 99",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  }) // Resposta de sucesso
  async delete(@Param('id') id: string, @Res() res: Response<ResponseDto>) {
    await this.userService.removeUser(id);
    return res.status(HttpStatus.OK).json( new ResponseDto(200, "Company has deleted with successful"));
  }
}
