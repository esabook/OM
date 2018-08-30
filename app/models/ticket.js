
var schema = require('./basic_shema')
var tableName = 'ticket';
class ticket extends schema{
    constructor(
        //index
        partitionKey = null, rowKey=null, 
        //content
        assigned_to = null, title=null, content=null, priority=null, infos=null, status='New', type, category,
        //basic data
        created = {Date:new Date().toISOString(), By:'SYSTEM'}, modified = undefined){
        
            //Assigning
            super(tableName, partitionKey, rowKey, created, modified)
            this.Assigned_to = assigned_to;
            this.Title = title;
            this.Content = content;
            this.Infos = infos;
            this.Priority = priority
            this.Status = status;
            this.Type = type;
            this.Category = category;
    }

    /**
     * Entity Descriptor for table transaction
     */
    getEntityDecriptor(){
        var ticketEntity = {
            PartitionKey:   this.db.entityGen.String(this.PartitionKey),
            RowKey:         this.db.entityGen.String(this.RowKey),
            Title:          this.db.entityGen.String(this.Title),
            Created:        this.db.entityGen.String(this.Created),
            Modified:       this.db.entityGen.String(this.Modified),
            Assigned_to :   this.db.entityGen.String(this.Assigned_to),
            Content :       this.db.entityGen.String(this.Content),
            Status:         this.db.entityGen.String(this.Status),
            Infos :         this.db.entityGen.String(this.Infos),
            Priority :      this.db.entityGen.String(this.Priority),
            Type:           this.db.entityGen.String(this.Type),
            Category:       this.db.entityGen.String(this.Category)
        };
        return ticketEntity;
    }

    
}

module.exports = ticket;