export default class DataSummary {
  constructor(file, total, fileSize, checked, failCount, responseTime) {
    this["Файл"] = file;
    this["Всего ссылок в файле"] = total;
    this["Размер файла (мб)"] = fileSize
    this["Проверенных"] = checked;
    this["Количество ошибок"] = failCount;
    this["Время прогона, (c)"] = responseTime;
  }
};
