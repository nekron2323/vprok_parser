## vprok_parser

### Описание
Парсер сайта [vprok.ru](https://vprok.ru/). Получает текущую цену товара по региону, старую, оценку и количество отзывов

### Технологии
NodeJS
puppeteer

### Запуск проекта
Клонировать репозиторий
```
git clone https://github.com/nekron2323/vprok_parser
```
Перейти в папку vprok_parser
```
cd vprok_parser
```
Установить зависимости
```
npm install
```
Запустить проект
```
node index.js <URL> <REGION>
```
где URL - ссылка на товар, REGION - необходимый регион
Например
```
node index.js https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202 "Санкт-Петербург и область"
```
