export const DataTable = ({ columns, rows, emptyMessage, actions }) => (
  <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
          {actions ? <th>Ações</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length + (actions ? 1 : 0)}>{emptyMessage}</td>
          </tr>
        ) : (
          rows.map((row) => (
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
);
