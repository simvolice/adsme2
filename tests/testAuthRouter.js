/**
 * Created by Nikita on 16.01.2017.
 */

var chai = require('chai');



var expect = chai.expect;


var chaiHttp = require('chai-http');
chai.use(chaiHttp);
const objParams = {
    email: 'pauk_1996@mail.ru',
    pass: 'FullPass!@@@231'
};
const objParamsError = {
    email: 'pauk_1996@mai',
    pass: 'FullPas31'
};


describe('Тестируем api /register', function() {

    it('Хотим проверить свойства code', function(done) { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .post('/register')
            .send({email: objParams.email, pass: objParams.pass})
            .end(function(err, res) {
                console.log(res.body);
                expect(res.body).to.have.property("code", "ok");
                done();                               // <= Call done to signal callback end
            });
    }) ;


});

//TODO Дописать тесты на connect и другие ошибки
describe('Агресивное тестирование api /register', function() {

    it('Хотим проверить свойства code для email', function(done) { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .post('/register')
            .send({email: objParamsError.email, pass: objParams.pass})
            .end(function(err, res) {
                console.log(res.body);
                expect(res.body).to.have.property("code", "emailWrongRegExp");
                done();                               // <= Call done to signal callback end
            });
    }) ;
    it('Хотим проверить свойства code для password', function(done) { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .post('/register')
            .send({email: objParams.email, pass: objParamsError.pass})
            .end(function(err, res) {
                console.log(res.body);
                expect(res.body).to.have.property("code", "passWrongRegExp");
                done();                               // <= Call done to signal callback end
            });
    }) ;

});

describe.skip('Тестируем api /login', function() {

    it('Хотим проверить свойства code и token', function(done) { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .post('/login')
            .send({email: objParams.email, pass: objParams.pass})
            .end(function(err, res) {
                expect(res.body).to.have.property("code").and.to.have.property("token");
                done();                               // <= Call done to signal callback end
            });
    }) ;

});
/*
describe('Тестируем api /verifemail', function() {

    it('Хотим проверить свойства code и token', function(done) { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/login')
            .end(function(err, res) {


                expect(res.body).to.have.property("count");
                done();                               // <= Call done to signal callback end
            });
    }) ;

});
describe('Тестируем api /resetpass', function() {

    it('Хотим проверить свойства code и token', function(done) { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/login')
            .end(function(err, res) {


                expect(res.body).to.have.property("count");
                done();                               // <= Call done to signal callback end
            });
    }) ;

});
describe('Тестируем api /veriftoken', function() {

    it('Хотим проверить свойства code и token', function(done) { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/login')
            .end(function(err, res) {


                expect(res.body).to.have.property("count");
                done();                               // <= Call done to signal callback end
            });
    }) ;

});
describe('Тестируем api /setnewpass', function() {

    it('Хотим проверить свойства code и token', function(done) { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/login')
            .end(function(err, res) {


                expect(res.body).to.have.property("count");
                done();                               // <= Call done to signal callback end
            });
    }) ;

});
*/




