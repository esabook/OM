var c = require('./controller'); 
var t = require('../models/ticket');
var db = require('../utils/db');
var r =  require('../utils/res');

/**
 * fast get ticket info
 * param: ticket_id
 * query: parent_id
 * @param {*} req 
 * @param {*} res 
 */
exports.ticket_info = function(req, res){
    var ticketInfo = new t();
    ticketInfo.retrive(req.query.parent_id ? req.query.parent_id : '', req.params.ticket_id, (error, result, resp)=>{
        res.send( 
            new c.responseBuilder(
                error ? error : null, 
                error ? null : resp.body, 
                ! error))
    })
};

/**
 * get ticket list
 * query: field     get specific field only. ex. `field1,field2,field`
 *        filter    eg. filter={"Priority eq ? ":"Medium", "RowKey eq ? or RowKey eq ?":["1526115531293","1526115406511"]} 
 * @param {*} req 
 * @param {*} res 
 */
exports.ticket_list = function(req, res){
    
    var nextTokenName = "continuation-token";
    var limit = req.query['limit'];
    var where = req.query['filter'];
    var field = req.query['field'];


    var continuationToken = req.query[ nextTokenName ] ? JSON.parse( decodeURI( req.query[ nextTokenName ])) : null;
    var tableQ = new db.queryBuilder(limit, where, field)
    //TODO memory bog, change this to impl garbage/unbuffered stream or chunked mode
   
    new t().runPageQuery(tableQ, continuationToken , (error, result, response)=>{
        try{ 
            continuationToken = result.continuationToken; 
        }catch(ex){}

        res.send( 
            new c.responseBuilder(
                error ? error : {
                    limit : limit,
                    "continuation-token" : continuationToken ? encodeURI( JSON.stringify( continuationToken)) : null }, 
                error ? null : response.body.value, 
                ! error))
        
        
    })
};

exports.ticket_actives = function (req, res, next) { 
    res.send('TODO actives')
};

exports.ticket_pendings = function (req, res, next) { 
    res.send('TODO pending')
};

exports.ticket_completes = function (req, res, next) { 
    res.send('TODO completes')
};

exports.ticket_archived = function (req, res, next) { 
    res.send('TODO archive')
};



/**
 * Create new ticket
 * body:{
 *          "parent_id":""
 *          "assigned_to":""
 *          "title":""
 *          "content":""
 *          "priority":""
 *          "infos":""
 *          "status":""
 *          "type":""
 *          "category":""
 *      }
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.ticket_create = function (req, res, next) {
    var b = req.body;
    var ticketInfo = new t( 
        b.parent_id, 
        undefined, 
        b.assigned_to, 
        b.title, 
        b.content,
        b.priority, 
        b.infos, 
        b.status,
        b.type,
        b.category,
        {Date:new Date().toISOString(), By:'user_id'});
    ticketInfo.insert(ticketInfo.getEntityDecriptor(),(error, result, resp)=>{
        res.send( 
            new c.responseBuilder(
                error ? error : null, 
                error ? null : resp.body, 
                ! error))
    })
};

/**
 * Deleting single ticket
 * param: ticket_id
 * query: parent_id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.ticket_delete = function (req, res, next) { 
    var ticketInfo = new t(
        req.query.parent_id ? req.query.parent_id : '',
        req.params.ticket_id
    );
    var entity = ticketInfo.getEntityDecriptor();
    ticketInfo.delete(entity, (error, resp) => {
        res.send( 
            new c.responseBuilder(
                error ? error : r.stringRes()['successfully-deleted'], 
                null,
                ! error))
    })
};
/**
 * Update existing ticket
 * params: ticked_id
 * body: {
 *          "assigned_to":""
 *          "priority":""
 *          "infos":""
 *          "status":""
 *          "type":""
 *          "category":""
 *       }
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.ticket_update = function (req, res, next) { 
    var b = req.body;
    var ticketInfo = new t( 
        req.query.parent_id ? req.query.parent_id : '',
        req.params.ticket_id, 
        b.assigned_to, 
        undefined, 
        undefined, 
        b.priority, 
        b.infos,
        b.status,
        b.type,
        b.category,
        undefined,
        {Date:new Date().toISOString(), By:'user_id'});

    var entity = ticketInfo.getEntityDecriptor();
    delete entity.Created;
    delete entity.Title;
    delete entity.Content;
    ticketInfo.update(entity, (error, result, resp)=>{
        ticketInfo.retrive(ticketInfo.PartitionKey, ticketInfo.RowKey, (erro, rslt, rspn)=>{
            res.send( 
            new c.responseBuilder(
                error ? error : r.stringRes()['successfully-updated'], 
                error ? null : rspn.body , 
                ! error));
        
        })
        
    });
    
};