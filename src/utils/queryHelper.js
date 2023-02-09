
export const createQueryString = async (data) => {
    // data is an object
    // map keys to vals into a string
    const queryString = "";
    queryString = Object.assign(...Object.keys(data)
        .map(function(key, index){
            if(index ===0){
                queryString = key + "='" + data[key] + "'"
            }else{
                queryString = queryString + ", " + key + "='" + data[key] + "'"
            }
        }));

    console.log(queryString);
    return queryString
};

export const createColValArr = async(data) => {
    // data is object
    // return two arrays: one of cols and one of vals
    let colsArr, valsArr;
    Object.assign(...Object.keys(data)
        .map(function(key){
            colsArr.push(key);
            valsArr.push(data[key]);
        }));
    
    return colsArr, valsArr
};
  

