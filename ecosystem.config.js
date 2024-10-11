module.exports = {
    apps: [{
        name: 'backend', // Замените  на  имя  вашего  backend
        script: 'server.js', // Замените  на  имя  файла  с  точкой  входа  вашего  backend 
        watch: false, //  Укажите  true,  если  вы  хотите,  чтобы  PM2  отслеживал  изменения  файлов
        env: {
            NODE_ENV: 'production' //  Установите  переменную  окружения  для  production
        }
    }]
};