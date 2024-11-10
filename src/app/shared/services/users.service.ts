import { Injectable } from '@angular/core';
import { UserInteface } from '../types/user.interface';

@Injectable()
export class UsersService {
  users: UserInteface[] = [];

  addUser(user: UserInteface): void {
    this.users = [...this.users, user];
  }

  removeUser(userId: string): void {
    const updatedUsers = this.users.filter((user) => userId !== user.id);
    this.users = updatedUsers;
  }
}
