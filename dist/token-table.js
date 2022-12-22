"use strict";

const e = React.createElement;

function TokenTable(props) {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    fetch("/tokens.json").then(response => response.json()).then(data => {
      setData(data);
    });
  }, []);
  const columns = React.useMemo(() => [{
    Header: "Token Number",
    accessor: "tokenId" // accessor is the "key" in the data

  }, {
    Header: "Rarity",
    accessor: "rarity",
    sortType: "basic"
  }, {
    Header: "Pixel",
    accessor: "image",
    Cell: ({
      value
    }) => {
      return /*#__PURE__*/React.createElement("img", {
        src: value
      });
    }
  }], []);
  const tableInstance = ReactTable.useTable({
    columns,
    data
  }, ReactTable.useSortBy);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInstance;
  return (
    /*#__PURE__*/
    // apply the table props
    React.createElement("table", getTableProps(), /*#__PURE__*/React.createElement("thead", null, // Loop over the header rows
    headerGroups.map(headerGroup =>
    /*#__PURE__*/
    // Apply the header row props
    React.createElement("tr", headerGroup.getHeaderGroupProps(), // Loop over the headers in each row
    headerGroup.headers.map(column =>
    /*#__PURE__*/
    // Apply the header cell props
    React.createElement("th", column.getHeaderProps(), // Render the header
    column.render("Header")))))), /*#__PURE__*/React.createElement("tbody", getTableBodyProps(), // Loop over the table rows
    rows.map(row => {
      // Prepare the row for display
      prepareRow(row);
      return (
        /*#__PURE__*/
        // Apply the row props
        React.createElement("tr", row.getRowProps(), // Loop over the rows cells
        row.cells.map(cell => {
          // Apply the cell props
          return /*#__PURE__*/React.createElement("td", cell.getCellProps(), // Render the cell contents
          cell.render("Cell"));
        }))
      );
    })))
  );
}

const domContainer = document.querySelector("#root");
const root = ReactDOM.createRoot(domContainer);
root.render(e(TokenTable));