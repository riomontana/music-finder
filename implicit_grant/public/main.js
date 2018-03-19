(function () {

    var stateKey = 'spotify_auth_state';

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
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

    var searchArtistSource = document.getElementById('search-form-template').innerHTML,
        searchArtistTemplate = Handlebars.compile(searchArtistSource),
        searchArtistPlaceholder = document.getElementById('artist-search');

    usernameNavbarSource = document.getElementById('username-navbar-template').innerHTML,
        usernameNavbarTemplate = Handlebars.compile(usernameNavbarSource);
    usernameNavbarPlaceholder = document.getElementById('username-navbar');

    var params = getHashParams();

    var access_token = params.access_token,
        state = params.state,
        storedState = localStorage.getItem(stateKey);

    // if (access_token && (state == null || state !== storedState)) {
    //   alert('There was an error during the authentication');
    // } else {
    // localStorage.removeItem(stateKey);
    if (access_token) {
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                searchArtistPlaceholder.innerHTML = searchArtistTemplate(response);
                usernameNavbarPlaceholder.innerHTML = usernameNavbarTemplate(response);

                $('#login').hide();
                $('#loggedin').show();
                setListenerToSearchForm();
            }
        });
    } else {
        $('#login').show();
        $('#loggedin').hide();
    }

    document.getElementById('login-button').addEventListener('click', function () {

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

    // }

    // find template and compile it
    var templateSource = document.getElementById('results-template').innerHTML,
        template = Handlebars.compile(templateSource),
        resultsPlaceholder = document.getElementById('results'),
        playingCssClass = 'playing',
        audioObject = null;

    //  var fetchTracks = function (albumId, callback) {
    //      $.ajax({
    //          url: 'https://api.spotify.com/v1/albums/' + albumId,
    //          headers: {
    //           'Authorization': 'Bearer ' + access_token
    //         },
    //          success: function (response) {
    //              console.log(albumId);
    //              callback(response);
    //          }
    //      });
    //  };

    results.addEventListener('click', function (e) {
        var target = e.target;
        if (target !== null && target.classList.contains('cover')) {

            var albumID = target.getAttribute('data-album-id');
            var albumTitle = target.getAttribute('data-album-name') // todo hitta rätt attribut!
            // PopupCenter("", "", 300, 380);
            var newWindow = window.open("", "newWindow", "width=300,height=380,status=no,location=no");
            newWindow.document.write('<body><iframe src="https://open.spotify.com/embed?uri=spotify:album:' +
                albumID + '" width="285" height="370" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></body>');
        }
    });

    function setListenerToSearchForm() {
        document.getElementById('search-form').addEventListener('submit', function (e) {
            e.preventDefault();
            searchAlbums(document.getElementById('query').value);
        }, false);
    }

    var searchAlbums = function (query) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            data: {
                q: query,
                type: 'album'
            },
            success: function (response) {
                // console.log(response);
                resultsPlaceholder.innerHTML = template(response);
            }
        });
    };

    // function PopupCenter(url, title, w, h) {
    //     // Fixes dual-screen position                         Most browsers      Firefox
    //     var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    //     var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    //     var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    //     var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    //     var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    //     var top = ((height / 2) - (h / 2)) + dualScreenTop;
    //     var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    //     newWindow.document.write('<body><iframe src="https://open.spotify.com/embed?uri=spotify:album:' +
    //         albumID + '" width="285" height="370" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></body>');

    //     // Puts focus on the newWindow
    //     if (window.focus) {
    //         newWindow.focus();
    //     }
    // }
})();