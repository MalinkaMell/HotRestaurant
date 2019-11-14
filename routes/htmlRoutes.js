const path = require('path');

module.exports = function (app) {
    //html routes
    app.get('/', function (request, response) {
        response.sendFile(path.join(__dirname, '../public/home.html'))
    });

    app.get('/view', function (request, response) {
        response.sendFile(path.join(__dirname, '../public/view.html'))
    });

    app.get('/make', function (request, response) {
        response.sendFile(path.join(__dirname, '../public/make.html'))
    });
    //end html routes
}


