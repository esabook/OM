
/**
 * json response contruction
 * ex. template
 * {
 *   "status": boolean,
 *   "tag": message/other_metadata,
 *   "data": {"any, []{}, int}
 * }
 */
class response {
    constructor(tagOnBody = '', dataOnBody = '', successOnBody = false){
        return {
            status: successOnBody,
            msg: tagOnBody ? tagOnBody : '',
            data: dataOnBody==null || dataOnBody==undefined ? {} : dataOnBody
        }
    }
   
}

module.exports = response;