var ForyxLIB = {};
(function(context) { 
    if (!String.prototype.ForyxLIBformat) {
	  String.prototype.ForyxLIBformat = function() {
	    var args = arguments;
	    return this.replace(/{(\d+)}/g, function(match, number) { 
		      return typeof args[number] != 'undefined'
	        ? args[number]
	        : match
		      ;
	    });
	  };
	};
})(ForyxLIB);