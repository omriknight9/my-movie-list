const refreshUrls = () => {
    upcomingUrl = movieInfoUrl + 'upcoming?api_key=' + tmdbKey + '&region=US&page=';
    nowPlayingUrl = movieInfoUrl + 'now_playing?api_key=' + tmdbKey + '&region=US&page=';
    getTrendingUrl = baseUrl + '/trending/all/day?api_key=' + tmdbKey + '&page=';
    moviesGenreUrl = baseUrl + '/discover/movie?api_key=' + tmdbKey + '&with_genres=';
    tvGenreUrl = baseUrl + '/discover/tv?api_key=' + tmdbKey + '&with_genres=';
}

const refreshWindowScroll = (type) => {
    if (type == 1) {   
        window.onscroll = () => {
            scrollBtn();
            lazyload();
            scrollIndicator();
            checkSoundOnScroll();
        } 
    } else {
        window.onscroll = () => {
            scrollBtn();
            lazyload();
            scrollIndicator();
        }
    }

    $(window).on('popstate', function() {
        goHome();
        window.history.replaceState({}, document.title, "/" + "my-movie-list/");
    });
}

const scrollIndicator = () => {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
}

const checkSoundOnScroll = () => {
    if (window.location.href.indexOf("?movie=") > -1) {
        const urlParams = new URLSearchParams(window.location.search);
        const value = Number(urlParams.get('value'));
        checkAudio(value, 1);
    }

    if (window.location.href.indexOf("?tvShow=") > -1) {
        const urlParams = new URLSearchParams(window.location.search);
        const value = Number(urlParams.get('value'));
        checkAudio(value, 2);
    }

    if ($(window).scrollTop() !== 0) {
        window.onscroll = () => {
            scrollBtn();
            lazyload();
            scrollIndicator();
        }
    }
}

const refreshUrl = (value, name, type, directorOrActor, chosenUrl) => {
    let finalNameToSend;
    finalNameToSend = name.replace(/'/, "");
    finalNameToSend = finalNameToSend.replace(/-/, "");
    finalNameToSend = finalNameToSend.replace(/:/, "");
    finalNameToSend = finalNameToSend.replace(/\s/g, '');

    window.history.replaceState({}, document.title, "/" + "my-movie-list/");

    const url = new URL(window.location);
    
    if (type == 1) {
        if (directorOrActor == 1) {
            url.searchParams.set('actor', finalNameToSend);
        } else {
            url.searchParams.set('director', finalNameToSend);
        }
    } else {
        url.searchParams.set(chosenUrl, finalNameToSend);
    }

    url.searchParams.set('value', value);
    window.history.pushState({}, '', url);

    $(window).on('popstate', function() {
        goHome();
        window.history.replaceState({}, document.title, "/" + "my-movie-list/");
    });
}

const goHome = () => {

    if (!$('#marvelContainer').is(':visible')) {
        goToDiv('#breadcrumbs');
    } 

    if (!$("#marvelContainer").text().length > 0) {
        loadJson();
    }

    $('#breadcrumbs').hide();
    $('#typeOfContent').attr('class', '');
    $('#contentPoster').css('background', '').hide();
}

const hasClass = (elem, className) => {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

const addClass = (elem, className) => {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}

const toggleClass = (elem, className) => {
    let newClass = ' ' + elem.className.replace( /[\t\r\n]/g, " " ) + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(" " + className + " ") >= 0 ) {
            newClass = newClass.replace( " " + className + " " , " " );
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}

const changeMonthName = (month, type) => {

    switch (month) {
        case 0: {
            return 'Jan';
        }
        case 1: {
            return 'Feb';
        }
        case 2: {
            return 'March';
        }
        case 3: {
            return 'April';
        }
        case 4: {
            return 'May';
        }
        case 5: {
            return 'June';

        }
        case 6: {
            return 'July';
        }
        case 7: {
            return 'Aug';
        }
        case 8: {
            return 'Sep';
        }
        case 9: {
            return 'Oct';
        }
        case 10: {
            return 'Nov';
        }
        case 11: {
            return 'Dec';
        }
    }
}

const changeDayName = (day) => {
    switch (day) {
        case 1:
        case 21:
        case 31: {
            return day + 'st';
        }
        case 2:
        case 22: {
            return day + 'nd';
        }
        case 3:
        case 23: {
            return day + 'rd';
        }

        default: {
            return day + 'th';
        }
    }
}

const capitalize = (str) => {
    return str.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase())
}

const convertMinsToHrsMins = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? '' + h : h;
    m = m < 10 ? '' + m : m;

    if (h > 0) {
        return h + 'h ' + m + ' m';
    } else {
        return m + ' m';
    }
}

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const countInstances = (string, word) => {
    return string.split(word).length - 1;
}

