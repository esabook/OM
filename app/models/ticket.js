var schema      = require('./basic_shema');
var counter     = require('../models/counter');

var tableName   = 'ticket';

class ticket extends schema{
    constructor(
        //index
        partitionKey, rowKey, uid = 0,
        //content
        assigned_to, title, subject, issue, priority, status = "New", type, category, tags,
        //basic data
        created_by, modified_by, modified_date){
            //Assigning
            super(tableName, partitionKey, rowKey, created_by, modified_date, modified_by);
            this.UID            = uid;
            this.Assigned_to    = assigned_to;
            this.Title          = title;
            this.Subject        = subject;
            this.Issue          = issue;
            this.Priority       = priority;
            this.Status         = status;
            this.Type           = type;
            this.Category       = category;
            this.Tags           = tags;
    };


    /**
     * UID generator
     * 
     * return `result`
     */
    getEntityDescriptorWithNewUID(callback = (objectModel, result)=>{}){
        var Counter        = new counter(tableName, 'UID');
       Counter.retrive(undefined, undefined, (error, result, response)=>{
           this.UID = response.body.lastUID + 1;
           callback (Counter, this.getEntityDescriptor());
        });
    };


    /**
     * Entity Descriptor for table transaction
     */
    getEntityDescriptor(){
        var ticketEntity = {
            PartitionKey:   this.db.entityGen.String(this.PartitionKey),
            RowKey:         this.db.entityGen.String(this.RowKey),
            UID:            this.db.entityGen.Int64(this.UID),
            Created_by:     this.db.entityGen.String(this.Created_by),
            Modified_date:  this.db.entityGen.String(this.Modified_date),
            Modified_by:    this.db.entityGen.String(this.Modified_by),

            Assigned_to :   this.db.entityGen.String(this.Assigned_to),
            Title:          this.db.entityGen.String(this.Title),
            Subject:        this.db.entityGen.String(this.Subject),
            Issue :         this.db.entityGen.String(this.Issue),
            Priority :      this.db.entityGen.String(this.Priority),
            Status:         this.db.entityGen.String(this.Status),
            Type:           this.db.entityGen.String(this.Type),
            Category:       this.db.entityGen.String(this.Category),
            Tags:           this.db.entityGen.String(this.Tags),
        };
        return ticketEntity;
    };   

   
};

module.exports = ticket;