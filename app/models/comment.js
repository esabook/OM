//TODO comment model list builder for by related info (by parent, by ticket, sorted, pagination, chunked/stream, custom query)

var schema = require('./basic_shema')
var tableName = 'comment';
class comment extends schema{
    constructor(
        //index
        partitionKey, rowKey, 
        //content
        content, created_by, tags){
        
            //Assigning
            super(tableName, partitionKey, rowKey, created_by)
            this.Content = content;
            this.Tags = tags;
    }

    /**
     * Entity Descriptor for table transaction
     */
    getEntityDescriptor(){
        var commentEntity = {
            PartitionKey:   this.db.entityGen.String(this.PartitionKey),
            RowKey:         this.db.entityGen.String(this.RowKey),
            Content:        this.db.entityGen.String(this.Content),
            Created_by:     this.db.entityGen.String(this.Created_by),
            Tags:           this.db.entityGen.String(this.Tags),
        };
        return commentEntity;
    }

    
}

module.exports = comment;