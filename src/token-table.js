"use strict";

const e = React.createElement;

function TokenTable(props) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch("/tokens.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Token Number",
        accessor: "tokenId", // accessor is the "key" in the data
      },
      {
        Header: "Rarity",
        accessor: "rarity",
        sortType: "basic",
      },
      {
        Header: "Pixel",
        accessor: "image",
        Cell: ({ value }) => {
          return <img src={value} />;
        },
      },
    ],
    []
  );

  const tableInstance = ReactTable.useTable(
    { columns, data },
    ReactTable.useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    // apply the table props
    <table {...getTableProps()}>
      <thead>
        {
          // Loop over the header rows
          headerGroups.map((headerGroup) => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column) => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps()}>
                    {
                      // Render the header
                      column.render("Header")
                    }
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {
          // Loop over the table rows
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {
                  // Loop over the rows cells
                  row.cells.map((cell) => {
                    // Apply the cell props
                    return (
                      <td {...cell.getCellProps()}>
                        {
                          // Render the cell contents
                          cell.render("Cell")
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
}

const domContainer = document.querySelector("#root");
const root = ReactDOM.createRoot(domContainer);
root.render(e(TokenTable));
