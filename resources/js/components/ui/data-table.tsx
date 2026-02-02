import {
  flexRender,
  type Table,
  type Column, // Added this import
} from "@tanstack/react-table"
import { CSSProperties } from "react"

import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData> {
  table: Table<TData>
  emptyMessage?: string
}

const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-1px 0 0 0 var(--muted) inset' // Adjusted for better visual separation
      : isFirstRightPinnedColumn
        ? '1px 0 0 0 var(--muted) inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    backgroundColor: isPinned ? 'var(--background)' : undefined,
  }
}

export default function DataTable<TData>({
  table,
  emptyMessage = "No results."
}: DataTableProps<TData>) {
  return (
    <div className="overflow-hidden rounded-md border">
      <UITable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead 
                    key={header.id} 
                    // ADD COLSPAN HERE
                    colSpan={header.colSpan}
                    style={{ ...getCommonPinningStyles(header.column) }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                    key={cell.id}
                    style={{ ...getCommonPinningStyles(cell.column) }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              {/* Use getVisibleLeafColumns to ensure it spans the correct count */}
              <TableCell 
                colSpan={table.getVisibleLeafColumns().length} 
                className="h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
      </TableBody>
      </UITable>
    </div>
  )
}