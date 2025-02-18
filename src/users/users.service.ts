import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entity/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {DuplicateDataException} from "../exceptions/duplicate-data.exception";
import {StatusType} from "../enum/status.type";
import {UpdateUserDto} from "./dto/update-user.dto";
import {BCryptUtil} from "../validators/bcrypt.utils";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptUtil: BCryptUtil,
  ) {}

  /**
   * Retrieves a list of users that are not marked as deleted.
   *
   * @returns {Promise<User[]>} List of users who are not deleted.
   */
  async listUsers(): Promise<User[]> {
    return await this.userRepository.find({ where: { deleted: false } });
  }

  /**
   * Retrieves a list of users filtered by their status.
   *
   * @param {StatusType} status - The status of the user (active/inactive).
   * @returns {Promise<User[]>} List of users filtered by the provided status.
   */
  async listUsersByStatus(status: StatusType): Promise<User[]> {
    const isActive = status == StatusType.INACTIVED;
    return await this.userRepository.find({ where: { deleted: isActive } });
  }

  /**
   * Finds a user by their unique identifier (ID).
   * Throws a NotFoundException if no user is found with the provided ID.
   *
   * @param {string} id - The unique identifier of the user.
   * @returns {Promise<User>} The found user or throws an exception if not found.
   */
  async findById(id: string): Promise<User> {
    return await this.isUserExists(id);
  }

  /**
   * Creates a new user, hashes the password, and saves it to the database.
   * Throws a DuplicateDataException if the email is already registered.
   *
   * @param {CreateUserDto} data - The data used to create the new user.
   * @returns {Promise<User>} The created user with encrypted password.
   */
  async createUser(data: CreateUserDto): Promise<User> {
    await this.validateUserForInsert(data);
    data.password = await this.bcryptUtil.hash(data.password);
    const entity = this.userRepository.create(data);
    return await this.userRepository.save(entity);
  }

  /**
   * Updates an existing user with the provided data.
   * Throws a NotFoundException if the user doesn't exist.
   * Throws a DuplicateDataException if the email is already in use.
   *
   * @param {string} id - The unique identifier of the user to be updated.
   * @param {Partial<UpdateUserDto>} data - The new data to update the user with.
   * @returns {Promise<User>} The updated user.
   */
  async updateUser(id: string, data: Partial<UpdateUserDto>): Promise<User> {
    const { password = "" } = data;
    await this.validateUserForEdit(id, data);
    data.password = await this.bcryptUtil.hash(password);
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  /**
   * Marks a user as deleted by updating their status in the database.
   * Throws a NotFoundException if the user doesn't exist.
   *
   * @param {string} id - The unique identifier of the user to be deleted.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   */
  async removeUser(id: string): Promise<void> {
    const user = await this.validateUserForDelete(id);
    user.deleted = true;
    user.updated_at = new Date();
    await this.userRepository.update(id, user);
  }

  /**
   * Validates if the user data is valid for insertion.
   *
   * @param {CreateUserDto} data - The user data to validate.
   * @returns {Promise<void>} Resolves if the data is valid.
   */
  private async validateUserForInsert(data: CreateUserDto): Promise<void> {
    await this.isEmailNotRegistered(data.email);
  }

  /**
   * Validates if the user data is valid for editing.
   *
   * @param {string} id - The unique identifier of the user.
   * @param {UpdateUserDto} data - The user data to validate.
   * @returns {Promise<void>} Resolves if the data is valid.
   */
  private async validateUserForEdit(
    id: string,
    data: UpdateUserDto,
  ): Promise<void> {
    const { email = "" } = data;
    await this.isUserExists(id);
    await this.isEmailNotRegistered(email);
  }

  /**
   * Validates if the user can be deleted.
   *
   * @param {string} id - The unique identifier of the user.
   * @returns {Promise<User>} The user entity if valid for deletion.
   */
  private async validateUserForDelete(id: string): Promise<User> {
    const user = await this.isUserExists(id);
    if (user.deleted) {
      throw new NotFoundException("User is already deleted");
    }
    return user;
  }

  /**
   * Verifies if a user exists with the provided ID.
   * Throws a NotFoundException if no user is found with the given ID.
   *
   * @param {string} id - The ID of the user to check for existence.
   * @returns {Promise<User>} The user entity if found.
   */
  private async isUserExists(id: string): Promise<User> {
    const result = await this.userRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`No user found with the id: ${id}`);
    }
    return result;
  }

  /**
   * Verifies if the provided email is not already registered.
   * Throws a DuplicateDataException if the email is found in the database.
   *
   * @param {string} email - The email to check for registration.
   * @returns {Promise<void>} Resolves if the email is not registered.
   */
  private async isEmailNotRegistered(email: string): Promise<void> {
    const count = await this.userRepository.count({ where: { email } });
    if (count > 0) {
      throw new DuplicateDataException(
        `A user with the email '${email}' already exists.`,
      );
    }
  }
}
