angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, User, Recommendations) {
  var showLoading = function() {
    $ionicLoading.show({
      template:'<i class="ion-loading-c"></i>',
      noBackdrop:true
    });
  };

  var hideLoading = function() {
    $ionicLoading.hide();
  };

  showLoading();

  //get our first songs
  Recommendations.init()
    .then(function(){
      $scope.currentSong = Recommendations.queue[0];
      Recommendations.playCurrentSong();

    }).then(function() {
      // turn loading off
      hideLoading();
      $scope.currentSong.loaded=true;
  });

  $scope.sendFeedback = function(bool){

    if (bool) {User.addSongToFavorites($scope.currentSong)};

    //set variable for the correct animation sequence
    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;

    Recommendations.nextSong();

    $timeout(function() {
      //timeout allows the animation to complete before changing the song
      $scope.currentSong = Recommendations.queue[0];
      $scope.currentSong.loaded = false;
    }, 250);

    Recommendations.playCurrentSong().then(function() {
      $scope.currentSong.loaded = true;
    });


  };

  $scope.nextAlbumImg = function() {
    if (Recommendations.queue.length > 1) {
      return Recommendations.queue[1].image_large;
    }

    return '';
  }
})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User, $window) {
  //get the list of our favorites form the user service
  $scope.favorites = User.favorites;
  $scope.username = User.username;
  $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  };
  $scope.openSong = function(song) {
    $window.open(song.open_url, "_system");
  }
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, Recommendations, User) {

  $scope.favCount = User.favoriteCount;
  //stop audio when going to favorites page
  $scope.enteringFavorites = function() {
    Recommendations.haltAudio();
    User.newFavorites = 0;
  };

  $scope.leavingFavorites = function() {
    Recommendations.init();
  };

  $scope.logout = function(){
    User.destroySession();
    // instead of using $state.go, we're going to redirect.
    // reason: we need to ensure views aren't cached.
    $window.location.href = index.html;
  }
})

/*
Controller for our Splash tab
 */
.controller('SplashCtrl', function($scope, $state, User){
  $scope.submitForm = function(username, signingUp){
    User.auth(username, signingUp).then(function() {
      $state.go('tab.discover');
    }, function() {
      alert('Try another user name');
    });
  }
})

.controller('UploadCtrl', function($scope){

});
