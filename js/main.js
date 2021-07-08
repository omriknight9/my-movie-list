
let marvelMovies = [];
let dcMovies = [];
let valiantMovies = [];
let otherMovies = [];
let animationMovies = [];
let tvShows = [];
let ultraMovies = [];
let cinematicType;
let counter = 1;
let marvelCinematicCounter = 1;
let dcCinematicCounter = 1;
let marvelCounter = 1;
let DCCounter = 1;
let valiantCounter = 1;
let othersCounter = 1;
let animationCounter = 1;
let upcomingCounter = 1;
let playingNowCounter = 1;
let genreCounter = 1;
let selectedDiv;
let lastChar;
let searchVal;
let cinematicArr = [];
let tvShowTimelineArr = [];

const baseUrl = 'https://api.themoviedb.org/3';
const tmdbKey = '0271448f9ff674b76c353775fa9e6a82';
const movieInfoUrl = baseUrl + '/movie/';
const tvShowInfoUrl = baseUrl + '/tv/';
const movieActorsUrl = baseUrl + '/person/';
const youtubeVideo = 'https://www.youtube.com/embed/';
const listUrl = baseUrl + '/list/';
const searchMovieUrl = baseUrl + '/search/multi?api_key=' + tmdbKey + '&query=';
const upcomingUrl = movieInfoUrl + 'upcoming?api_key=' + tmdbKey + '&language=en-US&region=US&page=';
const nowPlayingUrl = movieInfoUrl + 'now_playing?api_key=' + tmdbKey + '&language=en-US&region=US&page=';
const getTrendingUrl = baseUrl + '/trending/all/day?api_key=' + tmdbKey + '&language=en-US&page=';
const moviesGenreUrl = baseUrl + '/discover/movie?api_key=' + tmdbKey + '&language=en-US&with_genres=';
const tvGenreUrl = baseUrl + '/discover/tv?api_key=' + tmdbKey + '&language=en-US&with_genres=';

let directorCounter = 0;
let commentsArr = [];

$(document).ready(() => {

    if (window.location.href.indexOf("?movie=") > -1) {
        const urlParams = new URLSearchParams(window.location.search);
        const value = Number(urlParams.get('value'));
        chosenMovie(value, 1);

        $(window).on('popstate', function() {
            goHome();
            window.history.replaceState({}, document.title, "/" + "my-movie-list/");
        });

        window.onscroll = () => {
            scrollBtn();
            lazyload();
            scrollIndicator();
            checkSoundOnScroll();
        }
    } else if (window.location.href.indexOf("?tvShow=") > -1) {
        const urlParams = new URLSearchParams(window.location.search);
        const value = Number(urlParams.get('value'));
        chosenMovie(value, 2);

        $(window).on('popstate', function() {
            goHome();
            window.history.replaceState({}, document.title, "/" + "my-movie-list/");
        });

        window.onscroll = () => {
            scrollBtn();
            lazyload();
            scrollIndicator();
            checkSoundOnScroll();
        }

    } else if (window.location.href.indexOf("?actor=") > -1) {

        const urlParams = new URLSearchParams(window.location.search);
        const value = Number(urlParams.get('value'));

        $('#playingNowContainer, #trendingContainer, #upcomingContainer, #popular, #searchResults, #genreChosen').empty().hide();
        $('#search').val('');
        $('main').hide();

        getPersonDetails(value, 1);

        $(window).on('popstate', function() {
            goHome();
            window.history.replaceState({}, document.title, "/" + "my-movie-list/");
        });
    } else if (window.location.href.indexOf("?director=") > -1) {

        const urlParams = new URLSearchParams(window.location.search);
        const value = Number(urlParams.get('value'));

        $('#playingNowContainer, #trendingContainer, #upcomingContainer, #popular, #searchResults, #genreChosen').empty().hide();
        $('#search').val('');
        $('main').hide();

        getPersonDetails(value, 2);

        $(window).on('popstate', function() {
            goHome();
            window.history.replaceState({}, document.title, "/" + "my-movie-list/");
        });

        window.onscroll = () => {
            scrollBtn();
            lazyload();
            scrollIndicator();
        }
    } else if (window.location.href.indexOf("?timeline=") > -1) {
        window.history.replaceState({}, document.title, "/" + "my-movie-list/");
        window.onscroll = () => {
            scrollBtn();
            lazyload();
            scrollIndicator();
        }
    } else {
        window.onscroll = () => {
            scrollBtn();
            lazyload();
            scrollIndicator();
        }
    }

    loadJson();

    window.onbeforeunload = () => {
        window.scrollTo(0, 0);
    }

    $('.Xbtn').click(function () {
        if($(this).parent().parent().attr('id') == 'movieDetails') {
            $('#movieDetails').attr('chosenMovieId', '');
        }
        
        $(this).parent().parent().fadeOut(150);
    })

    setTimeout(() => {
        $('#spinnerWrapper').hide();
        $('.searchContainer').show();
        $('button').show();
        $('.container, footer').css('display', 'flex');
        $('#upcomingContainer, #playingNowContainer, #popular, #genreChosen, #trendingContainer').hide();
    }, 2000);

    $('#search').on('keyup', () => {
        if ($('.sortContainer').is(':visible')) {
            $('.sortContainer').hide();
            DCCounter = 1;
            marvelCounter = 1;
            valiantCounter = 1;
            othersCounter = 1;
            animationCounter = 1;
            upcomingCounter = 1;
            playingNowCounter = 1;
            genreCounter = 1;
        }

        closeMenus();

        searchVal = $('#search').val();
        lastChar = searchVal.substr(searchVal.length - 1);
    
        if (lastChar == ' ') {
            return;
        } 

        if (searchVal.length == 0) {
            $('#searchResults').empty().hide();
        } else {
            showResults(searchVal);
        }
    })
});

const getList = (value, div, wrapper, type, movieOrTv) => {

    let arr = [];

    $.get('https://api.themoviedb.org/4/list/' + value + '?api_key=' + tmdbKey + '&language=en-US', (data) => {

        $.each(data.comments, function (key, value) {
            if (value !== null) {
                let obj = {
                    value: key.replace('movie:', ''),
                    quality: value
                }

                commentsArr.push(obj);
            }
        });

        for (var i = 0; i < data.results.length; i++) {
            arr.push(data.results[i]);
        }

        if (data.total_pages > 1) {
            for (let i = 2; i < data.total_pages + 1; i++) {
                $.get('https://api.themoviedb.org/4/list/' + value + '?api_key=' + tmdbKey + '&language=en-US&page=' + i, (data) => {

                    $.each(data.comments, function (key, value) {
                        if (value !== null) {   
                            let obj = {
                                value: key.replace('movie:', ''),
                                quality: value
                            }
            
                            commentsArr.push(obj);
                        }
                    });

                    for (var j = 0; j < data.results.length; j++) {
                        arr.push(data.results[j]);
                    }
                });
            }

            setTimeout(() => {
                if (movieOrTv == 1) {
                    buildMoviesFromTmdb(arr, div, wrapper, type); 
                } else {
                    buildTvShowFromTmdb(arr, 'tvShow', $('#tvShowContainer'));
                }

            }, 1000)
        } else {
            setTimeout(() => {
                if (movieOrTv == 1) {
                    buildMoviesFromTmdb(arr, div, wrapper, type); 
                } else {
                    buildTvShowFromTmdb(arr, 'tvShow', $('#tvShowContainer'));
                }
            }, 1000)
        }
    });
}

const showTrending = () => {

    if ($("#trendingContainer").text().length > 0) {
        return;
    }

    $('#spinnerWrapper').show();
    $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});

    setTimeout(() => {
        $('#spinnerWrapper').hide();
        $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
    }, 2000)

    if ($('#chosenMovie').is(':visible') || $('#chosenPerson').is(':visible') || $('#timeline').is(':visible')) {
        goToDiv('#trendingContainer');
    }

    $('.container').hide();
    $('#playingNowContainer, #trendingContainer, #upcomingContainer, #popular, #genreChosen').empty().hide();

    let totalPages;
    let arr = [];

    $.get(getTrendingUrl + 1, (data) => {
        for (var i = 0; i < data.results.length; i++) {
            arr.push(data.results[i]);
        }

        totalPages = data.total_pages;

        if (totalPages > 1) {
            setTimeout(() => {
                $.get(getTrendingUrl + 2, (data) => {
                    for (var j = 0; j < data.results.length; j++) {
                        arr.push(data.results[j]);
                    }
        
                    setTimeout(() => {
                        $('#trendingContainer').css('display', 'flex');
                        buildTrending(arr, 'trending', $('#trendingContainer'));
                    }, 500)
                });
            }, 1000)
        }
    });
}


const showPlayingNow = () => {

    if ($("#playingNowContainer").text().length > 0) {
        return;
    }

    $('#spinnerWrapper').show();
    $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});

    setTimeout(() => {
        $('#spinnerWrapper').hide();
        $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
    }, 2000)

    if ($('#chosenMovie').is(':visible') || $('#chosenPerson').is(':visible') || $('#timeline').is(':visible')) {
        goToDiv('#playingNowContainer');
    }

    $('.container').hide();
    $('#playingNowContainer, #trendingContainer, #upcomingContainer, #popular, #genreChosen').empty().hide();

    let totalPages;
    let arr = [];

    $.get(nowPlayingUrl + 1, (data) => {
        for (var i = 0; i < data.results.length; i++) {
            arr.push(data.results[i]);
        }

        totalPages = data.total_pages;

        if (totalPages > 1) {
            setTimeout(() => {
                $.get(nowPlayingUrl + 2, (data) => {
                    for (var j = 0; j < data.results.length; j++) {
                        arr.push(data.results[j]);
                    }
        
                    setTimeout(() => {
                        $('#playingNowContainer').css('display', 'flex');
                        buildMoviesFromTmdb(arr, 'playingNow', $('#playingNowContainer'), 8);
                    }, 500)
                });
            }, 1000)
        }
    });
}