const configureDate = (data) => {
    let date = new Date(data);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return changeMonthName(month - 1) + ' ' + changeDayName(day) + ' ' + year;
}

const getAge = (dateString, type, deadBirthDate) => {
    if (type == 1) {
        let today = new Date();
        let birthDate = new Date(dateString);

        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age; 
    } else {
        let today = new Date(dateString);
        let birthDate = new Date(deadBirthDate);

        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age; 
    }
}

const closeMenus = () => {
    if ($('#toggle').hasClass('on')) {
        $('#toggle').removeClass('on')
    }

    if ($('#socials').hasClass('on')) {
        $('#socials').removeClass('on')
    }

    $('#miscellaneousList').hide();
    $('#miscellaneousRow').css('border-bottom', 'none');
}

const checkAudio = (value, type) => {

    let audioFile;
    let finalAudioText;

    if (type == 1) {
        switch(value) {
            case 1726:
                audioFile = 'ironMan.mp3';
                finalAudioText = 'Iron Man Suit Up';
                break;

            default:
                audioFile = null;
                break;
        }
    } else {
        switch(value) {
            case 1405:
                audioFile = 'dexter.mp3';
                finalAudioText = 'Dexter - Blood Theme';
                break;
            case 1668:
                audioFile = 'friends.mp3';
                finalAudioText = "The Rembrandts - I'll Be There For You";
                break;
            case 1100:
                audioFile = 'howIMetYourMother.mp3';
                finalAudioText = 'How I Met Your Mother Theme';
                break;
            case 1399:
                audioFile = 'gameOfThrones.mp3';
                finalAudioText = 'Game Of Thrones Theme';
                break;
            case 85271:
                audioFile = 'wandavision.mp3';
                finalAudioText = 'Agatha All Along';
                break;
            case 88396:
                audioFile = 'theFalconAndTheWinterSoldier.mp3';
                finalAudioText = 'The FalconAnd The Winter Soldier Theme';
                break;
            case 84958:
                audioFile = 'loki.mp3';
                finalAudioText = 'Loki Theme';
                break;
            case 1396:
                audioFile = 'breakingBad.mp3';
                finalAudioText = 'Breaking Bad Theme';
                break;
            default:
                audioFile = null;
                break;
        }
    }

    if (audioFile !== null) {
        let audioWrapper = $('<div>', {
            id: 'audioWrapper',
        }).appendTo('#chosenMovie')
            
        let audio = $('<audio>', {
            controls: true,
            id: 'audio',
        }).appendTo(audioWrapper)

        $('<span>', {
            id: 'audioText',
            text: finalAudioText
        }).appendTo(audioWrapper)

        $('<source>', {
            src: './audio/' + audioFile,
        }).appendTo(audio)

        $('<i>', {
            id: 'pause',
            class: 'fas fa-pause pointer',
            click: () => {
                $('#audio').trigger('pause');
                $('#pause').css({'opacity': .3, 'pointer-events': 'none'});
                $('#play, #stop').css({'opacity': 1, 'pointer-events': 'all'});
            }
        }).appendTo(audioWrapper)
    
        $('<i>', {
            id: 'play',
            class: 'fas fa-play pointer',
            click: () => {
                $('#audio').trigger('play');
                $('#play').css({'opacity': .3, 'pointer-events': 'none'});
                $('#pause, #stop').css({'opacity': 1, 'pointer-events': 'all'});
            }
        }).appendTo(audioWrapper)

        $('<i>', {
            id: 'stop',
            class: 'fas fa-stop pointer',
            click: () => {
                $('#audio').trigger('pause');
                $('#audio')[0].currentTime = 0;
                $('#stop, #pause').css({'opacity': .3, 'pointer-events': 'none'});
                $('#play').css({'opacity': 1, 'pointer-events': 'all'});
            }
        }).appendTo(audioWrapper)

        $('<i>', {
            id: 'closeAudio',
            class: 'fas fa-times pointer',
            click: () => {
                $('#audioWrapper').remove();
            }
        }).appendTo(audioWrapper)

        document.getElementById("audio").onended = () => {
            $('#audio')[0].currentTime = 0;
            $('#stop, #pause').css({'opacity': .3, 'pointer-events': 'none'});
            $('#play').css({'opacity': 1, 'pointer-events': 'all'});
        };

        setTimeout(() => {
            $('#audio').trigger('play');
        }, 1500)
    }
}

