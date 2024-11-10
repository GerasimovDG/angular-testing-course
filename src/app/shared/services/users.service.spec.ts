import { UserInteface } from '../types/user.interface';
import { UsersService } from './users.service';
import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';

describe('UsersService', () => {
  let usersService: UsersService;

  // Spy option
  let utilsService: UtilsService;

  // Mock option
  // const utilsSericeMock = {
  //   pluck: jest.fn(),
  // }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersService,
        UtilsService,
        // Mock option
        // { provide: UtilsService, useValue: utilsSericeMock },
      ],
    });

    usersService = TestBed.inject(UsersService);
    utilsService = TestBed.inject(UtilsService);
  });

  it('creates a service', () => {
    expect(usersService).toBeTruthy();
  });

  describe('addUser', () => {
    it('should add a user', () => {
      const user: UserInteface = { id: '3', name: 'Dime' };
      usersService.addUser(user);

      expect(usersService.users).toEqual([{ id: '3', name: 'Dime' }]);
    })
  });

  describe('removeUser', () => {
    it('should remove a user', () => {
      usersService.users = [{ id: '3', name: 'Dime' }];
      usersService.removeUser('3');

      expect(usersService.users).toEqual([]);
    })
  });

  describe('getUserames', () => {
    // Mock option
    // it('should get usernames', () => {
    //   utilsSericeMock.pluck.mockReturnValue(['foo']);
    //   expect(usersService.getUsernames()).toEqual(['foo']);
    // })
    it('should get usernames', () => {
      jest.spyOn(utilsService, 'pluck');

      usersService.users = [{ id: '3', name: 'Dime' }];
      usersService.getUsernames();

      expect(utilsService.pluck).toHaveBeenCalledWith(
        usersService.users,
        'name'
      );
    })
  });
});
