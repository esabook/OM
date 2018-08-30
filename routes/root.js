/*
TODO: FIXME TO AUTOMAPPING CONTROLLER
*/
var express = require('express'),
    router = express.Router();


//USER
var userController = require('../app/controller/userController');
var user = '/user';
router.get(`${user}/info`,          userController.user_info);
router.post(`${user}/auth`,         userController.user_auth);
router.post(`${user}/create`,         userController.user_create);
router.post(`${user}/:user_id/delete`,         userController.user_delete);
router.post(`${user}/:user_id/update`,         userController.user_update);

router.use('/ticket', require('../app/controller/ticketController'));
router.use('/comment', require('../app/controller/commentController'));

module.exports = router;