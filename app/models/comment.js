//TODO comment model list builder for by related info (by parent, by ticket, sorted, pagination, chunked/stream, custom query)

var schema = require('./basic_shema')
var tableName = 'comment';
class comment extends schema{
    constructor(
        //index
        partitionKey, rowKey, 
        //content
        content, created_by, created_by_name, tags){
        
            //Assigning
            super(tableName, partitionKey, rowKey, undefined, undefined)
            this.Content = content;
            this.Created_by = created_by;
            this.Created_by_name = created_by_name;
            this.Created_date = new Date().toISOString();
            this.Tags = tags;
    }

    /**
     * Entity Descriptor for table transaction
     */
    getEntityDecriptor(){
        var commentEntity = {
            PartitionKey:   this.db.entityGen.String(this.PartitionKey),
            RowKey:         this.db.entityGen.String(this.RowKey),
            Content:        this.db.entityGen.String(this.Content),
            Created_by:     this.db.entityGen.String(this.Created_by),
            Created_by_name:this.db.entityGen.String(this.Created_by_name),
            Created_date:   this.db.entityGen.DateTime(this.Created_date),
            Tags:           this.db.entityGen.String(this.Tags),
        };
        return commentEntity;
    }

    
}

module.exports = comment;