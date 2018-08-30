var schema = require('./basic_shema')
var tableName = 'counter';

class counter extends schema{
    constructor(
        //index
        partitionKey, rowKey, lastUID){
            //Assigning
            super(tableName, partitionKey, rowKey);
            this.lastUID = lastUID;
    }

    /**
     * Entity Descriptor for table transaction
     */
    getEntityDecriptor(){
        var counterEntity = {
            PartitionKey:   this.db.entityGen.String(this.PartitionKey),
            RowKey:         this.db.entityGen.String(this.RowKey),
            lastUID:        this.db.entityGen.Int64(this.lastUID),
        };
        return counterEntity;
    }    
}

module.exports = counter;