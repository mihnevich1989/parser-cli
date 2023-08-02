import TableInfo from '../helpers/DataSummary.js';

const ReportGenerator = (file, total, fileSize, checked, fails) => {
  const summary = new TableInfo(file, total, fileSize, Number(checked), fails);
  console.table(summary);
};

export { ReportGenerator };
