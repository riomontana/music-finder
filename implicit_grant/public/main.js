(function() {
      
    var stateKey = 'spotify_auth_state';

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    function generateRandomString(length) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    var userProfileSource = document.getElementById('user-profile-template').innerHTML,
        userProfileTemplate = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = document.getElementById('user-profile');

        // oauthSource = document.getElementById('oauth-template').innerHTML,
        // oauthTemplate = Handlebars.compile(oauthSource),
        // oauthPlaceholder = document.getElementById('oauth');

        usernameNavbarSource = document.getElementById('username-navbar-template').innerHTML,
        usernameNavbarTemplate = Handlebars.compile(usernameNavbarSource);
        usernameNavbarPlaceholder = document.getElementById('username-navbar');

    var params = getHashParams();

    var access_token = params.access_token,
        state = params.state,
        storedState = localStorage.getItem(stateKey);

    if (access_token && (state == null || state !== storedState)) {
      alert('There was an error during the authentication');
    } else {
      localStorage.removeItem(stateKey);
      if (access_token) {
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
              userProfilePlaceholder.innerHTML = userProfileTemplate(response);
              usernameNavbarPlaceholder.innerHTML = usernameNavbarTemplate(response);

              $('#login').hide();
              $('#loggedin').show();
            }
        });
      } else {
          $('#login').show();
          $('#loggedin').hide();
      }

      document.getElementById('login-button').addEventListener('click', function() {

        var client_id = 'ff2328d5ea434e82bc9cd0ec1df194e2'; // Your client id
        var redirect_uri = 'http://localhost:8888'; // Your redirect uri

        var state = generateRandomString(16);

        localStorage.setItem(stateKey, state);
        var scope = 'user-read-private user-read-email';

        var url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        url += '&state=' + encodeURIComponent(state);

        window.location = url;
      }, false);

    }

     // find template and compile it
     var templateSource = document.getElementById('results-template').innerHTML,
     template = Handlebars.compile(templateSource),
     resultsPlaceholder = document.getElementById('results'),
     playingCssClass = 'playing',
     audioObject = null;

 var fetchTracks = function (albumId, callback) {
     $.ajax({
         url: 'https://api.spotify.com/v1/albums/' + albumId,
         headers: {
          'Authorization': 'Bearer ' + access_token
        },
         success: function (response) {
             callback(response);
         }
     });
 };

 var searchAlbums = function (query) {
     $.ajax({
         url: 'https://api.spotify.com/v1/search',
         data: {
             q: query,
             type: 'album'
         },
         success: function (response) {
             resultsPlaceholder.innerHTML = template(response);
         }
     });
 };

 results.addEventListener('click', function (e) {
     var target = e.target;
     if (target !== null && target.classList.contains('cover')) {
         if (target.classList.contains(playingCssClass)) {
             audioObject.pause();
         } else {
             if (audioObject) {
                 audioObject.pause();
             }
             fetchTracks(target.getAttribute('data-album-id'), function (data) {
                 audioObject = new Audio(data.tracks.items[0].preview_url);
                 audioObject.play();
                 target.classList.add(playingCssClass);
                 audioObject.addEventListener('ended', function () {
                     target.classList.remove(playingCssClass);
                 });
                 audioObject.addEventListener('pause', function () {
                     target.classList.remove(playingCssClass);
                 });
             });
         }
     }
 });

 document.getElementById('search-form').addEventListener('submit', function (e) {
     e.preventDefault();
     searchAlbums(document.getElementById('query').value);
 }, false);
  })();