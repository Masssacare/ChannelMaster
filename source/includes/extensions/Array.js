if(!Array.prototype.hasOwnProperty("remove")) {
    Array.prototype.remove = function(keyword) {
        var arr = [];
        var i = 0;
        for(var key in this) {
            if(key == keyword || typeof this[key] == 'function')
                continue;
            arr[i++] = this[key];
        }
        return arr;
    };
}