const showUpcoming = () => {

    if ($("#upcomingContainer").text().length > 0) {
        return;
    }

    $('#spinnerWrapper').show();
    $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});

    setTimeout(() => {
        $('#spinnerWrapper').hide();
        $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
    }, 2000)

    if ($('#chosenMovie').is(':visible') || $('#chosenPerson').is(':visible') || $('#timeline').is(':visible')) {
        goToDiv('#upcomingContainer');
    }

    $('.container').hide();
    $('#playingNowContainer, #trendingContainer, #upcomingContainer, #popular, #genreChosen').empty().hide();

    let totalPages;
    let arr = [];

    $.get(upcomingUrl + 1, (data) => {
        for (var i = 0; i < data.results.length; i++) {
            arr.push(data.results[i]);
        }

        totalPages = data.total_pages;

        if (totalPages > 1) {
            setTimeout(() => {
                $.get(upcomingUrl + 2, (data) => {
                    for (var j = 0; j < data.results.length; j++) {
                        arr.push(data.results[j]);
                    }
        
                    setTimeout(() => {
                        $('#upcomingContainer').css('display', 'flex');
                        buildMoviesFromTmdb(arr, 'upcoming', $('#upcomingContainer'), 7);
                    }, 500)
                });
            }, 1000)
        }
    });
}

