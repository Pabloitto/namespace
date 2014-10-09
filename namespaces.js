(function ($) {

    /**
    * This function generate a scope for a new function
    * you can get a new object with the method getInstance 
    * See Function $.using
    * example : 
    * $.namespace("com.business.core.config" , function(){
    *       var name = "Configurations";
    *       
    *       return {
    *           getName : function(){
    *               return name;
    *           }
    *       }
    * });
    **/
   $.namespace = function (path, obj) {
        var parts = path.split("."),
            root = parts.shift(),
            parent = null;

        if (!window[root]) {
            window[root] = {};
        }
        parent = window[root];

        for (var i = 0, l = parts.length; i < l; i++) {

            if (!parent[parts[i]]) {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        if (obj) {
			if (typeof(obj) === "function") {
				parent.getInstance = function () {
					return new obj();
				};
			}else if(typeof(obj) === "object"){
				parent.getInstance = function () {
					return obj;
				};
			}
        } else {
            parent.getInstance = function () {
                var newInstance = {};
                parent.getInstance = function () {
                    return newInstance;
                };
                return parent.getInstance();
            }
        }
        return parent;
    };
} (jQuery));
