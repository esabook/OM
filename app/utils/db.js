var storage_ = require('azure-storage');
var config = require('../config');
const guid_ = require('node-uuid');
/**
 * TODO add suuport to custom req.query to handle querying a subset of entity prop
 * 
 * supported for now
 * eg. filter={"Priority eq ? ":"Medium", "RowKey eq ? or RowKey eq ?":["1526115531293","1526115406511"]}
 * 
 * @param {*} limit 
 * @param {*} where 
 * @param {*} field 
 */
var queryBuilder = function(limit = 50, where = undefined, field = undefined){
    var tableQ = new storage_.TableQuery()
                                .top(limit ? limit : 50);
    try{
        where = typeof where == "string" ? JSON.parse(String(where)): where;
        var i = 0;
        for (key in where){
            var value = where[key]
            if (i == 0){
                if (Array.isArray(value)) tableQ.where(key, ...value);
                else tableQ.where(key, value);
                i++;
            }else{
                if (Array.isArray(value)) tableQ.and(key, ...value);
                else tableQ.and(key, value);
            }
        };
       
    }catch(ex){}

    try{
        tableQ.select(field.split(','))
    }catch(ex){}

    return tableQ;
}
class guidGenerator{
    constructor(){
         this.GUID = guid_.v1().replace(/-/g, '');
    }
    getString(){
        return this.GUID;
    }
} 

module.exports =  {
    guid: guid_,
    guidGenerator: guidGenerator,
    queryBuilder: queryBuilder,
    storage:storage_,
    entityGen: storage_.TableUtilities.entityGenerator,
    storageClient : storage_.createTableService(config.connectionString)
    
}