const checkLength = (length, div) => {
    if (length < 4) {
        $(div).css('justify-content', 'center');
    } else {
        $(div).css('justify-content', 'unset');
    }
}

const emptyChosen = (type, hideMain) => {

	$('#spinnerWrapper').show();
    $('main, footer, #menuOpenWrapper, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});
    $('html, body').scrollTop(0);
    $('#progressBar').css('width', 0); 

    $.each($('.sortable'), function (key, value) {   
        if ($(value).attr('isSorted') == 'true') {
            $(value).attr('isSorted', 'false');
            sortByOrder($(value));
        }
    })

	if(hideMain) {
		$('main').hide();
	}

	if(type == 1) {
	    $('#chosenMovie').css({'pointer-events': 'none', 'opacity': 0});
		$('#overview, #personOverviewWrapper, #tvShowSeasonsWrapper, #guestCast, #guestCastHeader').remove();
		$('#wishlistContainer, #playingNowContainer, #trendingContainer,  #upcomingContainer, #popular, #genreChosen, #providerContainer').empty().hide();
	} 

    $('#personInstagramWrapper, #chosenPersonImgWrapper, #personMovies, #personImages, #productionCompenies, #overview, #watchProviders, #directorsWrapper, #castWrapper, #similarMoviesContent, #chosenMovieImagesWrapper, #videosWrapper, #searchResults').empty();
    $('#chosenMovieImdb').attr('href', 'https://www.imdb.com');
    $('#chosenMovieImg').attr('src', '');   
    $('#chosenMovieSentence, #movieDate, #movieRuntime, #movieRevenue, #movieRating, #movieLang, #castHeader, #similarHeader, #chosenMovieTitle').html('');
    $('#personBirthDate, #personDeathDate, #personHometown, #chosenPerson, #chosenMovieDate, #chosenMovieRuntime, #chosenMovieRevenue, #chosenMovie, #seasons, #episodes, #chosenMovieRating, #chosenMovieGenres, #chosenMovieLang, #similarMovies, #chosenMovieImagesWrapper, #videosWrapper, #searchResults').hide();
    $('#chosenPersonName, #birthDate, #deathDate, #hometown').html('');
    $('#personCreditsHeader, #audioWrapper, #genresContent, #overview, #personOverviewWrapper, #tvShowSeasonsWrapper, #guestCast, #guestCastHeader').remove();
	$('#wishlistContainer, #playingNowContainer, #trendingContainer, #upcomingContainer, #popular, #genreChosen, #providerContainer').empty().hide();
}

const goToTop = () => {
    $('html,body').animate({ scrollTop: 0 }, 1000);
}

const scrollBtn = () =>{
    if ($(this).scrollTop() > 550) {
        $('#goToTopBtn').fadeIn();
    }
    else {
        $('#goToTopBtn').fadeOut();
    }
}

const updateVotes = (data, wrapper) => {
    if (data !== null || data !== 0) {
        let finalVoteText;
        finalVoteText = data.toString();

        if ((finalVoteText.length == 1 && data !== '0') || data == '10') {
            finalVoteText = data + '.0'
        } else {
            finalVoteText = data;
        }

        finalVoteText = finalVoteText.toString();

        if (finalVoteText !== 0 && finalVoteText !== undefined) {
            let voteWrapper = $('<div>', {
                class: 'voteWrapper filter',
            }).appendTo(wrapper);

            $('<span>', {
                class: 'voteBackground',
                voteCount: finalVoteText
            }).appendTo(voteWrapper);

            let voteTextContent = $('<div>', {
                class: 'voteTextContent',
            }).appendTo(voteWrapper);

            $('<i>', {
                class: 'fas fa-star voteStar',
            }).appendTo(voteTextContent);

            $('<span>', {
                class: 'vote',
                text: finalVoteText
            }).appendTo(voteTextContent);
        }
    }
}
