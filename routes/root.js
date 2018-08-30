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
/**
 * @swagger
 * /user/:user_id/update (TODO CREATE GENERATOR):
 *  post:
 *      description: Deleting user account
 *      produces:
 *              - application/json
 *      parameters:
 *              - name: user_id
 *                description: for now is as ==> username
 *                required: true
 *                type: string
 * 
 *              - name: profile
 *                description: this is key:value for storing multiple user info in single name may account info of `canopy`, `azure`, `email`, etc.
 *                type: string
 *                in: formData
 * 
 *              - name: roles
 *                description: role for user access identity
 *                in: formData
 *      responses:
 *              200:
 *                description: updated / not
 *              
 */
router.post(`${user}/:user_id/update`,         userController.user_update);

//TICKET
var ticketController = require('../app/controller/ticketController');
var ticket = '/ticket';
router.post(`${ticket}/create`,     ticketController.ticket_create);
router.post(`${ticket}/:ticket_id/update`, ticketController.ticket_update);
router.post(`${ticket}/:ticket_id/delete`, ticketController.ticket_delete);

router.get(`${ticket}/:ticket_id/info`,    ticketController.ticket_info);
router.get(`${ticket}/list`,        ticketController.ticket_list);
router.get(`${ticket}/actives`,     ticketController.ticket_actives);
router.get(`${ticket}/pendings`,    ticketController.ticket_pendings);
router.get(`${ticket}/completes`,   ticketController.ticket_completes);
router.get(`${ticket}/archived`,    ticketController.ticket_archived);

//COMMENT
router.use('/comment', require('../app/controller/commentController'));
module.exports = router;