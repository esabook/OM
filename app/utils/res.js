var fs = require('fs');
class res{
    /**
     * Get json resource by name
     * @param {*} relative filename 
     */
    static readRes(filename){
        var res = JSON.parse(fs.readFileSync(filename, 'utf8'));
        return res;
    }

    /**
     * get string resource
     */
    static stringRes(){
        return this.readRes('./app/res/string.json')
    }

}

module.exports = res;