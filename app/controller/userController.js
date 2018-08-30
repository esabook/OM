var c = require('./controller'); 
var u = require('../models/user');
var a = require('../../app');

exports.user_info = function(req, res){
    res.status(500);
    res.json({"TODO":'500'});
};

exports.user_auth = function(req, res){
    res.write('TODO auth')
    res.end()
};

exports.user_index = function (req, res, next) { 
    res.send('TODO.')
};

/**
 * User creation endpoint.
 * request body = {parentID, profiles, roles}
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.user_create = function(req, res, next){
    const requestData = req.body;
    var tempNewUser = new u(
        requestData.parent_id, 
        requestData.user_name, 
        requestData.profile, 
        requestData.roles)

    new u().insert( tempNewUser.getEntityDecriptor(), (error, result) => {
        console.log(error)
        res.send( 
            new c.responseBuilder(
                error ? error : null, 
                error ? null : result, 
                ! error))
    })
}

/**
 * delete user by param of path => `user_id`
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.user_delete = function(req, res, next){
    //TODO continue: if user has role to delete this user
    var userInfo = new u( null, req.params.user_id )
    userInfo.delete(userInfo.getEntityDecriptor(), (err, res)=>{
        res.send( 
            new c.responseBuilder(
                error ? error : null, 
                error ? null : result, 
                ! error))
    })
}

/**
 * update user by param of path => `user_id`
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.user_update = function(req, res, next){
    //TODO continue: if user has role to modify this new user info
    var userInfo = new u(
        reg.params.parent_id, 
        req.params.user_id, 
        req.body.profile, 
        req.body.roles)
    userInfo.update(userInfo.getEntityDecriptor(), (error, result)=>{
        res.send( 
            new c.responseBuilder(
                error ? error : null, 
                error ? null : result, 
                ! error))
    })
    

}