import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './entity/user.entity';
import {CreateUserDto} from './dto/create-user.dto';
import {DuplicateDataException} from '../exceptions/duplicate-data.exception';
import {StatusType} from '../enum/status.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  ) {
  }

  /**
   * Retrieves a list of users that are not marked as deleted.
   *
   * @returns {Promise<User[]>} List of users who are not deleted.
   */
  async listUser(): Promise<User[]> {
    return await this.userRepository.find({where: {deleted: false}});
  }

  /**
   * Retrieves a list of users filtered by their status.
   * If the status is 'INACTIVED', the query returns only inactive users.
   *
   * @param {StatusType} status - The status of the user (active/inactive).
   * @returns {Promise<User[]>} List of users filtered by the provided status.
   */
  async listUserByStatus(status: StatusType): Promise<User[]> {
    const isActive = status !== StatusType.INACTIVED;
    return await this.userRepository.find({where: {deleted: isActive}});
  }

  /**
   * Finds a user by their unique identifier (ID).
   * Throws a NotFoundException if no user is found with the provided ID.
   *
   * @param {string} id - The unique identifier of the user.
   * @returns {Promise<User | undefined>} The found user or undefined if not found.
   * @throws {NotFoundException} If no user is found with the provided ID.
   */
  async findById(id: string): Promise<User | undefined> {
    try {
      const result = await this.userRepository.findOne({where: {id}});
      if (!result) {
        throw new NotFoundException(`No user found with the id: ${id}`);
      }
      return result;
    } catch (error) {
      this.handleError(error, 'find by ID');
    }
  }

  /**
   * Creates a new user, hashes the password, and saves it to the database.
   * Throws a DuplicateDataException if the email is already registered.
   *
   * @param {CreateUserDto} data - The data used to create the new user.
   * @returns {Promise<User>} The created user with encrypted password.
   * @throws {DuplicateDataException} If the email is already registered.
   */
  async createUser(data: CreateUserDto): Promise<User | undefined> {
    try {
      await this.isEmailRegistered(data.email);

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const userCreated = this.userRepository.create({
        ...data,
        password: hashedPassword
      });

      return await this.userRepository.save(userCreated);
    } catch (error) {
      this.handleError(error, 'create');
    }
  }



  /**
   * Updates an existing user with the provided data.
   * Throws a NotFoundException if the user doesn't exist.
   * Throws a DuplicateDataException if the email is already in use.
   *
   * @param {string} id - The unique identifier of the user to be updated.
   * @param {Partial<CreateUserDto>} data - The new data to update the user with.
   * @returns {Promise<User | null>} The updated user, or null if not found.
   * @throws {NotFoundException} If the user does not exist.
   * @throws {DuplicateDataException} If the email is already registered.
   */
  async updateUser(id: string, data: Partial<CreateUserDto>) {
    try {
      await this.isUserExists(id);
      await this.isEmailRegistered(data.email);
      await this.userRepository.update(id, data);
      return this.userRepository.findOne({where: {id}});
    } catch (error) {
      this.handleError(error, 'update');
    }
  }

  /**
   * Marks a user as deleted by updating their status in the database.
   * Throws a NotFoundException if the user doesn't exist.
   *
   * @param {string} id - The unique identifier of the user to be deleted.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   * @throws {NotFoundException} If the user does not exist.
   */
  async removeUser(id: string): Promise<void> {
    try {
      const userDeleted = await this.isUserExists(id);
      userDeleted.deleted = true;
      await this.userRepository.update(id, userDeleted);
    } catch (error) {
      this.handleError(error, 'delete');
    }
  }

  /**
   * Verifies if a user exists with the provided ID.
   * Throws a NotFoundException if no user is found with the given ID.
   *
   * @param {string} id - The ID of the user to check for existence.
   * @returns {Promise<User>} The user entity if found.
   * @throws {NotFoundException} If no user is found with the provided ID.
   */
  private async isUserExists(id: string): Promise<User> {
    const result: User | null = await this.userRepository.findOne({where: {id}});
    if (!result) {
      throw new NotFoundException(`No user found with the id: ${id}`);
    }
    return result;
  }

  /**
   * Verifies if the provided email is already registered.
   * Throws a DuplicateDataException if the email is found in the database.
   *
   * @param {string | undefined} email - The email to check for registration.
   * @returns {Promise<void>} Resolves if the email is not registered.
   * @throws {DuplicateDataException} If the email is already registered.
   */
  private async isEmailRegistered(email: string | undefined): Promise<void> {
    if (await this.userRepository.count({where: {email}})) {
      throw new DuplicateDataException(`A user with the email '${email}' already exists.`);
    }
  }

  /**
   * Handles errors that occur during the execution of user-related actions.
   * If the error is a DuplicateDataException, it is rethrown.
   * Otherwise, a generic error is thrown with the action and error message.
   *
   * @param {any} error - The error that occurred during the action.
   * @param {string} action - The action being performed (e.g., 'create', 'update', etc.).
   * @throws {Error} Throws a generic error message if not a DuplicateDataException.
   */
  private handleError(error: any, action: string) {
    if (error instanceof DuplicateDataException) {
      throw error;
    }

    if (error instanceof NotFoundException) {
      throw error
    }
    throw new Error(`Error while ${action} the user: ${error.message || error}`);
  }
}
