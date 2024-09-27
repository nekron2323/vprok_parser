const parser = require('./parser')

const [URL, REGION] = process.argv.slice(2)

if (!(URL && REGION)) console.log('Неверно указаны аргументы')
else parser(URL, REGION)