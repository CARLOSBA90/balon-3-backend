
/**
 * 
 * @param value Check is value is Numeric
 * @returns 
 */
export const isNumeric =  (value:any): boolean => {
    return !isNaN(Number(value));
}

/**
 *  Checks if string is number and returned casted value
 * @param string
 * @returns integer parse number
 */
export const  parseToInt = (string:string): number => {
    try {
      const intValue = parseInt(string);

      if (!isNaN(intValue)) {
        return intValue;
      }
    } catch (error) { console.error(error) }


    return 0;
  }