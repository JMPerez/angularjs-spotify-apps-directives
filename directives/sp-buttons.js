angular.module('sp-buttons-ng', [])
  .directive('spSubscribeButton', function () {

    var types = {
      int: 0,
      string: 1,
      list: 2,
      object: 3,
      boolean: 4
    };

    // these are the properties supported
    // see https://developer.spotify.com/docs/apps/views/1.0/buttons-subscribebutton.html#availableOptions
    // for more info
    var availableAttribs = {
      initialFollowState: types.boolean,
      icon: types.boolean,
      fullLabel: types.boolean,
      size: types.string
    };

    return {
      restrict: 'EA',
      replace: true,
      link: function ($scope, elements, attrs) {
        var button,
            element = elements[0],
            entity = null;

        attrs.$observe('uri', function (newval, oldval) {
          require(['$views/buttons#SubscribeButton', '$api/models'], function (SubscribeButton, models) {
            if (newval !== oldval) {
              if (newval === null && element.childNodes.length) {
                element.removeChild(element.childNodes[0]);
              } else {
                if (!attrs.uri) {
                  return;
                }
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
                        default:
                          console.error('Unrecognized type ' + availableAttribs[i]);
                      }
                    }
                  }
                }

                if (entity instanceof models.User) {
                  button = SubscribeButton.forUser(entity, options);
                } else if (entity instanceof models.Playlist) {
                  button = SubscribeButton.forPlaylist(entity, options);
                } else if (entity instanceof models.Artist) {
                  button = SubscribeButton.forArtist(entity, options);
                } else {
                  console.error('Unrecognized entity', entity);
                }

                if (button !== null) {
                  if (element.childNodes.length) {
                    element.replaceChild(button.node, element.childNodes[0]);
                  } else {
                    element.appendChild(button.node);
                  }
                }
              }
            }
          });
        });
      }
    };
  })

.directive('spShareButton', function () {

    return {
      restrict: 'EA',
      replace: true,
      link: function ($scope, elements, attrs) {
        var button,
            element = elements[0],
            entity = null;

        attrs.$observe('uri', function (newval, oldval) {
          require(['$views/buttons#ShareButton', '$api/models'], function (ShareButton, models) {
            if (newval !== oldval) {
              if (newval === null && element.childNodes.length) {
                element.removeChild(element.childNodes[0]);
              } else {
                if (!attrs.uri) {
                  return;
                }
                entity = models.fromURI(attrs.uri);

                if (entity instanceof models.Album) {
                  button = ShareButton.forAlbum(entity);
                } else if (entity instanceof models.Track) {
                  button = ShareButton.forTrack(entity);
                } else if (entity instanceof models.Playlist) {
                  button = ShareButton.forPlaylist(entity);
                } else if (entity instanceof models.Artist) {
                  button = ShareButton.forArtist(entity);
                } else {
                  console.error('Unrecognized entity', entity);
                }

                if (button !== null) {
                  if (element.childNodes.length) {
                    element.replaceChild(button.node, element.childNodes[0]);
                  } else {
                    element.appendChild(button.node);
                  }
                }
              }
            }
          });
        });
      }
    };
  });