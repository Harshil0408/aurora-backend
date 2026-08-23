const tableExists = async (queryInterface, tableName) => {
  const tables = await queryInterface.showAllTables();
  return tables.some((table) => String(table).toLowerCase() === String(tableName).toLowerCase());
};

const getColumns = async (queryInterface, tableName) => {
  return queryInterface.describeTable(tableName);
};

const columnExists = async (queryInterface, tableName, columnName) => {
  const columns = await getColumns(queryInterface, tableName);
  return Object.prototype.hasOwnProperty.call(columns, columnName);
};

const addColumns = async (queryInterface, tableName, columns = {}) => {
  const results = {};
  for (const [columnName, definition] of Object.entries(columns)) {
    if (await columnExists(queryInterface, tableName, columnName)) {
      results[columnName] = 'skipped (already exists)';
      continue;
    }
    await queryInterface.addColumn(tableName, columnName, definition);
    results[columnName] = 'added';
  }
  return results;
};

const removeColumns = async (queryInterface, tableName, columnNames = []) => {
  const results = {};
  for (const columnName of columnNames) {
    if (!(await columnExists(queryInterface, tableName, columnName))) {
      results[columnName] = 'skipped (does not exist)';
      continue;
    }
    await queryInterface.removeColumn(tableName, columnName);
    results[columnName] = 'removed';
  }
  return results;
};

const modifyColumns = async (queryInterface, tableName, columns = {}) => {
  const results = {};
  for (const [columnName, definition] of Object.entries(columns)) {
    if (!(await columnExists(queryInterface, tableName, columnName))) {
      results[columnName] = 'skipped (does not exist)';
      continue;
    }
    await queryInterface.changeColumn(tableName, columnName, definition);
    results[columnName] = 'modified';
  }
  return results;
};

const syncTableColumns = async (queryInterface, tableName, operations = {}) => {
  const results = {};
  if (operations.add && Object.keys(operations.add).length > 0) {
    results.added = await addColumns(queryInterface, tableName, operations.add);
  }
  if (operations.modify && Object.keys(operations.modify).length > 0) {
    results.modified = await modifyColumns(queryInterface, tableName, operations.modify);
  }
  if (operations.remove && operations.remove.length > 0) {
    results.removed = await removeColumns(queryInterface, tableName, operations.remove);
  }
  return results;
};

module.exports = {
  tableExists,
  getColumns,
  columnExists,
  addColumns,
  removeColumns,
  modifyColumns,
  syncTableColumns,
};
