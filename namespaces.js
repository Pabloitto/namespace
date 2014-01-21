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
            if ($.isFunction(obj)) {
                parent.getInstance = function () {
                    var r = new obj();
                    parent.getInstance = function () {
                        return r;
                    };
                    return parent.getInstance();
                };
            } else if ($.isPlainObject(obj)) {
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
        parent.extends = function (path) {
            var o = parent.getInstance();
            parent.getInstance = function () {
                var Base = $.using(path).getInstance(),
                    mergeObject = $.extend(true, $.extend({}, Base), o);

                mergeObject.Base = Base;

                return mergeObject;
            };
            return parent;
        };
        return parent;
    };
    /**
    * This function get a object via a namespace in string
    * See Function $.namespace
    * Example:
    *  var config = $.using("com.business.core.config").getInstance();
    *  config.getName(); //this returns Configurations
    **/
    $.using = function (path) {
        var parts = path.split("."),
            root = parts.shift(),
            namespace = null;

        namespace = window[root];

        if (!namespace) { throw "namespace no found"; }

        while (parts.length > 0) {
            var current = parts.shift();

            current = namespace[current];

            if (!current) { throw "namespace no found"; }

            namespace = current;
        }
        return namespace; //Return the last node
    };
} (jQuery));
