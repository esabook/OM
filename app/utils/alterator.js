
/**
* Adds paddings to a string. 
* @ignore 
* 
* @param {string}   str              The input string. 
* @param {int}      len              The length of the string. 
* @return {string} 
*/
exports.zeroPaddingString = function zeroPaddingString(str, len) {
    var paddingStr = '00' + str;
    if (paddingStr.length < len) {
      return zeroPaddingString(paddingStr, len);
    } else {
      return paddingStr.substr(-1 * len);
    }
  }

