var express_ = require('express'); 
var response_ = require('../models/response');
var auth_ = require('../services/auth');

/**
 * packing most/high imported module usage for controller
 */
module.exports ={
    auth: auth_,
    express: express_,
    responseBuilder: response_
}