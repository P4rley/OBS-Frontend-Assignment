import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it } from 'vitest';
import usersReducer, {
  createUser,
  deleteUser,
  getDataById,
  updateUser,
} from '@/store/slices/usersSlice';

describe('Home Component Tests', () => {
  let store: ReturnType<
    typeof configureStore<{ users: ReturnType<typeof usersReducer> }>
  >;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        users: usersReducer,
      },
    });
  });

  const mockUser = {
    id: 1,
    name: 'Budi',
    email: 'budi@mail.com',
    username: 'budi123',
    profilePicture: 'https://picsum.photos/id/1/100',
  };

  describe('Mutations', () => {
    it('Creating new user', () => {
      store.dispatch(createUser(mockUser));
      const state = store.getState().users;

      expect(state.users).toHaveLength(1);
      expect(state.users[0].name).toBe('Budi');
      expect(state.users[0].email).toBe('budi@mail.com');
      expect(state.users[0].username).toBe('budi123');
    });

    it('Update User', () => {
      store.dispatch(createUser(mockUser));

      const data = {
        ...mockUser,
        name: 'Andi',
      };

      store.dispatch(updateUser(data));

      const state = store.getState().users;

      expect(state.users).toHaveLength(1);
      expect(state.users[0].name).toBe('Andi');
    });

    it('Delete User', () => {
      store.dispatch(createUser(mockUser));
      expect(store.getState().users.users).toHaveLength(1);

      store.dispatch(deleteUser(mockUser));
      expect(store.getState().users.users).toHaveLength(0);
    });
  });

  describe('Fetching', () => {
    it('Getting all users', () => {
      store.dispatch(createUser(mockUser));

      const state = store.getState().users;

      expect(state.users).toHaveLength(1);
      expect(state.users[0].name).toBe('Budi');
    });

    it('Getting user by ID', () => {
      store.dispatch(createUser(mockUser));
      store.dispatch(getDataById(mockUser));

      const state = store.getState().users;

      expect(state.selectedUser?.name).toBe('Budi');
    });
  });
});
