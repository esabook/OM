var schema = require('./basic_shema')
var tableName = 'history';

class history extends schema{
    constructor(category, RowKey, audit_action, audit_by_id, audit_by_name, value){
        super(tableName, `${category}_${RowKey}`, aui)
        this.Action_action = action;
        this.Value = value;
    }

    /**
     * Entity Descriptor for table transaction
     */
    getEntityDescriptor(){
        var historyEntity = {
            PartitionKey: this.db.entityGen.String(this.PartitionKey),
            RowKey:this.db.entityGen.String(this.RowKey),
            Audit_action: this.db.entityGen.String(this.Profile),
            Audit_by_id: this.db.entityGen.String(this.Roles),
            Audit_by_name: this.db.entityGen.String(this.Roles),
        };
        return userEntity;
    }

    
}

module.exports = user;