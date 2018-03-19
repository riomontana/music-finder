var bandSearched;
var data;
var tracks;

/*================================================================
Method that runs after user enters a bandname into the searchform
and calls getBands and passes the string from the searchform.
=================================================================*/

$(document).ready(() => {

  $('#search-form').on('submit', (e) => {
    this.bandSearched = $('#query').val();
    getBands(this.bandSearched);
    e.preventDefault();
    console.log("search-form");
  });
});

/*================================================================
Method that sends and ajax-request to the lastFm-api and uses the
passed string inside the post. The succeeded answer is then saved
inside a variable that awaits the method getTopTracks to finish
before passing the output to the html-file.
================================================================*/

function getBands(bandSearched) {
  console.log("getBands");
   $.ajax({
        type : 'POST',
        url : 'http://ws.audioscrobbler.com/2.0/',
        data : 'method=artist.getinfo&' +
               'artist='+bandSearched+'&' +
               'api_key=57ee3318536b23ee81d6b27e36997cde&' +
               'format=json',
        dataType : 'jsonp',
        success : async (response) => {
            console.log(response);

            var artist = response.artist;
            await this.getTopTracks(this.bandSearched);

            console.log(this.tracks);

            var output = `
            <h3>${artist.name}</h3>
            <ul class="nav nav-tabs">
              <li class="nav-item active">
                <a class="nav-link" data-toggle="tab" href="#about">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#toptracks">Top tracks</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#something">Something</a>
              </li>
            </ul>
            <div id="myTabContent" class="tab-content jumbotron">
              <div class="tab-pane fade show active" id="about">
                <p>${artist.bio.content}</p>
              </div>
              <div class="tab-pane fade show active" id="toptracks">
                <ul>
                ${this.tracks.map(track => `
                <li>${track['name']}</li>`).join('')}
                </ul>
              </div>
              <div class="tab-pane fade show active" id="something">
                <p>Something in here ...</p>
              </div>
            `;

            $('#artist').html(output);

        },
        error : (code, message) => {
            console.log(code, message);
        }
    });
  }

/*================================================================
  Asynced function that waits for the ajax-request to finish
  before returning the topTracks array form the response. This
  because slightly longer timespand for parsing the jsonojbect.
  ==============================================================*/

  async function getTopTracks(bandSearched) {
    console.log("getTopTracks");
    await $.ajax({
          type : 'POST',
          url : 'http://ws.audioscrobbler.com/2.0/',
          data : 'method=artist.gettoptracks&' +
                 'artist='+bandSearched+'&' +
                 'api_key=57ee3318536b23ee81d6b27e36997cde&' +
                 'format=json',
          dataType : 'jsonp',
          success : response => {
              console.log(response);

              this.tracks = response.toptracks.track;

          },
          error : (code, message) => {
              console.log(code, message);
          }
      });
  }

  /*================================================================
  Method that IS SUPPOSED TO FUCKING CHANGE THE DAMN ACTIVE BARS
  FUCK FCUKDKASD AJSDWKDN W
  =================================================================*/

  $(".nav li").on("click", function() {
    $(".nav li").removeClass("active");
    $(this).addClass("active");
  });
