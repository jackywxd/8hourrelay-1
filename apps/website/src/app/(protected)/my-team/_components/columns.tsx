import { MdWoman2, MdMan2 } from 'react-icons/md';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './column-header';
import { TableCell } from './table-cell';
import { EditCell } from './edit-cell';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type RaceEntry = {
  id: number;
  order: number;
  name: string;
  email: string;
  bib: string;
  timeSlot: number;
};

export const columns: ColumnDef<RaceEntry>[] = [
  {
    accessorKey: 'order',
    meta: {
      type: 'number',
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    enableGrouping: true,
    cell: ({ row }) => {
      return row.getValue('gender') === 'Male' ? (
        <MdMan2 size={24} />
      ) : (
        <MdWoman2 size={24} />
      );
    },
  },
  {
    accessorKey: 'bib',
    // cell: TableCell,
    header: 'Bib#',
  },
  {
    accessorKey: 'timeSlot',
    cell: TableCell,
    header: 'Time Slot',
    // aggregationFn: 'sum',
    footer: ({ table }) => {
      const sum = table.getFilteredRowModel().rows.reduce((total, row) => {
        return total + +row.getValue('timeSlot');
      }, 0);
      return (
        <span className="text-lg">
          <strong>{sum}</strong>
        </span>
      );
    },
    meta: {
      type: 'number',
      required: true,
      validate: (value: string) => {
        console.log(`value`, value);
        return +value >= 20;
      },
      validationMessage: 'Each one must run at least 20 minutes',
    },
  },
  {
    header: 'Action',
    cell: EditCell,
  },
];
