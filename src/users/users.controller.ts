import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  HttpStatus,
  Param,
  Query,
  BadRequestException,
  Put,
  HttpException, Delete,
} from '@nestjs/common';
import { Response} from 'express';
import { IUser } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() user: CreateUserDto, @Res() res: Response): Response<IUser> {
    const result = this.userService.create(user)
    return res.status(HttpStatus.CREATED).json(result)
  }

  @Get()
  findAll(@Res() res: Response): Response<IUser[]> {
    const resultList: IUser[] = this.userService.findAll()
    return res.status(HttpStatus.OK).json(resultList)
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Res() res: Response): Response<IUser> {
    const result: IUser = this.userService.findById(id)
    return res.status(HttpStatus.OK).json(result)
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: UpdateUserDto, @Res() res: Response): Response<IUser | undefined> {
    const result: IUser | undefined = this.userService.update(id, data)
    return res.status(HttpStatus.OK).json(result)
  }

  @Delete(':id')
  delete(@Param('id') id: number, @Res() res: Response<string>) {
    this.userService.delete(id)
    return res.status(HttpStatus.OK).json('Usuário excluído com sucesso.')
  }
}
