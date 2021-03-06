/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc service
 * @name wetLabAccelerator.ContainerHelper
 * @description
 * # ContainerHelper
 * Service in the wetLabAccelerator.
 *
 * //todo - merge in containerOptions, and expose functionality here
 */
angular.module('wetLabAccelerator')
  .service('ContainerHelper', function ($rootScope, TranscripticAuth, Container, ContainerOptions) {
    var self = this;

    self.local  = [];
    self.remote = [];

    self.containers = [];

    self.containerOptions = ContainerOptions;

    TranscripticAuth.watch(function (info) {
      //todo - should get in pages if possible... this is obviously slow for large lists
      if (_.result(info, 'organization', false)) {
        Container.list({per_page: 500}).$promise.then(function (containers) {
          self.setRemote(containers);
        });
      }
    });

    self.setRemote = function (remote, forceReset) {
      if (forceReset === true) {
        self.remote.length = 0;
      }

      _.forEach(remote, function (cont) {
        cont = _.isObject(cont.container) ? cont.container : cont; //test mode is different
        self.remote.push({
          id   : _.result(cont, 'id'),
          isNew: false,
          type : _.result(cont, 'container_type.shortname'),
          name : _.result(cont, 'label')
        });
      });

      $rootScope.$applyAsync();
    };

    self.setLocal = function (local) {
      self.local.length = 0;
      _.forEach(local, function (cont) {
        self.local.push(cont);
      });
    };

    self.definedColors = {
      'maraschino': '#c5535b',
      'tangerine' : '#f28500',
      'aqua'      : '#00FFFF',
      'moss'      : '#addfad',
      'cayenne'   : '#EC0704',
      'carnation' : '#FFA6C9',
      'lime'      : '#00FF00',
      'plum'      : '#DDA0DD'
    };

    var calls        = 0;
    self.randomColor = function () {
      calls = (calls + 1) % _.keys(self.definedColors).length;
      return _.values(self.definedColors)[calls];
    };

    // helpers

    //for setting local or remote - will update union
    function assignContainers (array, containers) {
      array.length = 0;
      _.forEach(containers, function (cont) {
        array.push(cont);
      });
      assignUnion(_.union(self.local, self.remote));
    }

    function assignUnion () {
      var union              = _.union(self.local, self.remote);
      self.containers.length = 0;
      _.forEach(union, function (cont) {
        self.containers.push(cont);
      });
      return self.containers;
    }
  });
