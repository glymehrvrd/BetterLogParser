class BetterLogParser {
    constructor() {
    }

    /**
     * @param {String} s
     * @return {Object}
     */
    parse(s) {
        let obj = {}
        this.parseInto(s, obj)
        return obj
    }

    /**
     * @param {String} s
     * @param {Object} obj: output
     */
    parseInto(s, obj) {
        const stack = [];
        let currentObj = {};
        let currentObjArr = [];
        let currentKey = '';
        let currentValue = '';
        let isKey = true;
        let isArray = false;
      
        for (let i = 0; i < s.length; i++) {
          const char = s[i];
      
          if (char === '[') {
            if (currentKey) {
              stack.push({ obj: currentObj, key: currentKey, is_array: isArray });
              currentObj = {};
              currentKey = '';
              isKey = true;
              isArray = false;
            } else {
              throw new Error("expect '[', actually meet '" + char + "'");
            }
          } else if (char === ']' || (char === '|' && currentKey !== '')) {
            if (currentKey) {
              if (isKey) {
                currentObj = currentKey;
              } else {
                currentObj[currentKey] = currentValue;
              }
              currentKey = '';
              currentValue = '';
            }
            if (isArray) {
                currentObjArr.push(currentObj);
                currentObj = currentObjArr;
            }
            if (stack.length > 0) {
              const { obj, key, is_array } = stack.pop();
              obj[key] = currentObj;
              currentObj = obj;
              isArray = is_array;
            }
            isKey = true;
          } else if (char === '=') {
            if (currentKey === "") {
              throw new Error("empty key");
            }
            if (currentValue) {
              throw new Error("value is set before key");
            }
            isKey = false;
          } else if (char === '|') {
            isKey = true;
          } else if (char === ',' && i + 1 < s.length && s[i + 1] === ' ') {
            if (currentKey) {
              if (isKey) {
                currentObj = currentKey;
              } else {
                currentObj[currentKey] = currentValue;
              }
              currentKey = '';
              currentValue = '';
            }
            currentObjArr.push(currentObj);
            currentObj = {};
            i++;
            isArray = true;
            isKey = true;
          } else {
            if (isKey) {
              currentKey += char;
            } else {
              currentValue += char;
            }
          }
        }

        if (currentKey !== '') {
          if (isKey) {
            currentObj = currentKey;
          } else {
            currentObj[currentKey] = currentValue;
          }
        }
      
        Object.assign(obj, currentObj);
    }
}

module.exports = {
    BetterLogParser,
}
