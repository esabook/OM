var _db_ = require('../utils/db');
var options = {payloadFormat: "application/json;odata=nometadata"}; //_db_.storage.TableUtilities.PayloadFormat.NO_METADATA;

class basic_scheme {
    constructor(tablename, partitionKey = '', rowKey, created_by = 'SYSTEM',  modified_date = '', modified_by = '') {
        this.TableName      = tablename;
        //built-in
        this.PartitionKey   = partitionKey ? String(partitionKey) : '';
        this.RowKey         = rowKey ? String(rowKey) : new _db_.guidGenerator().GUID;
        //basic
        this.Created_by     = created_by;
        this.Modified_date  = modified_date;
        this.Modified_by    = modified_by;
        
        this.db             = _db_;
    }

     /**
     * merge operation
     * @param {*} callbackFuntion (`error`, `result`, `response`)
     */
    insert(entityDecriptor, callbackFuntion ){
        this.db.storageClient.insertEntity(this.TableName, entityDecriptor, Object.assign ({echoContent:true}, options), callbackFuntion)
    }

    /**
     * 
     * @param {*} callbackFuntion  (`error`, `result`)
     */
    update(entityDecriptor, callbackFuntion ){
        this.db.storageClient.mergeEntity(this.TableName, entityDecriptor, callbackFuntion)
    }

    /**
     * 
     * @param {*} callbackFuntion  (`error`, `response`)
     */
    delete( entityDecriptor, callbackFuntion ){
        this.db.storageClient.deleteEntity(this.TableName, entityDecriptor, callbackFuntion)
    }

      /**
     * get single data
     * @param {*} callbackFuntion (`error`, `result`, `response`)
     */
    retrive( partitionKey = this.PartitionKey, rowKey = this.RowKey , callbackFuntion ){
        this.db.storageClient.retrieveEntity(this.TableName, partitionKey, rowKey, options, callbackFuntion )
    }

    /** 
    * Runs a table query with specific page size and continuationToken
    * @ignore 
    * 
    * @param {TableQuery}             tableQuery        Query to execute
    * @param {TableContinuationToken} continuationToken Continuation token to continue a query
    * @param {function}               callback          Additional sample operations to run after this one completes `error, result, response`
    */
    runPageQuery(tableQuery, continuationToken, callback) {
        const c = this.db.storageClient.queryEntities(this.TableName, tableQuery, continuationToken, options, function (error, result, response) {
            if (error) return callback(error);
            callback(error, result, response);            
        });
    }

}

module.exports = basic_scheme;
