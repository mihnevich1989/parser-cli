# Установить зависимости: 
__npm i__
# Команда для запуска: 
__npm run parser {{arg 1: domain/}} {{arg 2: sitemap link}} {{total checks (по умолчанию 300, параметр не обязательный)}}__
# Пример запуска: 
__npm run parser https://test.example.com/ https://example.com/sitemaps/yoursitemap.xml 100__
# Пример запуска отдельного файла gz сайтмапы:
__npm run parser https://test.example.com/ https://example.com/sitemaps/yoursitemapfile.xml.gz 100__
# Команда для запуска с subdomain: 
__npm run parser {{arg 1: domain/}} {{arg 2: sitemap link}} {{arg 3: total checks (обязательный, при запуске с subdomain)}} {{ arg 4: subdomain}}__
# Пример запуска с subdomain:
__npm run parser https://test.example.com/ https://example.com/sitemaps/yoursitemapfile.xml.gz 300 https://test.example.com/__
-----