const switchContent = (type) => {
    emptyChosen();
    $('#spinnerWrapper').show();
    $('main, footer, #menuOpenWrapper, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});
    $('html,body').scrollTop(0);
    $('#progressBar').css('width', 0);

    let time;

    if (type == 1) {
        time = 500;
    } else {
        time = 2000;
    }

    setTimeout(() => {
        $('#spinnerWrapper').hide();
        $('main, footer, #menuOpenWrapper, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
    }, time)
}

const showResults = (value) => {
    $.get(searchMovieUrl + value + "&language=en-US", (data) => {
        if (data == 'undefind' || data == null) {
            return;
        }

        $('#searchResults').empty();

        if (data.results.length > 0) {
            $('#searchResults').show();
        } else {
            $('#searchResults').hide();
        }

        for (let i = 0; i < data.results.length; i++) {

            if (data.results[i].media_type == 'movie' || data.results[i].media_type == 'tv') {

                let finalReleaseDate;

                if (data.results[i].media_type == 'tv') {
                    finalReleaseDate = data.results[i].first_air_date;
                } else if (data.results[i].media_type == 'movie') {
                    finalReleaseDate = data.results[i].release_date;
                }
            }

            let finalTitle;
            let posterUrl;        

            if (data.results[i].media_type == 'movie' || data.results[i].media_type == 'tv') {
                if (data.results[i].poster_path == null) {
                    posterUrl = './images/stock.png';
                } else {
                    posterUrl = 'https://image.tmdb.org/t/p/w1280' + data.results[i].poster_path;
                }

            } else {
                if (data.results[i].profile_path == null) {
                    posterUrl = './images/stock.png';
                } else {
                    posterUrl = 'https://image.tmdb.org/t/p/w1280' + data.results[i].profile_path;
                }   
            }
        
            switch (data.results[i].media_type) {
                case 'movie':
                    finalTitle = data.results[i].title;
                    if (data.results[i].release_date !== '') {
                        finalReleaseDate = configureDate(data.results[i].release_date);  
                    } else {
                        finalReleaseDate = 'Unknown';
                    }
    
                    break;
                case 'tv':
                    finalTitle = data.results[i].name;
                    if (data.results[i].first_air_date !== '') {
                        finalReleaseDate = configureDate(data.results[i].first_air_date);  
                    } else {
                        finalReleaseDate = 'Unknown';
                    }
    
                    break;
                case 'person':
                    finalTitle = data.results[i].name;
                    break;
            
                default:
                    finalTitle = 'No Name';
                    finalReleaseDate = 'No Date';
                    break;
            }

            let resultWrapper = $('<div>', {
                class: 'resultRow',
                popularity: data.results[i].popularity,
                name: finalTitle,
                id: data.results[i].id,
                type: data.results[i].media_type,
                click: () => {

                    window.history.replaceState({}, document.title, "/" + "my-movie-list/");

                    switch (data.results[i].media_type) {
                        case 'movie':
                            $('#search').val('');
                            $('main').hide();
                            chosenMovie(data.results[i].id, 1);
                            break;
                        case 'tv':
                            $('#search').val('');
                            $('main').hide();
                            chosenMovie(data.results[i].id, 2);
                            break;
                        case 'person':
                            $('#search').val('');
                            $('main').hide();
                            getPersonDetails(data.results[i].id, 1);
                            break;
                    }
                }
            }).appendTo($('#searchResults'));

            let resultPoster = $('<img>', {
                class: 'resultPoster',
                alt: 'poster',
                src: posterUrl
            }).appendTo(resultWrapper);

            let resultName = $('<p>', {
                class: 'resultName',
                text: capitalize(finalTitle)
            }).appendTo(resultWrapper);

            if (data.results[i].media_type !== 'person') {
                let resultDate = $('<p>', {
                    class: 'resultDate',
                    text: finalReleaseDate
                }).appendTo(resultWrapper);
            } else {
                if (data.results[i].known_for.length !== 0) {
                    let finalKnownFor;
                    if (data.results[i].known_for[0].media_type == 'movie') {
                        finalKnownFor = data.results[i].known_for[0].title;
                    } else {
                        finalKnownFor = data.results[i].known_for[0].original_name;
                    }
                    let knownFor = $('<p>', {
                        class: 'knownFor',
                        text: finalKnownFor
                    }).appendTo(resultWrapper);
                }
            }
        }

        sortPopularMovies($('#searchResults'), 'popularity', 1);
    });
}

const lazyload = () => {

    let lazyloadImages = document.querySelectorAll(".lazy");

    let scrollTop = window.pageYOffset;

    lazyloadImages.forEach((img) => {
        if (img.getBoundingClientRect().top + 200 < (window.innerHeight)) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        }
    });
}

const loadJson = () => {

    var promise1 = new Promise((resolve) => {
        resolve(getList(7099604, 'marvel', $('#marvelContainer'), 1, 1));
    });

    promise1.then(() => {
        getList(7099603, 'dc', $('#dcContainer'), 2, 1);
    });

    promise1.then(() => {
        getList(7099609, 'valiant', $('#valiantContainer'), 3, 1);
    });

    promise1.then(() => {
        getList(7099605, 'others', $('#othersContainer'), 4, 1);
    });

    promise1.then(() => {
        getList(7099575, 'animation', $('#animationContainer'), 5, 1);
    });

    promise1.then(() => {
        getList(7099607, 'tvShow', $('#tvShowContainer'), null, 2);
    });

    promise1.then(() => {
        getList(7099559, '4k', $('#ultraContainer'), 6, 1);
    });

    promise1.then(() => {
        setTimeout(() => {
            $.each($('.movieWrapper:not(#ultraContainer .movieWrapper)'), function (key, value) {
                for (let i = 0; i < commentsArr.length; i++) {
                    if (commentsArr[i].value == $(value).attr('value')) {
                        $(value).attr('quality', commentsArr[i].quality);
                    } 
                }
            });
        }, 3000)
    });
}

const buildTrending = (data, div, wrapper) => {

    let typeheader = $('<h2>', {
        class: 'typeheader',
        text: 'Trending'
    }).appendTo(wrapper);

    let headerLine = $('<div>', {
        class: 'line lineTrending',
    }).appendTo(wrapper);

    let headerLogo = $('<span>', {
        class: 'headerLogo',
    }).appendTo(headerLine);

    let trendingContent = $('<div>', {
        id: 'trendingContent',
    }).appendTo(wrapper);

    for (let i = 0; i < data.length; i++) {

        let type;

        if (data[i].media_type == 'movie') {
            type = 1;
        } else if (data[i].media_type == 'tv') {
            type = 2;
        }

        if (type == 1 || type == 2) {
            let trendingWrapper = $('<div>', {
                class: 'trendingWrapper hoverEffect ' + div,
                'date': data[i].release_date,
                'value': data[i].id,
                click: () => {
                    chosenMovie(data[i].id, type);
                }
            }).appendTo(trendingContent)
    
            let dataSrc;
            let finalSrc;
            let finalClass;
    
            if (i < 10) {
                dataSrc = '';
                finalClass = 'movieImg';
    
                if (data[i].poster_path == null) {
                    finalSrc = './images/stock.png';
                } else {
                    finalSrc = 'https://image.tmdb.org/t/p/w1280' + data[i].poster_path;
                }
            } else {
                if (data[i].poster_path == null) {
                    dataSrc = './images/stock.png';
                    finalSrc = './images/stock.png';
                } else {
                    dataSrc = 'https://image.tmdb.org/t/p/w1280' + data[i].poster_path;
                    finalSrc = './images/stock.png';
                }
                finalClass = 'movieImg lazy';
            }
    
            let movieImg = $('<img>', {
                class: finalClass,
                alt: 'movieImg',
                'data-src': dataSrc,
                'src': finalSrc
            }).appendTo(trendingWrapper);

            let finalTitle;
            let finalDate;

            if (type == 1) {
                finalTitle = data[i].title;
                finalDate = data[i].release_date;
            } else {
                finalTitle = data[i].name;
                finalDate = data[i].first_air_date;
            }
    
            let movieFullName = $('<p>', {
                class: 'name',
                text: capitalize(finalTitle),
            }).appendTo(trendingWrapper);
    
            let movieDate = $('<p>', {
                class: 'date',
                text: configureDate(finalDate)
            }).appendTo(trendingWrapper);
    
            if (data[i].vote_average !== null && data[i].vote_average !== 0) {
    
                let finalVoteText;
    
                finalVoteText = data[i].vote_average.toString();
        
                if ((finalVoteText.length == 1 && data[i].vote_average !== '0') || data[i].vote_average == '10') {
                    finalVoteText = data[i].vote_average + '0'
                } else {
                    finalVoteText = data[i].vote_average;
                }
        
                finalVoteText = finalVoteText.toString();
                finalVoteText = finalVoteText.replace('.', '') + '%';
    
                let voteWrapper = $('<div>', {
                    class: 'voteWrapper',
                }).appendTo(trendingWrapper);
    
                let voteBackground = $('<span>', {
                    class: 'voteBackground',
                    voteCount: finalVoteText.replace('%', '')
                }).appendTo(voteWrapper);
    
                let voteTextContent = $('<div>', {
                    class: 'voteTextContent',
                }).appendTo(voteWrapper);
    
                let vote = $('<span>', {
                    class: 'vote',
                    text: finalVoteText
                }).appendTo(voteTextContent);
    
                updateVotes();
            }
        }
    } 

}

const buildMoviesFromTmdb = (data, div, wrapper, type) => {

    let headerText;
    let typeSortClick = wrapper;
    let headerLineClass;

    switch (type) {
        case 1:
            headerText = 'Marvel';
            headerLineClass = 'lineMarvel';
            break;
        case 2:
            headerText = 'DC';
            headerLineClass = 'lineDc';
            break;
        case 3:
            headerText = 'Valiant';
            headerLineClass = 'lineValiant';
            break;
        case 4:
            headerText = 'Others';
            headerLineClass = 'lineOthers';
            break;
        case 5:
            headerText = 'Animation';
            headerLineClass = 'lineAnimation';
            break;
        case 6:
            headerText = '4K Movies';
            headerLineClass = 'lineUltra';
            break;
        case 7:
            headerText = 'Upcoming';
            headerLineClass = 'lineUpcoming';
            break;
        case 8:
            headerText = 'Playing Now';
            headerLineClass = 'linePlayingNow';
            break;   
        case 9:
            headerText = 'Movies';
            headerLineClass = 'lineGenre';
            break;
    }

    let typeheader = $('<h2>', {
        class: 'typeheader',
        text: headerText
    }).appendTo(wrapper);

    let headerLine = $('<div>', {
        class: 'line ' + headerLineClass,
    }).appendTo(wrapper);

    let headerLogo = $('<span>', {
        class: 'headerLogo',
    }).appendTo(headerLine);

    let moviesContent = $('<div>', {
        id: 'moviesContent',
    }).appendTo(wrapper);

    if (type !== 6 && type !== 3) {

        let btnWrapper = $('<div>', {
            class: 'btnWrapper',
        }).appendTo(moviesContent);
    
        let sortContainer = $('<div>', {
            class: 'sortContainer',
        }).appendTo(btnWrapper);
    
        let sortContent = $('<div>', {
            class: 'sortContent',
        }).appendTo(sortContainer);
    
        let sortBtn = $('<button>', {
            text: 'Sort',
            click: function () {
                sort($(this).parent().parent(), type);
            }
        }).appendTo(btnWrapper);
    
        let dateSortBtn = $('<button>', {
            text: 'By Date',
            click: () => {
                sortMovies(typeSortClick, 'date', 1);
            }
        }).appendTo(sortContent);
    
        let nameSortBtn = $('<button>', {
            text: 'By Name',
            click: () => {
                sortMovies(typeSortClick, 'name', 2);
            }
        }).appendTo(sortContent);

        if (type == 1 || type == 2) {

            let finalBtnText;
            let finalCinematicUrl;
            let finalTvUrl;
            let tmdbUrl;

            if (type == 1) {
                finalBtnText = 'Next MCU Film';
                finalCinematicUrl = listUrl + '7099064?api_key=' + tmdbKey + '&language=en-US';
                finalTvUrl = listUrl + '7099128?api_key=' + tmdbKey + '&language=en-US';
            } else {
                finalBtnText = 'Next DCEU Film';
                finalCinematicUrl = listUrl + '7099063?api_key=' + tmdbKey + '&language=en-US';
                finalTvUrl = listUrl + '7099130?api_key=' + tmdbKey + '&language=en-US';
            }

            let nextInLineBtn = $('<button>', {
                class: 'nextInLineBtn',
                text: finalBtnText,
                click: () => {

                    if ($('.sortContainer').is(':visible')) {
                        $('.sortContainer').hide();
                        DCCounter = 1;
                        marvelCounter = 1;
                        valiantCounter = 1;
                        othersCounter = 1;
                        animationCounter = 1;
                        upcomingCounter = 1;
                        playingNowCounter = 1;
                        genreCounter = 1;
                    }

                    closeMenus();

                    $('main, #menuOpenWrapper, footer, #goToTopBtn').css({'pointer-events': 'none', 'opacity': '0'});
                    $('.popUpInfo').css({'pointer-events': 'none', 'opacity': '.1'});
                    $('#spinnerWrapper').show();

                    getCinematicInfo(finalCinematicUrl, type);
                    setTimeout(() => {
                        getTVShowInfo(finalTvUrl, type);
                    }, 1000);
                }
            }).appendTo(btnWrapper);
        }    
    }

    for (let i = 0; i < data.length; i++) {
        let movieWrapper = $('<div>', {
            class: 'movieWrapper hoverEffect ' + div,
            'date': data[i].release_date,
            'value': data[i].id,
            click: () => {
                chosenMovie(data[i].id, 1);
            }
        }).appendTo(moviesContent)

        let dataSrc;
        let finalSrc;
        let finalClass;

        if (type == 1 && i < 10 || type == 7 && i < 10 || type == 8 && i < 10 || type == 9 && i < 10) {
            dataSrc = '';
            finalClass = 'movieImg';

            if (data[i].poster_path == null) {
                finalSrc = './images/stock.png';
            } else {
                finalSrc = 'https://image.tmdb.org/t/p/w1280' + data[i].poster_path;
            }
        } else {
            if (data[i].poster_path == null) {
                dataSrc = './images/stock.png';
                finalSrc = './images/stock.png';
            } else {
                dataSrc = 'https://image.tmdb.org/t/p/w1280' + data[i].poster_path;
                finalSrc = './images/stock.png';
            }
            finalClass = 'movieImg lazy';
        }

        let movieImg = $('<img>', {
            class: finalClass,
            alt: 'movieImg',
            'data-src': dataSrc,
            'src': finalSrc
        }).appendTo(movieWrapper);

        let movieFullName = $('<p>', {
            class: 'name',
            text: capitalize(data[i].title),
        }).appendTo(movieWrapper);

        let movieDate = $('<p>', {
            class: 'date',
            text: configureDate(data[i].release_date)
        }).appendTo(movieWrapper);

        if (data[i].vote_average !== null && data[i].vote_average !== 0) {

            let finalVoteText;

            finalVoteText = data[i].vote_average.toString();
    
            if ((finalVoteText.length == 1 && data[i].vote_average !== '0') || data[i].vote_average == '10') {
                finalVoteText = data[i].vote_average + '0'
            } else {
                finalVoteText = data[i].vote_average;
            }
    
            finalVoteText = finalVoteText.toString();
            finalVoteText = finalVoteText.replace('.', '') + '%';

            let voteWrapper = $('<div>', {
                class: 'voteWrapper',
            }).appendTo(movieWrapper);

            let voteBackground = $('<span>', {
                class: 'voteBackground',
                voteCount: finalVoteText.replace('%', '')
            }).appendTo(voteWrapper);

            let voteTextContent = $('<div>', {
                class: 'voteTextContent',
            }).appendTo(voteWrapper);

            let vote = $('<span>', {
                class: 'vote',
                text: finalVoteText
            }).appendTo(voteTextContent);

            updateVotes();
        }
    }
}

const chosenMovie = (value, type) => {

    $('#playingNowContainer, #trendingContainer,  #upcomingContainer, #popular, #genreChosen').empty().hide();
    $('.searchContainer').addClass('chosenSearch');
    $('#spinnerWrapper').show();
    $('#chosenMovie, footer, #menuOpenWrapper, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});

    setTimeout(() => {
        $('#spinnerWrapper').hide();
        $('#chosenMovie, footer, #menuOpenWrapper, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
    }, 2000)

    if ($('.sortContainer').is(':visible')) {
        $('.sortContainer').hide();
        DCCounter = 1;
        marvelCounter = 1;
        valiantCounter = 1;
        othersCounter = 1;
        animationCounter = 1;
        upcomingCounter = 1;
        playingNowCounter = 1;
        genreCounter = 1;
    }

    closeMenus();

    $('main').hide();
    switchContent(2);
    $('#chosenMovie').show();

    let chosenUrl;
    let finalUrl = getFinalUrl(type);

    if (type == 1) {
        chosenUrl = 'movie';
    } else {
        chosenUrl = 'tvShow';
    }

    $.get(finalUrl + value + "?api_key=" + tmdbKey + '&language=en-US', (data) => {

        let finalTitle;

        if (type == 1) {
            finalTitle = data.title;
        } else {
            finalTitle = data.name;
        }

        let finalNameToSend;
   
        finalNameToSend = finalTitle.replace(/'/, "");
        finalNameToSend = finalNameToSend.replace(/-/, "");
        finalNameToSend = finalNameToSend.replace(/:/, "");
        finalNameToSend = finalNameToSend.replace(/\s/g, '');

        window.history.replaceState({}, document.title, "/" + "my-movie-list/");
    
        const url = new URL(window.location);
        url.searchParams.set(chosenUrl, finalNameToSend);
        url.searchParams.set('value', value);
        
        window.history.pushState({}, '', url);
    
        $(window).on('popstate', function() {
            goHome();
            window.history.replaceState({}, document.title, "/" + "my-movie-list/");
        });

        let finalImg;

        if (data.backdrop_path == null || data.backdrop_path == undefined || data.backdrop_path == '') { 
            finalImg = './images/stockMovie.jpg';
        } else {
            finalImg = 'https://image.tmdb.org/t/p/w1280' + data.backdrop_path;
        }
        
        if (type == 2) {
            $('#chosenMovieTitle').html(capitalize(data.name));

            $.get(finalUrl + value + "/external_ids?api_key=" + tmdbKey + '&language=en-US', (data) => {
                if (data.imdb_id !== null) {
                    $('#chosenMovieImdb').attr('href', 'https://www.imdb.com/title/' + data.imdb_id);
                    $('#chosenMovieImdb').css('pointer-events', 'all');
                } else {
                    $('#chosenMovieImdb').css('pointer-events', 'none');
                }
            })
        } else {
            $('#chosenMovieTitle').html(capitalize(data.title));
            if (data.imdb_id !== null) {

                $('#chosenMovieImdb').attr('href', 'https://www.imdb.com/title/' + data.imdb_id);
                $('#chosenMovieImdb').css('pointer-events', 'all');
            } else {
                $('#chosenMovieImdb').css('pointer-events', 'none');
            }
        }

        $('#chosenMovieImg').attr('src', finalImg);
        $('#chosenMovieSentence').html(data.tagline);
        
        if (data.production_companies.length > 0) {
            for (let i = 0; i < data.production_companies.length; i++) {
                if (data.production_companies[i].logo_path !== null && data.production_companies[i].id !== 7297) { 
                    let companyImg = $('<img>', {
                        class: 'companyImg',
                        alt: 'company img',
                        src: 'https://image.tmdb.org/t/p/w1280' + data.production_companies[i].logo_path
                    }).appendTo($('#productionCompenies')); 
                }
            }
        }

        if(data.overview !== null && data.overview !== '' && data.overview !== undefined) {
            let overview = $('<p>', {
                id: 'overview',
                text: data.overview
            }).appendTo($('#movieDesc'));
        }

        if (type == 1) {

            $('#seasons, #episodes').hide();

            if (data.release_date !== '') {
                $('#movieDate').html('Release Date: ' + configureDate(data.release_date));
                $('#chosenMovieDate').show();
            } else {
                $('#chosenMovieDate').hide();
            }

            if (data.runtime !== '0' && data.runtime !== 0) {
                $('#movieRuntime').html('Runtime: ' + convertMinsToHrsMins(data.runtime));
                $('#chosenMovieRuntime').show();
            } else {
                $('#chosenMovieRuntime').hide();
            }

            if (data.revenue !== '0' && data.revenue !== 0) {

                let withCommas = numberWithCommas(data.revenue);
    
                $('#movieRevenue').html('Revenue: ' + ' $ ' + withCommas);
                $('#chosenMovieRevenue').show();
            } else {
                $('#chosenMovieRevenue').hide();
            }

        } else {

            $('#seasons, #episodes').show();

            if (data.release_date !== '') {
                $('#movieDate').html('First Aired: ' + configureDate(data.first_air_date));
                $('#chosenMovieDate').show();
            } else {
                $('#chosenMovieDate').hide();
            }
            $('#chosenMovieRuntime, #chosenMovieRevenue').hide();
            $('#seriesSeasons').html('Seasons: ' + data.number_of_seasons);
            $('#seriesEpisodes').html('Episodes: ' + data.number_of_episodes);
        }

        let finalVoteText;
        finalVoteText = data.vote_average.toString();

        if ((finalVoteText.length == 1 && data.vote_average !== 0) || data.vote_average == '10') {
            finalVoteText = data.vote_average + '0';
        } else {
            finalVoteText = data.vote_average;
        }

        finalVoteText = finalVoteText.toString();
        finalVoteText = finalVoteText.replace('.', '') + '%';
    
        if (finalVoteText !== 0 && finalVoteText !== undefined) {
            $('#movieRating').html('Rating: ' + finalVoteText);
            $('#chosenMovieRating').show();
        } else {
            $('#chosenMovieRating').hide();
        }

        if (data.original_language !== 0 && data.original_language !== undefined) {
            $('#movieLang').html('Language: ' + data.original_language);
            $('#chosenMovieLang').hide();
        } else {
            $('#chosenMovieLang').hide();
        }

        if (data.genres.length > 0) {
            $('#chosenMovieGenres').show();
            let movieObj = [];

            for (let a = 0; a < data.genres.length; a++) {   
                let obj = {
                    id: data.genres[a].id,
                    name: data.genres[a].name
                }
                movieObj.push(obj);
            }

            setTimeout(() => {

                let genresContent = $('<div>', {
                    id: 'genresContent',
                }).appendTo($('#chosenMovieGenres'));

                for (let w = 0; w < movieObj.length; w++) {
                    let genre = $('<span>', {
                        class: 'genre',
                        text: movieObj[w].name,
                        click: () => {

                            $('#spinnerWrapper').show();
                            $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});
                        
                            setTimeout(() => {
                                $('#spinnerWrapper').hide();
                                $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
                            }, 2000)

                            goToDiv('#genreChosen');
                            $('.container').hide();
                            $('#playingNowContainer, #trendingContainer, #upcomingContainer, #popular').empty().hide();

                            let totalPages;
                            let arr = [];

                            let finalGenreUrl;

                            if (type == 1) {
                                finalGenreUrl = moviesGenreUrl + movieObj[w].id;
                            } else {
                                finalGenreUrl = tvGenreUrl + movieObj[w].id;
                            }

                            $.get(finalGenreUrl + '&page=1', (data) => {
                                for (var s = 0; s < data.results.length; s++) {
                                    arr.push(data.results[s]);
                                }

                                totalPages = data.total_pages;

                                if (totalPages > 1) {
                                    setTimeout(() => {
                                        $.get(finalGenreUrl + '&page=2', (data) => {
                                            for (var x = 0; x < data.results.length; x++) {
                                                arr.push(data.results[x]);
                                            }
                                            setTimeout(() => {
                                                $('#genreChosen').css('display', 'flex');
                                                if (type == 1) {
                                                    buildMoviesFromTmdb(arr, 'genreMovie', $('#genreChosen'), 9);
                                                } else {
                                                    buildTvShowFromTmdb(arr, 'genreMovie', $('#genreChosen'));
                                                } 
                                            }, 500)
                                        });
                                    }, 1000)
                                }              
                            });                     
                        }
                    }).appendTo(genresContent);
                }
            }, 500)

        } else {
            $('#chosenMovieGenres').hide();
        }
    });

    setTimeout(() => {
        window.onscroll = () => {
            scrollBtn();
            lazyload();
            scrollIndicator();
            checkSoundOnScroll();
        }
    }, 1000)

    getCredits(value, type);
    getSimilar(value, type);
    getImages(value, type);
    getVideos(value, type);
    getWatchProviders(value, type);
}

const getFinalUrl = (type) => {
    if (type == 1) {
        return movieInfoUrl;
    } else {
        return tvShowInfoUrl;
    }
}

const getWatchProviders = (value, type) => {
    let finalUrl = getFinalUrl(type);

    $.get(finalUrl + value + "/watch/providers?api_key=" + tmdbKey + '&language=en-US&sort_by=popularity.desc', (data) => {

        if (data.results.US !== undefined && data.results.US.flatrate !== undefined) {
            let results = data.results.US.flatrate;

            for (let i = 0; i < results.length; i++) {
                if (results[i].logo_path !== null) {
                    if (results[i].provider_id == 337 || results[i].provider_id == 8 || results[i].provider_id == 384 || results[i].provider_id == 37 || results[i].provider_id == 9 || results[i].provider_id == 15 || results[i].provider_id == 350) {
                        let watchProvider = $('<img>', {
                            class: 'watchProvider',
                            alt: 'watch provider img',
                            src: 'https://image.tmdb.org/t/p/w1280' + results[i].logo_path
                        }).appendTo($('#watchProviders')); 
                    }
                }
            }
        }
    });
}

const getCredits = (value, type) => {

    directorCounter = 0;
    $('#directorsWrapper').hide();
    $('#castHeader').remove();

    let finalUrl = getFinalUrl(type);

    $.get(finalUrl + value + "/credits?api_key=" + tmdbKey + '&language=en-US', (data) => {
        if (type == 1) {
            if (data.crew.length > 0) {

                $('#directorsWrapper').show();

                let directorHeader = $('<p>', {
                    class: 'directorHeader chosenHeader',
                }).appendTo($('#directorsWrapper'));
    
                let directorContent = $('<div>', {
                    id: 'directorContent',
                }).appendTo($('#directorsWrapper'));
    
                for (let w = 0; w < data.crew.length; w++) {
                    if(data.crew[w].job == 'Director') {
                        directorCounter++;
    
                        try {
                            let directorImgPath;
        
                            if (data.crew[w].profile_path == 'undefined' || data.crew[w].profile_path == null || data.crew[w].profile_path == '') {
        
                                switch (data.crew[w].gender) {
                                    case 0:
                                        directorImgPath = './images/actor.jpg';
                                        break;
                                    case 1:
                                        directorImgPath = './images/actress.jpg';
                                        break;
                                    case 2:
                                        directorImgPath = './images/actor.jpg';
                                        break;
                                }
                            } else {
                                directorImgPath = 'https://image.tmdb.org/t/p/w1280' + data.crew[w].profile_path;
                            }
        
                            let director = $('<div>', {
                                class: 'director'
                            }).appendTo(directorContent);
    
                            let directorName = $('<div>', {
                                class: 'directorName',
                            }).appendTo(director);
        
                            let directorImg = $('<img>', {
                                class: 'directorImg hoverEffect lazy',
                                'data-src': directorImgPath,
                                'src': './images/actor.jpg',
                                alt: 'director',
                                id: data.crew[w].id,
                                click: () => {
                                    getPersonDetails(data.crew[w].id, 2);
                                }
                            }).appendTo(directorName);
    
                            let actorName = $('<span>', {
                                class: 'actorName',
                                text: data.crew[w].name
                            }).appendTo(directorName);
    
                            let directorLinksWrapper = $('<div>', {
                                class: 'directorLinksWrapper',
                            }).appendTo(directorName);
    
                            $.get(movieActorsUrl + data.crew[w].id + "/external_ids?api_key=" + tmdbKey + "&language=en-US", (data) => {
                                if(data.imdb_id !== null) {
    
                                    let imdbLinkWrapper = $('<a>', {
                                        class: 'imdbLinkWrapper',
                                        rel: 'noopener',
                                        target: '_blank',
                                        href: 'https://www.imdb.com/name/' + data.imdb_id
                                    }).appendTo(directorLinksWrapper);
                
                                    let imdbLink = $('<img>', {
                                        class: 'directorImdbLink',
                                        src: './images/imdb.png',
                                        alt: 'imdbImg'
                                    }).appendTo(imdbLinkWrapper);
                                }
    
                                if(data.instagram_id !== null) {
                                        
                                    let instagramWrapper = $('<a>', {
                                        class: 'instagramWrapper',
                                        rel: 'noopener',
                                        target: '_blank',
                                        href: 'https://www.instagram.com/' + data.instagram_id
                                    }).appendTo(directorLinksWrapper);
                
                                    let instagramLink = $('<img>', {
                                        class: 'directorInstagramLink',
                                        src: './images/instagram.png',
                                        alt: 'instagramImg',
                                    }).appendTo(instagramWrapper);
                                }
                            });
        
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
    
                setTimeout(() => {
                    if (directorCounter > 1) {
                        $('.directorHeader').html('Directors');
                    } else {
                        $('.directorHeader').html('Director');
                    }
                }, 1000)
            }
        }

        if (data.cast.length > 0) {

            if (data.cast.length < 21) {
                finalLength = data.cast.length;
            } else {
                finalLength = 21;
            }

            let castHeader = $('<p>', {
                id: 'castHeader',
                class: 'chosenHeader',
                text: 'Cast'
            }).appendTo($('#castWrapper'));

            let castContent = $('<div>', {
                id: 'castContent',
                class: 'content'
            }).appendTo($('#castWrapper'));

            for (let k = 0; k < finalLength; k++) {

                try {
    
                    let actorImgPath;

                    if (data.cast[k].profile_path == 'undefined' || data.cast[k].profile_path == null || data.cast[k].profile_path == '') {

                        switch (data.cast[k].gender) {
                            case 0:
                                actorImgPath = './images/actor.jpg';
                                break;
                            case 1:
                                actorImgPath = './images/actress.jpg';
                                break;
                            case 2:
                                actorImgPath = './images/actor.jpg';
                                break;
                        }
                    } else {
                        actorImgPath = 'https://image.tmdb.org/t/p/w1280' + data.cast[k].profile_path;
                    }

                    let trimmedString;

                    if (data.cast[k].character.length > 25) {

                        if (countInstances(data.cast[k].character, '/') > 1) {

                            trimmedString = data.cast[k].character.substr(0, 25);
                            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

                            trimmedString = data.cast[k].character.split('/');

                            if (trimmedString.length > 2) {
                                trimmedString = trimmedString[0] + '/' + trimmedString[1] + '& More';
                            } else {
                                trimmedString = trimmedString[0] + '/' + trimmedString[1];
                            }
    
                        } else {
                            trimmedString = data.cast[k].character;
                        }

                    } else {
                        trimmedString = data.cast[k].character;
                    }

                    let actor = $('<div>', {
                        class: 'actor',
                    }).appendTo(castContent);

                    let actorImg = $('<img>', {
                        class: 'actorImg hoverEffect lazy',
                        'data-src': actorImgPath,
                        'src': './images/actor.jpg',
                        alt: 'actorImg',
                        id: data.cast[k].id,
                        click: () => {
                            getPersonDetails(data.cast[k].id, 1);
                        }
                    }).appendTo(actor);

                    let finalActorName;

                    if (data.cast[k].character == '') {
                        finalActorName = data.cast[k].name;
                    } else {
                        finalActorName = data.cast[k].name + ':';
                    }

                    let actorName = $('<span>', {
                        class: 'actorName',
                        text: finalActorName
                    }).appendTo(actor);

                    let characterName = $('<span>', {
                        class: 'characterName',
                        text: trimmedString
                    }).appendTo(actor);


                    let actorLinksWrapper = $('<div>', {
                        class: 'linksWrapper',
                    }).appendTo(actor);

                    $.get(movieActorsUrl + data.cast[k].id + "/external_ids?api_key=" + tmdbKey + "&language=en-US", (data) => {
                        if(data.imdb_id !== null) {

                            let imdbLinkWrapper = $('<a>', {
                                class: 'imdbLinkWrapper',
                                rel: 'noopener',
                                target: '_blank',
                                href: 'https://www.imdb.com/name/' + data.imdb_id
                            }).appendTo(actorLinksWrapper);
        
                            let imdbLink = $('<img>', {
                                class: 'actorImdbLink',
                                src: './images/imdb.png',
                                alt: 'imdbImg'
                            }).appendTo(imdbLinkWrapper);
                        }

                        if(data.instagram_id !== null) {
                                
                            let instagramWrapper = $('<a>', {
                                class: 'instagramWrapper',
                                rel: 'noopener',
                                target: '_blank',
                                href: 'https://www.instagram.com/' + data.instagram_id
                            }).appendTo(actorLinksWrapper);
        
                            let instagramLink = $('<img>', {
                                class: 'actorInstagramLink',
                                src: './images/instagram.png',
                                alt: 'instagramImg',
                            }).appendTo(instagramWrapper);
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        }
    });
}

const getPersonDetails = (value, type) => {

    $('.searchContainer').addClass('chosenSearch');

    $('#spinnerWrapper').show();
    $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});

    setTimeout(() => {
        $('#spinnerWrapper').hide();
        $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
    }, 2000)

    switchContent(2);

    $('#chosenPerson').show();

    $.get(movieActorsUrl + value + "?api_key=" + tmdbKey + "&language=en-US", (data) => {
        $('#chosenPersonName').html(data.name);

        let finalNameToSend;
    
        finalNameToSend = data.name.replace(/'/, "");
        finalNameToSend = finalNameToSend.replace(/-/, "");
        finalNameToSend = finalNameToSend.replace(/:/, "");
        finalNameToSend = finalNameToSend.replace(/\s/g, '');

        window.history.replaceState({}, document.title, "/" + "my-movie-list/");

        const url = new URL(window.location);
        
        if (type == 1) {
            url.searchParams.set('actor', finalNameToSend);
        } else {
            url.searchParams.set('director', finalNameToSend);
        }


        url.searchParams.set('value', value);
        window.history.pushState({}, '', url);

        $(window).on('popstate', function() {
            goHome();
            window.history.replaceState({}, document.title, "/" + "my-movie-list/");
        });

        let finalImg;

        if (data.profile_path == null || data.profile_path == undefined || data.profile_path == '') {
            if (data.gender == 0 || data.gender == 2) {
                finalImg = './images/actor.jpg';
            } else {
                finalImg = './images/actress.jpg';
            }
            
        } else {
            finalImg = 'https://image.tmdb.org/t/p/w1280' + data.profile_path;
        }

        if (data.imdb_id !== '' && data.imdb_id !== null) {

            let personImdb = $('<a>', {
                id: 'chosenPersonImdb',
                target: '_blank',
                rel: 'noopener',
                href: 'https://www.imdb.com/name/' + data.imdb_id
            }).appendTo($('#chosenPersonImgWrapper'));

            let personImdbImg = $('<img>', {
                id: 'chosenPersonImg',
                src: finalImg,
                alt: 'person img',
            }).appendTo(personImdb);
        }

        if (data.runtime !== '0' && data.runtime !== 0) {
            $('#movieRuntime').html('Runtime: ' + convertMinsToHrsMins(data.runtime));
            $('#chosenMovieRuntime').show();
        } else {
            $('#chosenMovieRuntime').hide();
        }

        if (data.birthday !== null) {

            $('#personBirthDate').show();

            let finalAge = getAge(data.birthday, 1);
            let finalAgeText;

            if (data.deathday == null) {
                finalAgeText = 'Birth Date: ' + configureDate(data.birthday) + ' (Age: ' + finalAge + ')';
            } else {
                finalAgeText = 'Birth Date: ' + configureDate(data.birthday);
            }

            $('#birthDate').html(finalAgeText);
        } else {
            $('#personBirthDate').hide();
        }

        if(data.deathday !== null) {
            $('#personDeathDate').show();
            let deathAge = getAge(data.deathday, 2, data.birthday);
            $('#deathDate').html('Death Date: ' + configureDate(data.deathday) + ' (Age: ' + deathAge + ')');
        } else {
            $('#personDeathDate').hide();
        }

        if(data.place_of_birth !== null) {
            $('#personHometown').show();
            $('#hometown').html('Hometown: ' + data.place_of_birth);
        } else {
            $('#personHometown').hide();
        }
    });

    getPersonCredits(value, type);
    getPersonExternalIds(value);
    getPersonImages(value);
    getPersonMovieImages(value);
}

const getPersonExternalIds = (value) => {
    $.get(movieActorsUrl + value + "/external_ids?api_key=" + tmdbKey + '&language=en-US', (data) => {

        if(data.instagram_id !== null) {
                                        
            let personInstagramLink = $('<a>', {
                id: 'personInstagramLink',
                rel: 'noopener',
                target: '_blank',
                href: 'https://www.instagram.com/' + data.instagram_id
            }).appendTo($('#personInstagramWrapper'));

            let personInstagramImg = $('<img>', {
                id: 'personInstagramImg',
                src: './images/instagram.png',
                alt: 'instagramImg',
            }).appendTo(personInstagramLink);
        }
    })
}

const getPopular = () => {
    if ($("#popular").text().length > 0) {
        return;
    }

    if ($('#chosenMovie').is(':visible') || $('#chosenPerson').is(':visible')) {
        goToDiv('#popular');
    }

    $('.container').hide();
    $('#playingNowContainer, #trendingContainer, #upcomingContainer, #popular, #genreChosen').empty().hide();

    switchContent(2);

    let totalPages;
    let arr = [];

    $.get(movieActorsUrl + "popular?api_key=" + tmdbKey + "&language=en-US", (data) => {
        for (var i = 0; i < data.results.length; i++) {
            arr.push(data.results[i]);
        }

        totalPages = data.total_pages;

        if (totalPages > 1) {
            setTimeout(() => {
                $.get(movieActorsUrl + "popular?api_key=" + tmdbKey + "&language=en-US&page=2", (data) => {
                    for (var j = 0; j < data.results.length; j++) {
                        arr.push(data.results[j]);
                    }
        
                    setTimeout(() => {
                        $('#popular').css('display', 'flex');
                        buildPopular(arr);
                    }, 500)
                });
            }, 1000)
        }
    })
}

const buildPopular = (arr) => {
    let typeheader = $('<h2>', {
        class: 'typeheader',
        text: 'Popular People'
    }).appendTo($('#popular'));

    let headerLine = $('<div>', {
        class: 'line linePopular',
    }).appendTo($('#popular'));

    let headerLogo = $('<span>', {
        class: 'headerLogo',
    }).appendTo(headerLine);

    let popularContent = $('<div>', {
        id: 'popularContent',
    }).appendTo($('#popular'));

    for (let i = 0; i < arr.length; i++) {

        let popularPerson = $('<div>', {
            class: 'popularPerson hoverEffect',
            popularity: arr[i].popularity
        }).appendTo(popularContent)

        let dataSrc;
        let finalSrc;
        let finalClass;

        if (i < 10) {
            dataSrc = '';
            finalClass = 'popularPersonImg';

            if (arr[i].profile_path == null) {
                finalSrc = './images/stock.png';
            } else {
                finalSrc = 'https://image.tmdb.org/t/p/w1280' + arr[i].profile_path;
            }
        } else {
            if (arr[i].profile_path == null) {
                dataSrc = './images/stock.png';
                finalSrc = './images/stock.png';
            } else {
                dataSrc = 'https://image.tmdb.org/t/p/w1280' + arr[i].profile_path;
                finalSrc = './images/stock.png';
            }
            finalClass = 'popularPersonImg lazy';
        }

        let popularPersonImg = $('<img>', {
            class: finalClass,
            alt: 'popular person',
            'src': finalSrc,
            'data-src': dataSrc,
            click: () => {
                $('#playingNowContainer, #trendingContainer, #upcomingContainer, #popular, #genreChosen').empty().hide();
                $('#search').val('');
                $('main').hide();
                getPersonDetails(arr[i].id, 1);
            }
        }).appendTo(popularPerson)

        let popularPersonName = $('<p>', {
            class: 'name',
            text: arr[i].name
        }).appendTo(popularPerson)
    }

    setTimeout(() => {
        sortPopularMovies($('#popularContent'), 'popularity', 4);
    }, 500);
}

const getPersonCredits = (value, type) => {
    $('#personMovies').empty();
    $('#personCreditsHeader').remove();

    $.get(movieActorsUrl + value + "/combined_credits?api_key=" + tmdbKey + "&language=en-US", (data) => {

        let finalData;

        if (type == 1) {
            finalData = data.cast;
        } else {
            finalData = data.crew;
        }

        if (finalData.length !== 0) {

            let creditsHeader = $('<p>', {
                id: 'personCreditsHeader',
                class: 'chosenHeader',
                text: 'Credits',
            }).insertBefore($('#personMovies'));

            for (let i = 0; i < finalData.length; i++) {
                try {
                    let movieImgPath = 'https://image.tmdb.org/t/p/w1280' + finalData[i].poster_path;

                    if (finalData[i].poster_path == 'undefined' || finalData[i].poster_path == null || finalData[i].poster_path == '') {

                        movieImgPath = './images/stock.png';
                    }

                    let trimmedString;

                    if (type == 1) {
                    
                        if (finalData[i].character && finalData[i].character.length > 25) {
    
                            if (countInstances(finalData[i].character, '/') > 1) {
                                trimmedString = finalData[i].character.substr(0, 25);
                                trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
                                trimmedString = finalData[i].character.split('/');
    
                                if (trimmedString.length > 2) {
                                    trimmedString = trimmedString[0] + '/' + trimmedString[1] + '& More';
                                } else {
                                    trimmedString = trimmedString[0] + '/' + trimmedString[1];
                                }
        
                            } else {
                                trimmedString = finalData[i].character;
                            }
    
                        } else {
                            trimmedString = finalData[i].character;
                        }
    
                        if (trimmedString == '') {
                            trimmedString = 'Unknown';
                        }
                    }

                    let finalTitle;

                    if (finalData[i].media_type == 'movie') {
                        if (type == 1) {
                            finalTitle = finalData[i].title + ':';
                        } else {
                            finalTitle = finalData[i].title;
                        }
                    } else {
                        if (type == 1) {
                            finalTitle = finalData[i].name + ':';
                        } else {
                            finalTitle = finalData[i].name;
                        }
                    }

                    if (finalData[i].character && type == 1) {
                        let credit = $('<div>', {
                            class: 'credit',
                            popularity: finalData[i].popularity
                        }).appendTo($('#personMovies'));
    
                        let imageLink = $('<a>', {
                            class: 'imageLink',
                            'target': '_blank'
                        }).appendTo(credit);
    
                        let actorImg = $('<img>', {
                            class: 'actorImg hoverEffect lazy',
                            'data-src': movieImgPath,
                            'src': './images/actor.jpg',
                            alt: 'actorImg',
                            mediaType: finalData[i].media_type,
                            id: finalData[i].id,
                            click: () => {
                                let typeOfContent;
                                if (finalData[i].media_type == 'movie') {
                                    typeOfContent = 1;
                                } else {
                                    typeOfContent = 2;
                                }

                                $('#chosenPerson').hide();

                                chosenMovie(finalData[i].id, typeOfContent);
                            }
                        }).appendTo(imageLink);
    
                        let actorMovieName = $('<span>', {
                            class: 'actorMovieName',
                            text: finalTitle
                        }).appendTo(credit);
    
                        let characterName = $('<span>', {
                            class: 'characterName',
                            text: trimmedString
                        }).appendTo(credit);
                    }

                    if (finalData[i].job == 'Director' && type == 2) {
                        let credit = $('<div>', {
                            class: 'credit',
                            popularity: finalData[i].popularity
                        }).appendTo($('#personMovies'));
    
                        let imageLink = $('<a>', {
                            class: 'imageLink',
                            'target': '_blank'
                        }).appendTo(credit);
    
                        let actorImg = $('<img>', {
                            class: 'actorImg hoverEffect lazy',
                            'data-src': movieImgPath,
                            'src': './images/actor.jpg',
                            alt: 'actorImg',
                            mediaType: finalData[i].media_type,
                            id: finalData[i].id,
                            click: () => {
                                let typeOfContent;
                                if (finalData[i].media_type == 'movie') {
                                    typeOfContent = 1;
                                } else {
                                    typeOfContent = 2;
                                }

                                $('#chosenPerson').hide();

                                chosenMovie(finalData[i].id, typeOfContent);
                            }
                        }).appendTo(imageLink);
    
                        let actorMovieName = $('<span>', {
                            class: 'actorMovieName',
                            text: finalTitle
                        }).appendTo(credit);
                    }

                } catch (e) {
                    console.log(e);
                }

                setTimeout(() => {
                    sortPopularMovies($('#personMovies'), 'popularity', 3);
                }, 500);
            }
        }
    })
}

const getPersonImages = (value) => {

    $('#personImages').empty();

    $.get(movieActorsUrl + value + "/images?api_key=" + tmdbKey + "&language=en-US", (data) => {
        if (data.profiles.length > 0) {
            let finalLength;

            if (data.profiles.length > 10) {
                finalLength = 10;
            } else {
                finalLength = data.profiles.length;
            }

            for (let i = 0; i < finalLength; i++) {

                let finalImg;

                if (data.profiles[i].file_path == null) {
                    finalImg = './images/stock.png';
                } else {
                    finalImg = 'https://image.tmdb.org/t/p/w1280' + data.profiles[i].file_path;
                }

                let personPoster = $('<img>', {
                    class: 'personPoster lazy',
                    src: './images/stock.png',
                    'data-src': finalImg,
                    alt: 'person poster',
                }).appendTo($('#personImages'));
            }
        }
    });
}

const getPersonMovieImages = (value) => {

    $('#personMovieImages').empty();

    $.get(movieActorsUrl + value + "/tagged_images?api_key=" + tmdbKey + "&language=en-US", (data) => {

        if (data.results.length > 0) {
            let finalLength;

            if (data.results.length > 10) {
                finalLength = 10;
            } else {
                finalLength = data.results.length;
            }

            for (let i = 0; i < finalLength; i++) {
                let finalImg;

                if (data.results[i].media.backdrop_path == null) {
                    if (data.results[i].file_path == null) {
                        finalImg = './images/stockMovie.jpg'; 
                    } else {
                        finalImg = 'https://image.tmdb.org/t/p/w1280' + data.results[i].file_path;
                    }
                    
                } else {
                    finalImg = 'https://image.tmdb.org/t/p/w1280' + data.results[i].media.backdrop_path;
                }

                let personMovieImg = $('<img>', {
                    class: 'personMovieImg lazy',
                    src: './images/stockMovie.jpg',
                    'data-src': finalImg,
                    alt: 'person tagged img',
                }).appendTo($('#personMovieImages'));
            }
        }
    });
}

const getSimilar = (value, type) => {

    if (type == 1) {
        $('#similarHeader').html('Similar Movies');
    } else {
        $('#similarHeader').html('Similar TV Shows');
    }

    let finalUrl = getFinalUrl(type);
    
    $('#similarMovies').hide();

    $.get(finalUrl + value + "/similar?api_key=" + tmdbKey + "&language=en-US", (data) => {

        if (data.results.length !== 0) {
            $('#similarMovies').show();

            for (let i = 0; i < data.results.length; i++) {

                try {
                    let img;

                    if (data.results[i].poster_path == 'undefined' || data.results[i].poster_path == null || data.results[i].poster_path == '') {
                        img = './images/stock.png';
                    } else {
                        img = 'https://image.tmdb.org/t/p/w1280' + data.results[i].poster_path;
                    }

                    let credit = $('<div>', {
                        class: 'credit',
                        popularity: data.results[i].popularity,
                        value: data.results[i].id,
                    }).appendTo($('#similarMoviesContent'));

                    setTimeout(() => {
                        sortPopularMovies($('#similarMoviesContent'), 'popularity', 3);
                    }, 500);

                    let finalTitle;

                    if (type == 1) {
                        finalTitle = data.results[i].title;
                    } else {
                        finalTitle = data.results[i].name;
                    }

                    let similarMovieImg = $('<img>', {
                        class: 'similarMovieImg hoverEffect lazy',
                        'data-src': img,
                        'src': './images/stock.png',
                        alt: 'similarMovieImg',
                        click: () => {
                            chosenMovie(data.results[i].id, type);
                        }
                    }).appendTo(credit);

                    let similarMovieName = $('<span>', {
                        class: 'similarMovieName',
                        text: finalTitle
                    }).appendTo(credit);

                } catch (e) {
                    console.log(e);
                }
            }
        }
    });
}

const getImages = (value, type) => {

    let finalUrl = getFinalUrl(type);

    $('#chosenMovieImagesWrapper').hide();

    $.get(finalUrl + value + "/images?api_key=" + tmdbKey, (data) => {

        if (data.backdrops.length > 0) {
            $('#chosenMovieImagesWrapper').css('display', 'flex');
            let finalLength;
            if (data.backdrops.length > 10) {
                finalLength = 10;
            } else {
                finalLength = data.backdrops.length;
            }

            for (let i = 0; i < finalLength; i++) {

                try {
    
                    if (data.backdrops[i].file_path == null || data.backdrops[i].file_path == '') {
                        galleryImg = './images/stockMovie.jpg';
                    } else {
                        galleryImg = 'https://image.tmdb.org/t/p/w1280' + data.backdrops[i].file_path;
                    }
    
                    let movieGalleryImg = $('<img>', {
                        class: 'movieGalleryImg lazy',
                        src: './images/stockMovie.jpg',
                        'data-src': galleryImg,
                        alt: 'movieGalleryImg',
                    }).appendTo($('#chosenMovieImagesWrapper'));
                
                } catch (e) {
                    console.log(e);
                }
            }
        }
    });
}

const getVideos = (value, type) => {

    let finalUrl = getFinalUrl(type);

    $('#videosWrapper').hide();

    $.get(finalUrl + value + "/videos?api_key=" + tmdbKey, (data) => {

        if (data.results.length > 0) {
            $('#videosWrapper').css('display', 'flex');
            let finalLength;
            if (data.results.length > 5) {
                finalLength = 5;
            } else {
                finalLength = data.results.length;
            }

            for (let i = 0; i < finalLength; i++) {

                let objectUrl = youtubeVideo + data.results[i].key + '?showinfo=0&enablejsapi=1';
                let movieVideo = $('<iframe>', {
                    class: 'movieVideo',
                    title: 'video',
                    src: objectUrl,
                    width: '420',
                    height: '315',
                    allowfullscreen: true,
                }).appendTo($('#videosWrapper'));
            }
        }
    });
}

const goToDiv = (div) => {

    $('.searchContainer').removeClass('chosenSearch');

    if (!$('#marvelContainer').is(':visible')) {
        $('.container').css('display', 'flex');
        $('#playingNowContainer, #trendingContainer, #upcomingContainer, #popular, #genreChosen').empty().hide();
        switchContent(2);
    }

    if ($('.sortContainer').is(':visible')) {
        $('.sortContainer').hide();
        DCCounter = 1;
        marvelCounter = 1;
        valiantCounter = 1;
        othersCounter = 1;
        animationCounter = 1;
        upcomingCounter = 1;
        playingNowCounter = 1;
        genreCounter = 1;
    }
    
    if ($('#timeline').is(':visible')) {
        $('#timeline').hide();
    }

    if ($('main').is(":hidden")) {
        $('main').show();

        window.history.replaceState({}, document.title, "/" + "my-movie-list/");

        setTimeout(() => {
            document.querySelector(div).scrollIntoView({ behavior: 'smooth' });
        }, 0)
    } else {
        document.querySelector(div).scrollIntoView({ behavior: 'smooth' });
    }
}

const emptyChosen = () => {
    $('#productionCompenies, #overview, #watchProviders, #directorsWrapper, #castContent, #similarMoviesContent, #chosenMovieImagesWrapper, #videosWrapper, #searchResults').empty();
    $('#chosenMovieImdb').attr('href', 'https://www.imdb.com');
    $('#chosenMovieImg').attr('src', '');   
    $('#chosenMovieSentence, #movieDate, #movieRuntime, #movieRevenue, #movieRating, #movieLang, #castHeader, #similarHeader, #chosenMovieTitle').html('');
    $('#chosenMovieDate, #chosenMovieRuntime, #chosenMovieRevenue, #chosenMovie, #seasons, #episodes, #chosenMovieRating, #chosenMovieGenres, #chosenMovieLang, #similarMovies, #chosenMovieImagesWrapper, #videosWrapper, #searchResults').hide();
    $('#personInstagramWrapper, #chosenPersonImgWrapper, #personMovies, #personImages').empty();
    $('#chosenPersonName, #birthDate, #deathDate, #hometown').html('');
    $('#personBirthDate, #personDeathDate, #personHometown, #chosenPerson').hide();
    $('#personCreditsHeader, #audioWrapper, #genresContent').remove();
}

const getCinematicInfo = (url, type) => {
    $.get(url, (data) => {
        let elements = data.items;    
        cinematicArr = [];
        tvShowTimelineArr = [];

        for (let i = 0; i < elements.length; i++) {       
            if (elements[i].release_date !== '' && elements[i].release_date !== undefined && elements[i].release_date !== null) {

                let obj = {
                    id: elements[i].id,
                    name: elements[i].title,
                    date: elements[i].release_date,
                    poster: elements[i].poster_path,
                    background: elements[i].backdrop_path
                }
                cinematicArr.push(obj);
            }       
        }

        setTimeout(() => {
            const now = new Date();
            let closest = Infinity;
            let closest2 = Infinity;
            let tempArr = cinematicArr.slice(0);

            cinematicArr.forEach(function(d) {

                const date = new Date(d.date);

                if (date >= now && (date < new Date(closest) || date < closest)) {
                    closest = d;
                }
            });

            const index = tempArr.indexOf(closest);

            tempArr.splice(index, 1);

            tempArr.forEach(function(d) {

                const date = new Date(d.date);

                if (date >= now && (date < new Date(closest2) || date < closest2)) {
                    closest2 = d;
                }
            });

            let finalImg = closest.poster;

            if (finalImg == null) {
                finalImg = './images/stock.png';
            } else {
                finalImg = 'https://image.tmdb.org/t/p/w1280' + closest.poster;
            }

            $('#dateOfNextMovie').html(configureDate(closest.date));
            $('#nextCinematicTitle').html(capitalize(closest.name));
            $('#nextCinematicImg').remove();

            let cinematicImg = $('<img>', {
                id: 'nextCinematicImg',
                alt: closest.name,
                src: finalImg,
                click: () => {
                    $('#nextCinematicFilmPop').hide();
                    chosenMovie(closest.id, 1);
                }

            }).insertAfter($('#dateOfNextMovie'));

            
            $('#afterNextMovieTitle').html(capitalize(closest2.name));
            $('#afterNextMovieDate').html(configureDate(closest2.date));
            $('#nextCinematicFilmPop').show();
            $('#timelineBtn').attr('onclick', 'showTimeline(1,' + type + ')');
        }, 0)    
    });
}

const getTVShowInfo = (url, type) => {
    $.get(url, (data) => {
        let elements = data.items;    
        tvShowTimelineArr = [];

        for (let i = 0; i < elements.length; i++) {     
            
            let obj = {
                id: elements[i].id,
                name: elements[i].name,
                date: elements[i].first_air_date,
                poster: elements[i].poster_path,
                background: elements[i].backdrop_path
            }
            tvShowTimelineArr.push(obj);
        }

        setTimeout(() => {
            $('#timelineTVBtn').attr('onclick', 'showTimeline(2,' + type + ')');
            $('main, #menuOpenWrapper, footer, #goToTopBtn').css({'pointer-events': 'all', 'opacity': '1'});
            $('.popUpInfo').css({'pointer-events': 'all', 'opacity': '1'});
            $('#spinnerWrapper').hide();
        }, 0)    
    });
}

const showTimeline = (type, cinematicType) => {

    $('.searchContainer').addClass('chosenSearch');
    $('.timelineMovieWrapper').remove();
    $('#timeline').show();
    $('html,body').scrollTop(0);
    $('#progressBar').css('width', 0);
    $('main, #nextCinematicFilmPop').hide();
    goToTop();

    if (type == 1) {
        if(cinematicType == 1) {
            timelineUrl = 'MCUTimeline';
        } else {
            timelineUrl = 'DCEUTimeline';
        }
        
        for (let i = 0; i < cinematicArr.length; i++) {
    
            let timelineMovieWrapper = $('<div>', {
                class: 'timelineMovieWrapper'
            }).appendTo($('#timelineContent'))
    
            let timelineMovieName = $('<p>', {
                class: 'timelineMovieName',
                text: capitalize(cinematicArr[i].name)
            }).appendTo(timelineMovieWrapper)
    
            let finalImg = cinematicArr[i].background;
            let finalClass;
    
            if (finalImg == null) {
                if (cinematicArr[i].poster == null) {
                    finalImg = './images/stock.png';
                } else {
                    finalImg = 'https://image.tmdb.org/t/p/w1280' + cinematicArr[i].poster;
                }

                finalClass = 'timelineMovieImg hoverEffect poster';

            } else {
                finalImg = 'https://image.tmdb.org/t/p/w1280' + cinematicArr[i].background;
                finalClass = 'timelineMovieImg hoverEffect background';
            }
    
            let timelineMovieImg = $('<img>', {
                class: finalClass,
                src: finalImg,
                alt: 'movie img',
                click: () => {
                    $('#timeline').hide();
                    window.history.replaceState({}, document.title, "/" + "my-movie-list/");
                    chosenMovie(cinematicArr[i].id, 1);
                }
            }).appendTo(timelineMovieWrapper)

            let timelineMovieDate = $('<p>', {
                class: 'timelineMovieDate',
                text: configureDate(cinematicArr[i].date)
            }).appendTo(timelineMovieWrapper)    
        }
    } else {

        if(cinematicType == 1) {
            timelineUrl = 'MarvelTVUniverseTimeline';
        } else {
            timelineUrl = 'DCTVUniverseTimeline';
        }

        for (let i = 0; i < tvShowTimelineArr.length; i++) {
    
            let timelineMovieWrapper = $('<div>', {
                class: 'timelineMovieWrapper'
            }).appendTo($('#timelineContent'))
    
            let timelineMovieName = $('<p>', {
                class: 'timelineMovieName',
                text: tvShowTimelineArr[i].name
            }).appendTo(timelineMovieWrapper)
    
            let finalImg = tvShowTimelineArr[i].background;
            let finalClass;
    
            if (finalImg == null) {
                if (tvShowTimelineArr[i].poster == null) {
                    finalImg = './images/stock.png';
                } else {
                    finalImg = 'https://image.tmdb.org/t/p/w1280' + tvShowTimelineArr[i].poster;
                }

                finalClass = 'timelineMovieImg hoverEffect poster';

            } else {
                finalImg = 'https://image.tmdb.org/t/p/w1280' + tvShowTimelineArr[i].background;
                finalClass = 'timelineMovieImg hoverEffect background';
            }
    
            let timelineMovieImg = $('<img>', {
                class: finalClass,
                src: finalImg,
                alt: 'tv show img',
                click: () => {
                    $('#timeline').hide();
                    window.history.replaceState({}, document.title, "/" + "my-movie-list/");
                    chosenMovie(tvShowTimelineArr[i].id, 2);
                }
            }).appendTo(timelineMovieWrapper)
    
            let finalDate = tvShowTimelineArr[i].date;

            if (finalDate == null || finalDate == undefined || finalDate == '') {
                finalDate = 'TBD';
            } else {
                finalDate = configureDate(tvShowTimelineArr[i].date);
            }

            let timelineMovieDate = $('<p>', {
                class: 'timelineMovieDate',
                text: finalDate
            }).appendTo(timelineMovieWrapper)    
        }
    }

    window.history.replaceState({}, document.title, "/" + "my-movie-list/");

    const url = new URL(window.location);
    url.searchParams.set('timeline', timelineUrl);
    window.history.pushState({}, '', url);

    $(window).on('popstate', function() {
        goHome();
        window.history.replaceState({}, document.title, "/" + "my-movie-list/");
    });
}

const goHome = () => {
    $('main').show();

    if ($('#chosenMovie').is(':visible') || $('#chosenPerson').is(':visible') || $('#timeline').is(':visible')) {
        goToDiv('#marvelContainer');
    }
}

const sort = (div, num) => {

    if ($('.sortContainer').is(':visible')) {
        $('.sortContainer').hide();
    }

    closeMenus();

    switch (num) {
        case 1:
            if (marvelCounter == 1) {
                $(div).find($('.sortContainer')).fadeIn('fast');
                marvelCounter = 2;
                DCCounter = 1;
                valiantCounter = 1;
                othersCounter = 1;
                animationCounter = 1;
                upcomingCounter = 1;
                playingNowCounter = 1;
                genreCounter = 1;
            } else {
                $(div).find($('.sortContainer')).fadeOut('fast');
                marvelCounter = 1;
            }
            break;
        case 2:
            if (DCCounter == 1) {
                $(div).find($('.sortContainer')).fadeIn('fast');
                DCCounter = 2;
                marvelCounter = 1;
                valiantCounter = 1;
                othersCounter = 1;
                animationCounter = 1;
                upcomingCounter = 1;
                playingNowCounter = 1;
                genreCounter = 1;
            } else {
                $(div).find($('.sortContainer')).fadeOut('fast');
                DCCounter = 1;
            }
            break;
        case 3:
            if (valiantCounter == 1) {
                $(div).find($('.sortContainer')).fadeIn('fast');
                valiantCounter = 2;
                marvelCounter = 1;
                DCCounter = 1;
                valiantCounter = 1;
                othersCounter = 1;
                animationCounter = 1;
                upcomingCounter = 1;
                playingNowCounter = 1;
                genreCounter = 1;
            } else {
                $(div).find($('.sortContainer')).fadeOut('fast');
                valiantCounter = 1;
            }
            break;
        case 4:
            if (othersCounter == 1) {
                $(div).find($('.sortContainer')).fadeIn('fast');
                othersCounter = 2;
                marvelCounter = 1;
                valiantCounter = 1;
                DCCounter = 1;
                animationCounter = 1;
                upcomingCounter = 1;
                playingNowCounter = 1;
                genreCounter = 1;
            } else {
                $(div).find($('.sortContainer')).fadeOut('fast');
                othersCounter = 1;
            }
            break;
        case 5:
            if (animationCounter == 1) {
                $(div).find($('.sortContainer')).fadeIn('fast');
                animationCounter = 2;
                marvelCounter = 1;
                valiantCounter = 1;
                DCCounter = 1;
                othersCounter = 1;
                upcomingCounter = 1;
                playingNowCounter = 1;
                genreCounter = 1;
            } else {
                $(div).find($('.sortContainer')).fadeOut('fast');
                animationCounter = 1;
            }
            break;

            case 7:
                if (upcomingCounter == 1) {
                    $(div).find($('.sortContainer')).fadeIn('fast');
                    upcomingCounter = 2
                    animationCounter = 1;
                    marvelCounter = 1;
                    valiantCounter = 1;
                    DCCounter = 1;
                    othersCounter = 1;
                    playingNowCounter = 1;
                    genreCounter = 1;
                } else {
                    $(div).find($('.sortContainer')).fadeOut('fast');
                    upcomingCounter = 1;
                }
                break;
            case 8:
                if (playingNowCounter == 1) {
                    $(div).find($('.sortContainer')).fadeIn('fast');
                    playingNowCounter = 2;
                    animationCounter = 1;
                    marvelCounter = 1;
                    valiantCounter = 1;
                    DCCounter = 1;
                    othersCounter = 1;
                    upcomingCounter = 1;
                    genreCounter = 1;
                } else {
                    $(div).find($('.sortContainer')).fadeOut('fast');
                    playingNowCounter = 1;
                }
                break;
            case 9:
                if (genreCounter == 1) {
                    $(div).find($('.sortContainer')).fadeIn('fast');
                    genreCounter = 2;
                    animationCounter = 1;
                    marvelCounter = 1;
                    valiantCounter = 1;
                    DCCounter = 1;
                    othersCounter = 1;
                    upcomingCounter = 1;
                    playingNowCounter = 1;
                } else {
                    $(div).find($('.sortContainer')).fadeOut('fast');
                    genreCounter = 1;
                }
                break;
    }
}

const sortPopularMovies = (container, elem1, type) => {
    let children;
    $.each($(container), function (key, value) {

        let ids = [], obj, i, len;

        switch(type) {
            case 1:
                children = $(this).find('.resultRow');
                break;
            case 2: 
                children = $(this).find('.similarMovie');
                break;
            case 3: 
                children = $(this).find('.credit');
                break;

            case 4: 
                children = $(this).find('.popularPerson');
                break;
        }

        for (i = 0, len = children.length; i < len; i++) {

            obj = {};
            obj.element = children[i];
            let elem2 = $(children[i]).attr(elem1);
			obj.idNum = elem2;
            ids.push(obj);
        }

        ids.sort(function (a, b) { return (b.idNum - a.idNum); });

        for (i = 0; i < ids.length; i++) {
            $(this).append(ids[i].element);
        }
    });
}

const buildTvShowFromTmdb = (data, div, wrapper) => {

    let typeheader = $('<h2>', {
        class: 'typeheader',
        text: 'TV Shows'
    }).appendTo(wrapper);

    let headerLine = $('<div>', {
        class: 'line lineTvShows',
    }).appendTo(wrapper);

    let headerLogo = $('<span>', {
        class: 'headerLogo',
    }).appendTo(headerLine);

    let tvShowContent = $('<div>', {
        id: 'tvShowContent',
    }).appendTo(wrapper);

    for (let i = 0; i < data.length; i++) {

        let tvShowWrapper = $('<div>', {
            class: 'tvShowWrapper hoverEffect ' + div,
            'year': data[i].first_air_date.substr(0, 4),
            'value': data[i].id,
            click: function () {
                chosenMovie(data[i].id, 2);
            }
        }).appendTo(tvShowContent);

        let tvShowImg = $('<img>', {
            class: 'tvShowImg',
            alt: 'tvShowImg',
            src: 'https://image.tmdb.org/t/p/w1280' + data[i].poster_path
        }).appendTo(tvShowWrapper);

        let tvShowName = $('<p>', {
            class: 'name',
            text: capitalize(data[i].name)
        }).appendTo(tvShowWrapper);

        let tvShowYear = $('<p>', {
            class: 'year',
            text: 'Year: ' + data[i].first_air_date.substr(0, 4)
        }).appendTo(tvShowWrapper);

        if (data[i].vote_average !== null || data[i].vote_average !== 0) {
            let finalVoteText;

            finalVoteText = data[i].vote_average.toString();
    
            if ((finalVoteText.length == 1 && data[i].vote_average !== '0') || data[i].vote_average == '10') {
                finalVoteText = data[i].vote_average + '0'
            } else {
                finalVoteText = data[i].vote_average;
            }
    
            finalVoteText = finalVoteText.toString();
    
            finalVoteText = finalVoteText.replace('.', '') + '%';

            if (finalVoteText !== 0 && finalVoteText !== undefined) {

                let voteWrapper = $('<div>', {
                    class: 'voteWrapper',
                }).appendTo(tvShowWrapper);

                let voteBackground = $('<span>', {
                    class: 'voteBackground',
                    voteCount: finalVoteText.replace('%', '')
                }).appendTo(voteWrapper);

                let voteTextContent = $('<div>', {
                    class: 'voteTextContent',
                }).appendTo(voteWrapper);

                let vote = $('<span>', {
                    class: 'vote',
                    text: finalVoteText
                }).appendTo(voteTextContent);
            }

            updateVotes();
        }
    }
}

const updateVotes = () => {
    setTimeout(() => {
        $.each($('.voteBackground'), (key, value) => {
            let height = $(value).attr('voteCount');
            $(value).css('height', height + '%');

            var r = height < 70 ? 255 : Math.floor(255-(height*2-100)*255/100);
            var g = height >= 70 ? 255 : Math.floor((height*2)*255/100);

            if (height > 45 && height < 70) {
                g = g - 100;
            } else if(height >= 70) {
                g = g - 50;
            } else {
                g = g;
            }

            $(value).css('background-color', 'rgb('+r+','+g+',0)');          
        });
    }, 500)
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

const sortMovies = (container, elem1, kind) => {

    let btnWrapper = $(container).find($('.btnWrapper'));

    if ($(btnWrapper).attr('kind') == kind) {
    } else {
        $(btnWrapper).attr('kind', kind);
        counter = 1;
    }

    let children;
    $.each($(container), function (key, value) {
        let ids = [], obj, i, len;

        if ($(container).attr('id') == 'tvShowContainer') {
            children = $(this).find('.tvShowWrapper');
        } else {
            children = $(this).find('.movieWrapper');
        }

        for (i = 0, len = children.length; i < len; i++) {
            obj = {};
            obj.element = children[i];
            let elem2 = $(children[i]).attr(elem1);
            switch (kind) {
                case 1:
                    obj.idNum = new Date(elem2);
                    break;
                case 2:
                    obj.idNum = elem2;
                    break;
            }
            ids.push(obj);
        }

        switch (kind) {
            case 1:
                switch (counter) {
                    case 1:
                        ids.sort((a, b) => { return (a.idNum - b.idNum); });
                        counter = 2;
                        break;
                    case 2:
                        ids.sort((a, b) => { return (b.idNum - a.idNum); });
                        counter = 1;
                        break;
                }
                $(btnWrapper).attr('kind', kind);
                break;
            case 2:
                switch (counter) {
                    case 1:
                        ids.sort((a, b) => {
                            if (a.idNum > b.idNum) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });

                        counter = 2;
                        break;

                    case 2:
                        ids.sort((a, b) => {
                            if (a.idNum < b.idNum) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });
                        counter = 1;
                        break;
                }
                $(btnWrapper).attr('kind', kind);
                break;
        }

        for (i = 0; i < ids.length; i++) {
            $(this).append(ids[i].element);
        }
    });
    $('.sortContainer').fadeOut('fast');
    marvelCounter = 1;
    DCCounter = 1;
    valiantCounter = 1;
    othersCounter = 1;
    animationCounter = 1;
    upcomingCounter = 1;
    playingNowCounter = 1;
    genreCounter = 1;
}

const removePopup = (container) => {

    $(document).mouseup((e) => {
        if (container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
            e.stopPropagation();
            $(document).off('mouseup');
        }
    })
}
