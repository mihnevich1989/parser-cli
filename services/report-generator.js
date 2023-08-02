import TableInfo from '../helpers/DataSummary.js';
import { performance } from 'perf_hooks';

const ReportGenerator = (file, total, fileSize, checked, fails, startTime) => {
  let responseTime = ((performance.now() - startTime) / 1000).toFixed(2);
  const summary = new TableInfo(file, total, fileSize, Number(checked), fails, Number(responseTime));
  console.table(summary);
};

export { ReportGenerator };
