'use client';

import { useTransition } from 'react';
import { CSVLink } from 'react-csv';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { DataTableViewOptions } from './data-table-view-option';

// 扩展 Table Meta 类型
declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    validRows?: Record<string, any>;
    updateDB?: () => void;
  }
}

// react-csv 类型声明
type CSVData = Array<Record<string, any>> | Array<Array<string | number>>;

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  data: TData[];
}

export function DataTableToolbar<TData>({
  table,
  data,
}: DataTableToolbarProps<TData>) {
  const [pending, startTransition] = useTransition();

  const dataChanged =
    Object.keys(table.options.meta?.validRows || {}).length > 0;

  const isFiltered = table.getState().columnFilters.length > 0;

  function onUpdateDB() {
    startTransition(async () => {
      console.log(`save data`);
      console.log(`validRows`, table.options.meta?.validRows);
      table.options.meta?.updateDB?.();
      // 移除 revalidatePath 调用，因为它不能在客户端组件中使用
      // 如果需要重新验证数据，应该通过其他方式实现
    });
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter email..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>

      <div className="flex justify-center gap-5">
        {dataChanged && (
          <div>
            <Button onClick={onUpdateDB} className="text-sm">
              <span className="text-sm">
                {pending ? 'Updating...' : 'Save'}
              </span>
            </Button>
          </div>
        )}
        {data?.length > 0 && (
          <CSVLink
            data={data as CSVData}
            filename={'my-file.csv'}
            className="flex items-center text-sm"
            target="_blank"
          >
            <span>Export</span>
          </CSVLink>
        )}
      </div>
    </div>
  );
}
