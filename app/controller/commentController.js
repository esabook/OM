var c = require('./controller'); 
var m = require('../models/comment');
var r = require('../utils/res');
var db = require('../utils/db');
var route = c.express.Router();

/**
 * Read TableName, PartitionKey, RowKey 
 * type_commentedId+parentCommentedId
 * @param {*} string 
 */
var comment_for = function commentFor(string){
    var commentData = {}
    try{
        //get type => table name
        //get commented_id
        //get parent_commented_id
        commentData.CommentForType = String(string).split('_')[0]
        commentData.CommentedKeyParent = String(string).split('_')[1].split('+')
        commentData.CommentedId = commentData.CommentedKeyParent[0]
        commentData.CommentedParent = Array( commentData.CommentedKeyParent).length == 2 ? commentData.CommentedKeyParent[1] : "";
    }catch(ex){
        commentData = null
    }
    return commentData;
}
/**
 * 
 * create new comment
 * param: comment_for:  if `commented_id` is as child, 
 *                      got `cf`_`commented_id`+`parent_commented_id` as `commented_id`
 *                      where `cf` is like ticket_id/role_id/etc.
 * 
                        e.g ticket_000000comentedid01+000000asparentid01
                            type  _commented_id      +parent_commented_id
 * body:  
 *      "parent_id":""
 *      "content":"what is?"
 *      "created_by":""
 *      "created_by_name":""
 *      "created_by_date":""
 *      "tags":"meter, electricity, tamper, protect"
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
route.post('/:comment_for/create', function comment_create(req, res, next){
    var b = req.body;
    
    //read comment_for params
    var paramCommentFor = req.params["comment_for"];
    var commentFor = comment_for(paramCommentFor);
    var failureResponse = function(msg_identity){
         return new c.responseBuilder(
                    r.stringRes()['invalid-request']+` [${msg_identity}]`,
                    null,
                    false
        )}
    if (!commentFor){
        res.send( failureResponse('Param') )
        return;
    }
    
    //check comment for avaibility, for 'comment for whos', may ticket/role/etc
    //FIXME: change this to call other existing route with best practice & performance :)
    var checkCommentForEntity = new m()
    checkCommentForEntity.TableName = commentFor.CommentForType;
    
    checkCommentForEntity.retrive(commentFor.CommentedParent, commentFor.CommentedId, (err, rslt, respn)=>{
        if (err){
            res.send( failureResponse('Object') )
            return
        }
        //create comment object for DB transaction
        var commentData = new m(
            paramCommentFor,
            //newid or parent_id-newid
            `${b.parent_id ? `${b.parent_id}_` : ''}${ new db.guidGenerator().GUID}`, 
            b.content,
            'user_id',
            'user_name',
            b.tags
        );
        
    
        commentData.insert(commentData.getEntityDecriptor(), function(error, result, response){
            res.send(
                new c.responseBuilder(
                    error ? error: null,
                    error ? null : response.body,
                    ! error
                )
            )
        })
        
    })
})

/**
 * get all comment by specific `comment_for` param
 * param: comment_for:  if `commented_id` is as child, 
 *                      got `cf`_`commented_id`+`parent_commented_id` as `commented_id`
 *                      where `cf` is like ticket_id/role_id/etc.
 * 
                        e.g ticket_000000comentedid01+000000asparentid01
                            type  _commented_id      +parent_commented_id
 * 
 */
route.get('/:comment_for/list', function comment_list(req, res, next){
    var nextTokenName = "continuation-token";
    var paramCommentFor = req.params["comment_for"];
    var limit = req.query['limit'];
    var where = req.query['filter'];
    var field = req.query['field'];
    
    where = where ? JSON.parse(String(where)) : {};
    where = Object.assign(where, {"PartitionKey eq ?" : paramCommentFor, "RowKey ne ?" : "maybe#not#this#"})

    var continuationToken = req.query[ nextTokenName ] ? JSON.parse( decodeURI( req.query[ nextTokenName ])) : null;
    var tableQ = new db.queryBuilder(limit, where, field)

    new m().runPageQuery(tableQ, continuationToken , (error, result, response)=>{
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
})

route.post('/:comment_for/delete', function comment_delete(req, res, next){
    //TODO
})

module.exports = route;
