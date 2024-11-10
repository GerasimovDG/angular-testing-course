import { inject, Injectable } from '@angular/core';
import { UserInteface } from '../types/user.interface';
import { UtilsService } from './utils.service';

@Injectable()
export class UsersService {
  utilsService = inject(UtilsService);
  users: UserInteface[] = [];

  addUser(user: UserInteface): void {
    this.users = [...this.users, user];
  }

  removeUser(userId: string): void {
    const updatedUsers = this.users.filter((user) => userId !== user.id);
    this.users = updatedUsers;
  }

  getUsernames(): string[] {
    return this.utilsService.pluck(this.users, 'name');
  }
}
