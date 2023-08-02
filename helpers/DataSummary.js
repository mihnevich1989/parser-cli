export default class DataSummary {
  constructor(file, total, fileSize, checked, failCount) {
    this["Файл"] = file;
    this["Всего ссылок в файле"] = total;
    this["Размер файла (mb)"] = fileSize
    this["Проверенных"] = checked;
    this["Количество ошибок"] = failCount;
  }
};
