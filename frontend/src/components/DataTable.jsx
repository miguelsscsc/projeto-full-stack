import { useMemo, useState } from "react";

export const DataTable = ({ columns, rows, emptyMessage, actions, filterPlaceholder }) => {
  const [filter, setFilter] = useState("");

  const filteredRows = useMemo(() => {
    const normalizedFilter = filter.trim().toLowerCase();

    if (!normalizedFilter) {
      return rows;
    }

    return rows.filter((row) =>
      columns.some((column) => {
        const value = column.render ? column.render(row[column.key], row) : row[column.key];
        return String(value ?? "").toLowerCase().includes(normalizedFilter);
      })
    );
  }, [columns, filter, rows]);

  return (
    <div className="data-table">
      <label className="table-filter">
        <span>Filtro</span>
        <input
          type="search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={filterPlaceholder || "Filtrar listagem"}
        />
      </label>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              {actions ? <th>Acoes</th> : null}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)}>{emptyMessage}</td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={`${row.id}-${column.key}`}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions ? <td>{actions(row)}</td> : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
