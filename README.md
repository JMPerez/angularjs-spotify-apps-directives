#[AngularJS](http://angularjs.org/) Directives for [Spotify Apps](https://developer.spotify.com/technologies/apps/) [Views Framework](https://developer.spotify.com/docs/apps/views/1.0/)

This repository contains a set of AngularJS diractives that act as wrappers for Spotify Apps Views Framework elements.

```html
<!-- Adding an Image for a Spotify URI, with player and size of 100x100 px -->
<sp-image
	uri="{{uri}}"
	player
	width="100"
	height="100">
</sp-image>
```

```html
<!-- Adding a List for the first 5 tracks of a certain playlist URI, with header and fields star, track, artist, and time -->
<sp-list
	uri="{{uri}}"
	fields="star,track,artist,time"
	header="yes"
	num-items="5">
</sp-list>
```

## How it works

You can pass most of the available options using attributes, and they include a `watch` binding for the Spotify URI, so they update themselves every time there is a change in the URI.

### Example
Let's take a look at the `sp-image` directive, which is a wrapper for the `Image` component.

In your HTML you can include an `Image` component doing:

```html
<sp-image uri="{{uri}}"></sp-image>
```

The `sp-image` directive supports most the [available options for the `Image` component](https://developer.spotify.com/docs/apps/views/1.0/image-image.html#availableOptions). If you want to include a player button you can add the `player` attribute, and if you want the `Image` to link to a website you would include the `link` attribute:

```html
<sp-image uri="{{uri}}" player link="http://mywebsite.com"></sp-image>
```

There is no need to specify the type of entity that the `Image` will be playing. Specific methods like `forAlbum`, `forArtist`, `forPlaylist`, `forTrack` and `forUser` are abstracted and the proper one is determined from the Spotify URI format.

## Basic Quick Start

### Create a Spotify app

You can use the [boilerplate app](https://github.com/spotify/boilerplate-app) that provides the basic structure for an app.

### Include AngularJS library and dependencies

As with any other AngularJS, you need to include the AngularJS library. Then, you will also include the directives you need, as well as their stylesheets. Thus, your final html code will look like this:

```html
<!doctype html>
<html ng-app="spotifyApp">
	<head>
		<!-- here, the CSS for the Spotify Views components you are going to use -->
		<!-- here, the angularjs library -->
		<!-- here, the app initialization -->
		<!-- here, your directives -->
	</head>
	<body>
		<!-- here, the markup for the app -->
	</body>
</html>	
```

To start with, include the AngularJS library. You can download AngularJS from [their site](http://angularjs.org/), or refer to their CDN asset (at the moment `https://ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular.min.js`).

Next we are going to implement the app initialization. In our case we want to add a picture of the cover for a track that includes a play button. For this we need to use an `Image` Spotify Apps Views component.

```javascript
  var app = angular.module('spotifyApp', ['sp-image-ng']);

  app.config(function($locationProvider, $compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|sp):/);  
    $locationProvider.html5Mode(false);
  });

  function ExampleCtrl($scope) {
    $scope.uri = 'spotify:track:22QqSpCXi5ZwTZzVV3yaUo';
  }
```

Remember to include the stylesheet for the Views component that we want to use:

```html
<link rel="stylesheet" href="$views/css/image.css">
```

And a reference to the `sp-image` directive that you can download from this repository:

```html
<script src="scripts/directives/sp-image.js"></script>
```

Now, add the markup:

```html
<div ng-controller="ExampleCtrl">
	<sp-image
		uri="{{uri}}"
		player
		width="200"
		height="200">
	</sp-image>
</div>
```

The complete example:

```html
<!doctype html>
<html ng-app="spotifyApp">
  <head>
    <link rel="stylesheet" href="$views/css/image.css">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular.min.js"></script>
    <script>
      var app = angular.module('spotifyApp', ['sp-image-ng']);

      function ExampleCtrl($scope) {
        $scope.uri = 'spotify:track:22QqSpCXi5ZwTZzVV3yaUo';
      }
    </script>
    <script src="scripts/directives/sp-image.js"></script>
  </head>
  <body>
    <div ng-controller="ExampleCtrl">
      <sp-image
        uri="{{uri}}"
        player
        width="200"
        height="200">
      </sp-image>
    </div>
  </body>
</html>
```
