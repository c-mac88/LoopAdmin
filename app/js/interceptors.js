(function() {
	'use strict'
	;

	angular.module('app').factory('mashapeHttpInterceptor', function() {
		return {
			request: function(request) {
				request.headers["X-Mashape-Key"] = 'jod9SfsBcgmsh5XlKCsgl088Hg9yp1UNBMzjsnDf9BF4bUayCH';

				return request;
			}
		}
	});
})();