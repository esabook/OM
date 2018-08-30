var c = require('./controller'); 
var t = require('../models/ticket');
var db = require('../utils/db');
var r =  require('../utils/res');

var router = c.express.Router();


/**
 * Will return all available field.
 * 
 * `PartitionKey` is as `parent_id`, so you can use one of each of them for API transaction.
 */
router.get('/', (req, res, next)=>{
    var guide = new t().getEntityDescriptor()
    delete guide.db;
    var c = Object.getOwnPropertyNames(guide);
    res.send(
        {Field:c}
    )
})


/**
 * Fast get ticket info
 * param: ticket_id
 * query: parent_id
 * 
 * ex. 
 * /xx01/info
 * /xx01/info?PartitionKey=xx00
 */
router.get('/:RowKey/info', function(req, res, next){
    var ticketInfo = new t();
    ticketInfo.retrive(req.query.parent_id ? req.query.parent_id : '', req.params.RowKey, (error, result, resp)=>{
        res.send( 
            new c.responseBuilder(
                error ? error : null, 
                error ? null : resp.body, 
                ! error))
    })
});


/**
 * Fast get ticket info by `PartitionKey.Rowkey`
 * param: PartitionKey, RowKey
 * 
 * ex.
 * /xx0/xx1/info
 */
router.get('/:PartitionKey/:RowKey/info', function (req, res, next){
    req.url = '/:RowKey/info';
    req.query.filter = {PartitionKey : req.params.PartitionKey};
    router.handle(req, res, next);
});

/**
 * get ticket list
 * query: field     get specific field only. ex. `field1,field2,field`
 *        filter    eg. filter={"Priority eq ? ":"Medium", "RowKey eq ? or RowKey eq ?":["1526115531293","1526115406511"]} 
 *  
 */
router.get('/list', function(req, res, next){

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
                    [nextTokenName] : continuationToken ? encodeURI( JSON.stringify( continuationToken)) : null }, 
                error ? null : response.body.value, 
                ! error))
        
        
    })
});


/**
 * Get ticket list by status filter (active, new, pending).
 * G
 *G
 * G
 * G
 * G
 * G
 * G
 */
router.get('/list/:status', function (req, res, next){
    req.url = '/list';
    req.query.filter = {"Status eq ?":req.params.status};
    router.handle(req, res, next);
})


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
router.post('/create', function (req, res, next) {
    var b = req.body;
    var ticketInfo = new t(b.parent_id ? b.parent_id : b.PartitionKey);
        ticketInfo.Assigned_to  = b.assigned_to;
        ticketInfo.Title        = b.title;
        ticketInfo.Subject      = b.subject;
        ticketInfo.Issue        = b.issue ? b.issue : b.Content;
        ticketInfo.Priority     = b.priority;
        ticketInfo.Type         = b.type;
        ticketInfo.Category     = b.category;
        ticketInfo.Tags         = b.tags;
    ticketInfo.getEntityDescriptorWithNewUID((obj,result) => {
        
        ticketInfo.insert(result,(error, result, resp)=>{
            if (! error){
                //TODO update counter now last UID for ticket count
               
            }
            res.send( 
                new c.responseBuilder(
                    error ? error : null, 
                    error ? null : resp.body, 
                    ! error))
        })
    })
});


/**
 * Deleting single ticket
 * param: RowKey
 * query: PartitionKey
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
router.post('/:RowKey/delete', function (req, res, next) { 
    var ticketInfo = new t();
        ticketInfo.PartitionKey = req.query.parent_id ? req.query.parent_id 
                                : req.query.partitionkey ? req.query.partitionkey 
                                : '';
        ticketInfo.RowKey       = req.params.ticket_id;
    
    var entity = ticketInfo.getEntityDescriptor();
    ticketInfo.delete(entity, (error, resp) => {
        res.send( 
            new c.responseBuilder(
                error ? error : r.stringRes()['successfully-deleted'], 
                null,
                ! error))
    })
});

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
router.post('/:RowKey/update', function (req, res, next) { 
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

    var entity = ticketInfo.getEntityDescriptor();
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
    
});

module.exports = router;