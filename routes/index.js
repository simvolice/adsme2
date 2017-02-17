/**
 * Здесь настраиваем роутеры, разделяем на файлы
 *
 */
module.exports = function (app) {
    app.use('/', require('./authrouter'));
    app.use('/', require('./videorouter'));
    app.use('/', require('./searchrouter'));
    app.use('/', require('./schedulingOfShowVideoRouter'));
    app.use('/', require('./notificationRouter'));
    app.use('/', require('./onairRouter'));

};