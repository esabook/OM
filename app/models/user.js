
var schema = require('./basic_shema')
var tableName = 'user';

class user extends schema{
    constructor(parentID, userName, profile, roles){
        super(tableName, parentID, userName)
        this.Profile = profile;
        this.Roles = roles;
    }

    /**
     * Entity Descriptor for table transaction
     */
    getEntityDecriptor(){
        var userEntity = {
            PartitionKey: this.db.entityGen.String(this.PartitionKey),
            RowKey:this.db.entityGen.String(this.RowKey),
            Profile: this.db.entityGen.String(this.Profile),
            Roles: this.db.entityGen.String(this.Roles)
        };
        return userEntity;
    }

    
}

module.exports = user;