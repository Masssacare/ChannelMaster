if(typeof Array.remove == 'undefined') {
    Array.remove = function(array, keyword) {
        var arr = [];
        var i = 0;
        for(var key in array) {
            if(key == keyword || typeof array[key] == 'function')
                continue;
            arr[i++] = array[key];
        }
        return arr;
    };
}