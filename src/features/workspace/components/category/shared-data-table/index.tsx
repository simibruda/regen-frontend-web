import { flexRender, type Table } from '@tanstack/react-table'

type SharedDataTableProps<TData> = {
  table: Table<TData>
  emptyMessage: string
}

export function SharedDataTable<TData>({ table, emptyMessage }: SharedDataTableProps<TData>) {
  const colSpan = table.getAllLeafColumns().length

  return (
    <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-border/80 text-sm shadow-sm">
      <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="border-b border-border px-3 py-2.5 font-semibold">
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.length === 0 ? (
          <tr>
            <td colSpan={colSpan} className="px-3 py-8 text-center text-muted-foreground">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-card transition-colors hover:bg-secondary/30">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-b border-border px-3 py-2.5 text-foreground">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
