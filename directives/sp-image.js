angular.module('sp-image-ng', [])
  .directive('spImage', function () {

    var types = {
      int: 0,
      string: 1,
      list: 2,
      object: 3,
      boolean: 4
    };

    // these are the properties supported
    // see https://developer.spotify.com/docs/apps/views/1.0/image-image.html#availableOptions
    // for more info
    var availableAttribs = {
      width: types.int,
      height: types.int,
      style: types.string,
      player: types.boolean,
      quickActionMenu: types.boolean,
      // overlay: types.array,
      link: types.string,
      animate: types.boolean,
      placeholder: types.string,
      title: types.string,
      playerCentered: types.boolean
    };

    // note that also "cover" is supported, to set a custom cover

    return {
      restrict: 'EA',
      replace: true,
      link: function ($scope, elements, attrs) {
        attrs.$observe('uri', function (newval, oldval) {
          if (!attrs.uri) {
            return;
          }
          require(['$views/image#Image', '$api/models'], function (Image, models) {

            var image,
                element = elements[0];

            if (newval !== oldval) {
              if (newval === null && element.childNodes.length) {
                element.removeChild(element.childNodes[0]);
              } else {
                entity = models.fromURI(attrs.uri);

                var options = {};

                for (var i in attrs) {
                  if (attrs.hasOwnProperty(i) && i.indexOf('$') !== 0) {
                    if (i in availableAttribs) {
                      switch (availableAttribs[i]) {
                        case types.string:
                          options[i] = attrs[i];
                          break;
                        case types.int:
                          options[i] = parseInt(attrs[i], 10);
                          break;
                        case types.list:
                          options[i] = attrs[i].split(',');
                          break;
                        case types.object:
                          options[i] = JSON.parse(attrs[i]);
                          break;
                        case types.boolean:
                          options[i] = ['true', '', i].indexOf(attrs[i]) !== -1;
                          break;
                        default:
                          console.error('Unrecognized type ' + availableAttribs[i]);
                      }
                    }
                  }
                }

                if (attrs.cover) {
                  options.playerItem = entity;
                  image = Image.fromSource(attrs.cover, options);
                } else {
                  if (entity instanceof models.Album) {
                    image = Image.forAlbum(entity, options);
                  } else if (entity instanceof models.Playlist) {
                    image = Image.forPlaylist(entity, options);
                  } else if (entity instanceof models.Track) {
                    image = Image.forTrack(entity, options);
                  }
                }
                if (element.childNodes.length) {
                  element.replaceChild(image.node, element.childNodes[0]);
                } else {
                  element.appendChild(image.node);
                }
              }
            }
          });
        });
      }
    };
  });