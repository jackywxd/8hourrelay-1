'use client';
import * as React from 'react';

import { updateEntryRoster } from '@/actions/raceEntryActions';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnSizingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { ColumnResizer } from './column-resizer';
import { DataTableToolbar } from './toolbar';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data: defaultData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [colSizing, setColSizing] = React.useState<ColumnSizingState>({});

  const [editedRows, setEditedRows] = React.useState({});
  const [validRows, setValidRows] = React.useState({});
  const [data, setData] = React.useState(defaultData);

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    onColumnSizingChange: setColSizing,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    // defaultColumn,
    enableGrouping: true,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      columnSizing: colSizing,
      sorting,
      columnVisibility,
      columnFilters,
    },
    // Provide our updateData function to our table meta
    meta: {
      editedRows,
      setEditedRows,
      validRows,
      setValidRows,
      updateDB: async () => {
        console.log(`validRow`, Object.keys(validRows));
        for (const rowIndex in validRows) {
          console.log(`updateDB now`, rowIndex, data[rowIndex]);
          await updateEntryRoster(data[rowIndex].id, {
            raceDuration: +data[rowIndex].timeSlot,
          });
        }
      },
      revertData: (rowIndex: number) => {
        setData((old) =>
          old.map((row, index) =>
            index === rowIndex ? defaultData[rowIndex] : row
          )
        );
        // reset edited and valid rows
        validRows[rowIndex] && delete validRows[rowIndex];
        editedRows[rowIndex] && delete editedRows[rowIndex];
      },
      // update database with new data then revalidate page
      updateRow: (rowIndex: number) => {
        console.log(`updateRow`, rowIndex, data[rowIndex]);
        console.log(`editedRows`, editedRows);
        console.log(`validRow`, validRows);
        // updateRow(data[rowIndex].id, data[rowIndex]);
      },
      updateData: (
        rowIndex: number,
        columnId: string,
        value: string,
        isValid: boolean
      ) => {
        // Skip page index reset until after next rerender
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
        // the new value is the same as the original data, delete the edited and valid rows
        if (+defaultData[rowIndex][columnId] === +value) {
          // reset edited and valid rows
          validRows[rowIndex] && delete validRows[rowIndex];
          editedRows[rowIndex] && delete editedRows[rowIndex];
        } else {
          setValidRows((old) => ({
            ...old,
            [rowIndex]: { ...old[rowIndex], [columnId]: isValid },
          }));
        }
      },
    },
    debugTable: true,
  });

  return (
    <div className="flex flex-col gap-3 space-y-4">
      <div>
        <DataTableToolbar table={table} data={data} />
      </div>
      <div className="rounded-md border">
        <form>
          <Table style={{ width: table.getTotalSize() }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="relative"
                        style={{
                          width: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        <ColumnResizer header={header} />
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={
                      Object.keys(validRows).includes(`${index}`)
                        ? 'bg-muted-foreground/10'
                        : ''
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                        }}
                      >
                        {cell.getIsAggregated()
                          ? flexRender(
                              cell.column.columnDef.aggregatedCell,
                              cell.getContext()
                            )
                          : flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>
        </form>
      </div>
      {/* <div className="mt-2">
        <DataTablePagination table={table} />
      </div> */}
    </div>
  );
}
