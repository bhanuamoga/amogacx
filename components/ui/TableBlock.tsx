// components/ui/TableBlock.tsx
"use client";

export function TableBlock({
  columns,
  rows,
}: {
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-background">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted/60">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className="px-3 py-2 text-left font-medium text-muted-foreground"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2">
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
