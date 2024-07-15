import UserRepository from "./user.repository";

class UserService {
  userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async find(userId: string): Promise<User> {
    return await this.userRepository.find(userId);
  }

  async create(payload: Pick<User, "name" | "email" | "dob">): Promise<User> {
    return await this.userRepository.create(payload);
  }

  async update(
    id: string,
    payload: Pick<User, "name" | "email" | "dob">
  ): Promise<User> {
    return await this.userRepository.update<User>(id, payload);
  }

  async delete(id: string) {
    return await this.userRepository.delete(id);
  }
}

export { UserService };
