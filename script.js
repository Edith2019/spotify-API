(function () {

    var baseURL = 'https://elegant-croissant.glitch.me/spotify';
    var nextURL;
    var musicResponse;
    var input = $('input[name="user-input"]');
    var userInput = input.val();
    var dropdownInput = $('.artist-or-album').val();
    var artistsResults = $('.artistsResults');
    Handlebars.templates = Handlebars.templates || {};
    var myHtml = "";
    var templates = document.querySelectorAll(
        'script[type="text/x-handlebars-template"]'
    );
    Array.prototype.slice.call(templates).forEach(function (script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

    $('.submit-btn').on('mouseover', function () {
        $('.submit-btn').css({
            'backgroundColor': 'lightgray',
            'borderRadius': 8 + '%',
        });
    });

    $('.submit-btn').on('mouseout', function () {
        $('.submit-btn').css({
            'backgroundColor': 'white',
        });
    });

    $('.submit-btn').on('click', function () {
        var input = $('input[name="user-input"]');
        var userInput = input.val();
        var dropdownInput = $('.artist-or-album').val();
        var baseURL = 'https://elegant-croissant.glitch.me/spotify'; //proxy we will talk to and the proxy will talk to spotify


        $.ajax({
            url: baseURL,
            data: {
                query: userInput,
                type: dropdownInput
            },
            success: function (musicResponse) {
                // console.log('music reseponse', musicResponse);
                var resultsDiv = $('.results-container');
                var artistsResults = $('.artistsResults');
                var link;
                musicResponse = musicResponse.artists || musicResponse.albums;
                if (musicResponse.next) {
                    nextURL = musicResponse.next.replace('https://api.spotify.com/v1/search', baseURL);
                }
                myHtml = Handlebars.templates.spotifyData(musicResponse);
                $('.results-container').html(myHtml);
                if (userInput != '' && musicResponse.items.length == 0) {
                    resultsDiv.html('Nope...');
                } else {
                    artistsResults.html(userInput);
                }
                if (musicResponse.next !== 0) {
                    if (location.search.indexOf('scroll=infinite') >= 0) {
                        checkScrollPosition();
                        $('.next').css({
                            visibility: 'hidden'
                        });
                    } else {
                        $('#result-container').append("<button class='more-button'>More Results</button>");
                    }
                }
                var timeout = setTimeout(checkScrollPosition, 300);
                function checkScrollPosition() {
                    // console.log("height of window: ", $(window).height());
                    // console.log("height of page/document: ", $(document).height());
                    // console.log("how far have we scrolled from the top: ", $(document).scrollTop());
                    var hasReachedBottom = $(document).scrollTop() + $(window).height() >= $(document).height() - 100;
                    if (hasReachedBottom) {
                        resultsDiv.append(nextURL);
                        // console.log("TIME TO GET MORE RESULTS!!");
                    } else {
                        // console.log("did not reach bottom yet....");
                        timeout = setTimeout(checkScrollPosition, 300);
                    }
                }
                clearTimeout(timeout);
            }
        });
        $('.next').css({
            'visibility': 'visible'
        });
    });
    $('.next').on('click', function () {
        $.ajax({
            url: nextURL,   //what website to talk to here is the var storing the url and need to read documentation to get it and always need to call url
            data: { // always called data
                query: userInput,
                type: dropdownInput
            },
            success: function (musicResponse) {
                var HTMLforResultsIMG = '';
                var HTMLforResults = '';
                var resultsDiv = $('.results-container');
                var artistsResults = $('.artistsResults');
                var link = '';
                musicResponse = musicResponse.artists || musicResponse.albums;
                myHtml += (Handlebars.templates.spotifyData(musicResponse));
                $('.results-container').html(myHtml);
            }
        });
    });
})();

