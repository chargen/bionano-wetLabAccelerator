'use strict';

/**
 * @ngdoc service
 * @name wetLabAccelerator.Data
 * @description
 * # Data
 * Factory in the wetLabAccelerator.
 */
angular.module('tx.communication')
  .service('Catalog', function ($http, Communication, TranscripticAuth) {

   var self = this;

    var defaultUrl = Communication.root + '_commercial/resources';

    self.query = function (query) {
      return $http.get(defaultUrl, Communication.defaultResourceActions({
        params: {
          q : query
        },
        cache: true
      }, true));
    };

    /**
     * @name query
     * @description Query the transcriptic catalog
     * @param query {string} Query string, will search over multiple keys decided by transcriptic
     */
    self.byQuery = function (query) {
      return $http.get(defaultUrl, Communication.defaultResourceActions({
        params: {
          q : ((_.isString(query) && query.length) ? query : null)
        },
        cache: true,
        transformResponse: function (data, headers, status) {
          return (angular.isArray(data.results)) ? data.results : data;
        }
      }, true));
    };

    /**
     * @name byCategory
     * @description Query the transcriptic catalog
     * @param cat {string} Category string, retrieved from transcriptic (e.g. facets in a result)
     */
    self.byCategory = function (cat) {
      return $http.get(defaultUrl, Communication.defaultResourceActions({
        params : {
          c : cat
        },
        cache: true,
        transformResponse: function (data, headers, status) {
          return angular.isArray(data.results) ? data.results : data;
        }
      }, true));
    };

  });
