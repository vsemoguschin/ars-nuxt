import type { ColumnDef } from '@tanstack/vue-table';

export type User = {
  id: number;
  username: string;
  role: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'username',
    header: 'Имя пользователя',
  },
  {
    accessorKey: 'role',
    header: 'Роль',
  },
];
