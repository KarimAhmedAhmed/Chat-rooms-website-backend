var mocha = require('mocha')
// var describe = mocha.describe
var it = mocha.it
const chai = require('chai');
const chaiHttp = require('chai-http');
const account = require('../routes/account');
const chat = require('../routes/chat');
const { get } = require('../routes/index');
const index = require('../routes/index');
const app = require('../app');
const expect = chai.expect();
var assert = require('chai').assert
const should = chai.should();

chai.use(chaiHttp);




describe('usersIntegrations', () => {

    //test the register api
    describe('POST /register', function () {
        it(`it should be a string`, function (done) {
            const registerData = {
                username: "Karim",
                firstname: "Karim",
                lastname: "Ahmed",
                email: "Karim@gmail.com",
                password: "1234",
            }
            chai.request(app)
                .post('/register')
                .send(registerData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.should.body.message.equal('new user has been registered');
                    done();

                })
        })
    })

    //test the login api with successfull data
    describe('POST /login', function () {
        it(`it should be a string`, function (done) {
            const loginData = {
                username: "Karim",
                password: "1234"
            }
            chai.request(app)
                .post('/login')
                .send(loginData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.should.body.message.equal("logged in successfully");
                    done();


                })
        })
    })

    //test the login api with wrong password
    describe('POST /login', function () {
        it(`it should be a string`, function (done) {
            const loginData = {
                username: "Karim",
                password: "1111"
            }
            chai.request(app)
                .post('/login')
                .send(loginData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.should.body.message.equal("please provide valid username and password");
                    done();


                })
        })
    })

    //test the login api with wrong username
    describe('POST /login', function () {
        it(`it should be a string`, function (done) {
            const loginData = {
                username: "Karim123",
                password: "1234"
            }
            chai.request(app)
                .post('/login')
                .send(loginData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.should.body.message.equal("please provide valid username and password");
                    done();


                })
        })
    })

    //test the login api with invalid username or password
    describe('POST /login', function () {
        it(`it should be a string`, function (done) {
            const loginData = {
                username: "Karim-=1234",
                password: "127--1"
            }
            chai.request(app)
                .post('/login')
                .send(loginData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.should.body.message.equal("invalid username/or password");
                    done();


                })
        })
    })

    
    //test the forgotpassword api with successfull data
    describe('POST /forgotpassword', function () {
        it(`it should be a string`, function (done) {
            const forgetData = {
                email: "Karim@gmail.com"
            }
            chai.request(app)
                .post('/forgotpassword')
                .send(forgetData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.should.body.message.equal('Email Sent');
                    done();


                })
        })
    })
    //test the forgotpassword api with wrong email 
    describe('POST /forgotpassword', function () {
        it(`it should be a string`, function (done) {
            const forgetData = {
                email: "Karim001@gmail.com"
            }
            chai.request(app)
                .post('/forgotpassword')
                .send(forgetData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.should.body.message.equal("Email could not be sent");
                    done();


                })
        })
    })


})

describe('Apis', () => {

    //check if the server is on
    describe('GET /', function () {
        it(`it should be a string`, function (done) {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.should.body.message.equal("Hello");
                    done();


                })
        })
    })


    //test the get rooms 
    describe('GET /rooms', function () {
        it(`it should be a string`, function (done) {
            chai.request(app)
                .get('/rooms')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.body.should.have.property('id').eq(1)
                    res.body.should.have.property('name').eq('python')
                    res.body.length.should.be.eq(5);
                    done();

                })
        })
    })



})

