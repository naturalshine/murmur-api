
export const createQueryString = async (data) => {
    // data is an object
    // map keys to vals into a string
    let queryString = "";
    let valArr = [];
    Object.keys(data)
        .map(function(key, index){
            if(index ===0){
                queryString = key + ' = ?';
                valArr.push(data[key]);
            }else{
                queryString = queryString + ' AND ' + key + ' = ?'
                valArr.push(data[key]);
            }
        });

    console.log(queryString);
    return [queryString, valArr]
};

export const createColString = async(data) => {
    // cols is arr of column names
    console.log(data);

    let colString = "";

    Object.keys(data)
        .map(function(key, index){
            if(index === 0){
                colString = key + " " + data[key]
            }else{
                colString = colString + ", " + key + " " + data[key]
            }
    });


    return colString;
}

export const createTablelandVars = async(data) => {
    // data is object
    // return two arrays: one of cols and one of vals
    let colsArr = [];
    Object.keys(data)
        .map(function(key){
            colsArr.push(key);
        });
    let colString, valString;
    colsArr.forEach(function (item, index) {
        if (index == 0){
            colString = item;
            valString = "'" + data[item] + "'"
        } else {
            colString = colString + ", " + item
            valString = valString + ", '" + data[item] + "'"
        }
        
    });

    return [colString, valString]
}


export const createColValArr = async(data) => {
    // data is object
    // return two arrays: one of cols and one of vals
    let colsArr = [];
    let valsArr = [];
    Object.keys(data)
        .map(function(key){
            colsArr.push(key);
            valsArr.push(data[key]);
        });
    let colString, valString;
    colsArr.forEach(function (item, index) {
        if (index == 0){
            colString = item;
        } else {
            colString = colString + ", " + item
        }
        
    });
    valsArr.forEach(function (item, index) {
        if (index == 0){
            valString =  "'" + item + "'";
        } else {
            valString = valString + ", '" + item + "'"
        }
        
    });
    return [colString, valString, valsArr]
};
  

