
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

let selectedDiv;
let lastChar;
let searchVal;

let mcuWasSorted = false;
let dceuWasSorted = false;

let cinematicArr = [];
let tvShowTimelineArr = [];

const tmdbKey = '0271448f9ff674b76c353775fa9e6a82';

const movieInfoUrl = "https://api.themoviedb.org/3/movie/";
const tvShowInfoUrl = "https://api.themoviedb.org/3/tv/";
const movieActorsUrl = "https://api.themoviedb.org/3/person/";
const youtubeVideo = 'https://www.youtube.com/embed/';
const listUrl = 'https://api.themoviedb.org/3/list/';

let authToken;
let sessionId;

$(document).ready((event) => {

    if (window.location.href.indexOf("?timeline=") > -1) {
        window.history.replaceState({}, document.title, "/" + "my-movie-list/");
    }

    loadJson();

    window.onbeforeunload = () => {
        window.scrollTo(0, 0);
    }

    window.onscroll = () => {
        scrollBtn();
    }

    $('.Xbtn').click(function () {
        if($(this).parent().parent().attr('id') == 'movieDetails') {
            $('#movieDetails').attr('chosenMovieId', '');
        }
        
        $(this).parent().parent().fadeOut(150);
    })

    setTimeout(() => {
        $('.spinnerWrapper').hide();
        $('.searchContainer').show();
        $('button').show();
        $('.container, footer').css('display', 'flex');
    }, 500);

    $('#search').on('input', () => {

        if ($('.sortContainer').is(':visible')) {
            $('.sortContainer').hide();
            DCCounter = 1;
            marvelCounter = 1;
            valiantCounter = 1;
            othersCounter = 1;
            animationCounter = 1;
        }

        if ($('#toggle').hasClass('on')) {
            $('#toggle').removeClass('on')
        }

        let resultType;

        searchVal = $('#search').val();
        lastChar = searchVal.substr(searchVal.length - 1);
    
        if (lastChar == ' ') {
            return;
        } else {
            $('#searchResults').empty();
        }

        $.each($('.tvShowWrapper'), (key, value) => {
            let tvShowNumId = $(value).attr('value');
            showResult($('.tvShowWrapper'),$('.tvShowImg'), $(value), tvShowNumId);
        });

        $.each($('.movieWrapper'), (key, value) => {
            let movieNumId = $(value).attr('value');
                
            if ($(value).hasClass('marvelMovie')) {
                resultType = 1;
            } else if ($(value).hasClass('dcMovie')) {
                resultType = 2;
            } else if ($(value).hasClass('valiantMovie')) {
                resultType = 3;
            } else if ($(value).hasClass('otherMovie')) {
                resultType = 4;
            } else if ($(value).hasClass('animationMovie')) {
                resultType = 5;
            } else if ($(value).hasClass('ultraMovie')) {
                resultType = 6;
            }

            showResult($('.movieWrapper'), $('.movieImg'), $(value), movieNumId, resultType);
        });
    })
});

const showResult = (div, img, that, resultNum, resultType) => {

    for (let i = 0; i < $(that).length; i++) {
        let movieName = $($(that)[i]).find($('.name')).html();

        let movieImg = $($(that)[i]).find(img).attr('src');
        let searchValCapitalized = searchVal.charAt(0).toUpperCase() + searchVal.slice(1);
        
        if (searchVal.length == 0 || $('.result').length < 1) {
            $('#searchResults').hide();
        } else {
            $('#searchResults').show();
        }

        let cap;
        let serachFinal;

        try {
            cap = capitalize(movieName);
            serachFinal = capitalize(searchValCapitalized);

        } catch (e) {
            return;
        }

        if (cap.includes(serachFinal) || cap.includes(serachFinal.toLowerCase())) {

            let result = $('<div>', {
                class: 'result',
                'resultType': resultType,
                'movieNum': resultNum,
                click: function() {
                    switch($(this).attr('resultType')) {
                        case '1': 
                            div = '#marvelContainer .movieWrapper';
                        break;
                        case '2': 
                            div = '#dcContainer .movieWrapper';
                        break;
                        case '3': 
                            div = '#valiantContainer .movieWrapper';
                        break;
                        case '4': 
                            div = '#othersContainer .movieWrapper';
                        break;
                        case '5': 
                            div = '#animationContainer .movieWrapper';
                        break;
                        case '6': 
                            div = '#ultraContainer .movieWrapper';
                        break;
                    }

                    let that = this;
                    $.each($(div), function (key, value) {
                        if ($(that).attr('movieNum') == $(this).attr('value')) {
                            $('body').css('pointer-events', 'none');
                            selectedDiv = this;

                            goToResult(selectedDiv);
                        
                            $('#searchResults').hide();
                            $('#search').val('');
                            setTimeout(() => {
                                $(selectedDiv).click();
                                $('body').css('pointer-events', 'all');
                            }, 1500)
                        }
                    });
                }
            }).appendTo($('#searchResults'));

            let resultImgWrapper = $('<div>', {
                class: 'resultImgWrapper',
            }).appendTo(result);

            let resultImg = $('<img>', {
                class: 'resultImg',
                src: movieImg
            }).appendTo(resultImgWrapper);

            let finalText;

            if (resultType == 6) {
                finalText = cap + ' 4K';
            } else {
                finalText = cap;
            }

            let resultName = $('<p>', {
                class: 'resultName',
                text: finalText
            }).appendTo(result);
        }
    }
}

const loadJson = () => {

    var promise1 = new Promise((resolve) => {
        resolve($.get(listUrl + '7099604?api_key=' + tmdbKey + '&language=en-US', (data) => {
            buildMoviesFromTmdb(data, 'marvel', $('#marvelContainer'), 1);
        }));
    });

    promise1.then(() => {
        $.get(listUrl + '7099603?api_key=' + tmdbKey + '&language=en-US', (data) => {
            buildMoviesFromTmdb(data, 'dc', $('#dcContainer'), 2);
        });
    });

    promise1.then(() => {
        $.get(listUrl + '7099609?api_key=' + tmdbKey + '&language=en-US', (data) => {
            buildMoviesFromTmdb(data, 'valiant', $('#valiantContainer'), 3);
        });
    });

    promise1.then(() => {
        $.get(listUrl + '7099605?api_key=' + tmdbKey + '&language=en-US', (data) => {
            buildMoviesFromTmdb(data, 'others', $('#othersContainer'), 4);
        });
    });

    promise1.then(() => {
        $.get(listUrl + '7099575?api_key=' + tmdbKey + '&language=en-US', (data) => {
            buildMoviesFromTmdb(data, 'animation', $('#animationContainer'), 5);
        });
    });

    promise1.then(() => {
        $.get(listUrl + '7099607?api_key=' + tmdbKey + '&language=en-US', (data) => {
            buildTvShowFromTmdb(data, 'tvShow', $('#tvShowContainer'));
        });
    });

    promise1.then(() => {
        $.get(listUrl + '7099559?api_key=' + tmdbKey + '&language=en-US', (data) => {
            buildMoviesFromTmdb(data, '4k',  $('#ultraContainer'), 6);
        });
    });
}

const buildMoviesFromTmdb = (data, div, wrapper, type) => {

    let headerText;
    let cinematicUBtnId;
    let cinematicUBtnText;
    let nonCinematicUBtnText;
    let allTypeBtnId;
    let allTypeBtnText;
    let typeSortClick;
    let typeShowClick;
    let typeU;
    let headerLineClass;

    switch (type) {
        case 1:
            headerText = 'Marvel';
            cinematicUBtnId = 'btnMCU';
            cinematicUBtnText = 'MCU Only';
            nonCinematicUBtnText = 'Non MCU';
            allTypeBtnId = 'btnAllMarvel';
            allTypeBtnText = 'All Marvel';
            typeSortClick = $('#marvelContainer');
            typeShowClick = '.marvelMovie';
            typeU = 'mcu';
            headerLineClass = 'lineMarvel';
            break;
        case 2:
            headerText = 'DC';
            cinematicUBtnId = 'btnDCEU';
            cinematicUBtnText = 'DCEU Only';
            nonCinematicUBtnText = 'Non DCEU';
            allTypeBtnId = 'btnAllDC';
            allTypeBtnText = 'All DC';
            typeSortClick = $('#dcContainer');
            typeShowClick = '.dcMovie';
            typeU = 'dceu';
            headerLineClass = 'lineDc';
            break;
        case 3:
            headerText = 'Valiant';
            typeSortClick = $('#valiantContainer');
            headerLineClass = 'lineValiant';
            break;
        case 4:
            headerText = 'Others';
            typeSortClick = $('#othersContainer');
            headerLineClass = 'lineOthers';
            break;
        case 5:
            headerText = 'Animation';
            typeSortClick = $('#animationContainer');
            headerLineClass = 'lineAnimation';
            break;
        case 6:
            headerText = '4K Movies';
            typeSortClick = $('#ultraContainer');
            headerLineClass = 'lineUltra';
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
        class: 'moviesContent',
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
                id: 'nextInLineBtn',
                text: finalBtnText,
                click: () => {

                    if ($('.sortContainer').is(':visible')) {
                        $('.sortContainer').hide();
                        DCCounter = 1;
                        marvelCounter = 1;
                        valiantCounter = 1;
                        othersCounter = 1;
                        animationCounter = 1;
                    }

                    if ($('#toggle').hasClass('on')) {
                        $('#toggle').removeClass('on')
                    }

                    $('main, #menuOpenWrapper, footer, #goToTopBtn').css({'pointer-events': 'none', 'opacity': '0'});
                    $('.popUpInfo').css({'pointer-events': 'none', 'opacity': '.1'});
                    $('.spinnerWrapper').show();

                    getCinematicInfo(finalCinematicUrl, type);
                    setTimeout(() => {
                        getTVShowInfo(finalTvUrl, type);
                    }, 1000);
                }
            }).appendTo(btnWrapper);
        }    
    }

    for (let i = 0; i < data.items.length; i++) {

        let finalNameToSend;
   
        finalNameToSend = data.items[i].title.replace(/'/, "");
        finalNameToSend = finalNameToSend.replace(/-/, "");
        finalNameToSend = finalNameToSend.replace(/:/, "");
        finalNameToSend = finalNameToSend.replace(/\s/g, '');

        let movieWrapper = $('<div>', {
            class: 'movieWrapper ' + div,
            'name': finalNameToSend,
            'date': data.items[i].release_date,
            'value': data.items[i].id,
            click: function () {
                if ($('.sortContainer').is(':visible')) {
                    $('.sortContainer').hide();
                    DCCounter = 1;
                    marvelCounter = 1;
                    valiantCounter = 1;
                    othersCounter = 1;
                    animationCounter = 1;
                }

                if ($('#toggle').hasClass('on')) {
                    $('#toggle').removeClass('on')
                }

                $.ajax({
                    type: 'GET',
                    crossDomain: true,
                    url: movieInfoUrl + $(this).attr('value') + "?api_key=" + tmdbKey + '&language=en-US',
                    dataType: "json",
                    success: function (data) {
                        $('#movieImdbLink').attr('href', 'https://www.imdb.com/title/' + data.imdb_id);
                        $('#moviePopcornLink').attr('href', 'https://omriknight9.github.io/omris-movies/?title=' + data.title + '&value=' + data.id);
                        $('.movieRuntimePop').html('Runtime: ' + convertMinsToHrsMins(data.runtime));
                    },
                    error: function (err) {
                        
                    }
                })

                $('#movieCredits').empty();
                $('.creditHeader').remove();

                $.ajax({
                    type: 'GET',
                    crossDomain: true,
                    url: movieInfoUrl + $(this).attr('value') + "/credits?api_key=" + tmdbKey + '&language=en-US',
                    dataType: "json",
                    success: function (data) {

                        if (data.cast.length > 0) {

                            let creditHeader = $('<span>', {
                                class: 'creditHeader',
                                text: 'Cast'
                            }).insertAfter($('.movieCoverWrapper'));

                            let finalLength;
    
                            if (data.cast.length < 21) {
                                finalLength = data.cast.length;
                            } else {
                                finalLength = 21
                            }
    
                            for (let i = 0; i < finalLength; i++) {

                                let movieCredit = $('<div>', {
                                    class: 'movieCredit'
                                }).appendTo($('#movieCredits'));

                                let actorImgPath;
                    
                                if (data.cast[i].profile_path == 'undefined' || data.cast[i].profile_path == null || data.cast[i].profile_path == '') {

                                    switch (data.cast[i].gender) {
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
                                    actorImgPath = 'https://image.tmdb.org/t/p/w1280' + data.cast[i].profile_path;
                                }
                                
                                let imdbLink = $('<a>', {
                                    class: 'imdbLink',
                                    target: '_blank',
                                    rel: 'noopener',
                                }).appendTo(movieCredit);

                                let movieCreditImg = $('<img>', {
                                    class: 'movieCreditImg',
                                    src: actorImgPath,
                                    actorId: data.cast[i].id,
                                    click: function() {
                                        goToActorImdb($(this).attr('actorId'), $(this));
                                    }
                                }).appendTo(imdbLink);

                                let trimmedString;

                                if (data.cast[i].character.length > 25) {
            
                                    if (countInstances(data.cast[i].character, '/') > 1) {
                                    
                                        let maxLength = 25;
                                        trimmedString = data.cast[i].character.substr(0, maxLength);
                                        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
            
                                        trimmedString = data.cast[i].character.split('/');
            
                                        if (trimmedString.length > 2) {
                                            trimmedString = trimmedString[0] + '/' + trimmedString[1] + '& More';
                                        } else {
                                            trimmedString = trimmedString[0] + '/' + trimmedString[1];
                                        }
                
                                    } else {
                                        trimmedString = data.cast[i].character;
                                    }
            
                                } else {
                                    trimmedString = data.cast[i].character;
                                }

                                let movieCreditName = $('<span>', {
                                    class: 'movieCreditName',
                                    text: data.cast[i].name + ':'
                                }).appendTo(movieCredit);

                                let movieCreditCharacter = $('<span>', {
                                    class: 'movieCreditCharacter',
                                    text: trimmedString
                                }).appendTo(movieCredit);
                            }
                        }
                    },
                    error: function (err) {
                        //console.log(err);
                    }
                })

                $('.movieNamePop').removeClass('longTitle');

                if ($(this).find($('.name')).html().length > 30) {
                    $('.movieNamePop').addClass('longTitle');
                }

                $('.movieCoverWrapper').css('background', 'url(' + $(this).find('.movieImg').attr('src') + ') top center no-repeat');
                $('.movieNamePop').html($(this).find($('.name')).html());
                $('#movieDetails').fadeIn(150);
                $('#movieDetails').attr('chosenMovieId', $(this).attr('value'));

                $('#movieYoutubeImage').click(() => {     
                    $.ajax({
                        type: 'GET',
                        crossDomain: true,
                        url: movieInfoUrl + $(this).attr('value') + "/videos?api_key=" + tmdbKey + "&language=en-US",
                        dataType: "json",
                        success: (data) => {

                            if(data.results.length > 0) {
                                $('#movieDetails').hide();
                                $('#movieDetails').attr('chosenMovieId', '');
                                $('#trailer').fadeIn(150);
                                setTimeout(() => {
                                    let objectUrl = youtubeVideo + data.results[0].key + '?showinfo=0&enablejsapi=1';
                                    $('#trailerVideo').attr('src', objectUrl);
                                }, 500)
                            } else {
                                $('#noVideosPop').show();
                            }
                        },
                        error: (err) => {
                            //console.log(err);
                        }
                    })
                })
            }
        }).appendTo(moviesContent)

        let movieImg = $('<img>', {
            class: 'movieImg',
            alt: 'movieImg',
            src:  'https://image.tmdb.org/t/p/w1280' + data.items[i].poster_path
        }).appendTo(movieWrapper);

        let movieFullName = $('<p>', {
            class: 'name',
            text: capitalize(data.items[i].title),
        }).appendTo(movieWrapper);

        let movieDate = $('<p>', {
            class: 'date',
            text: configureDate(data.items[i].release_date)
        }).appendTo(movieWrapper); 
    }
}

const goToDiv = (div) => {

    if ($('.sortContainer').is(':visible')) {
        $('.sortContainer').hide();
        DCCounter = 1;
        marvelCounter = 1;
        valiantCounter = 1;
        othersCounter = 1;
        animationCounter = 1;
    }

    if ($('main').is(":hidden")) {
        $('main').show();
        $('#timeline').hide();

        window.history.replaceState({}, document.title, "/" + "my-movie-list/");

        setTimeout(() => {
            document.querySelector(div).scrollIntoView({ behavior: 'smooth' });
        }, 0)
    } else {
        document.querySelector(div).scrollIntoView({ behavior: 'smooth' });
    }
}

const goToResult = (div) => {
    if ($(window).width() < 765) {
        $('html, body').animate({scrollTop: $(div).offset().top - 150}, 1000);
    } else {
        $('html, body').animate({scrollTop: $(div).offset().top - 150}, 1000);
    }

    setTimeout(() => {
        $("html, body").animate({scrollTop: $(window).scrollTop() + 10});
    }, 2000);
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
            $('#nextMcuTitle').html(capitalize(closest.name));
            $('#mcuLink').attr('href', 'https://omriknight9.github.io/omris-movies/?title=' + closest.name + '&value=' + closest.id);
            $('#nextMcuImg').attr({'src': finalImg, 'alt': data.name});
            $('#afterNextMovieTitle').html(capitalize(closest2.name));
            $('#afterNextMovieDate').html(configureDate(closest2.date));
            $('#nextMcuFilmPop').show();
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
            const now = new Date();
            $('#timelineTVBtn').attr('onclick', 'showTimeline(2,' + type + ')');

            $('main, #menuOpenWrapper, footer, #goToTopBtn').css({'pointer-events': 'all', 'opacity': '1'});
            $('.popUpInfo').css({'pointer-events': 'all', 'opacity': '1'});
            $('.spinnerWrapper').hide();

        }, 0)    
    });
}

const goToActorImdb = (imdbActorId, that) => {

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: movieActorsUrl + imdbActorId + "/external_ids?api_key=" + tmdbKey + '&language=en-US',
        dataType: "json",
        success: (data) => {

            if (data.imdb_id == null) {
                $('#noImdbPop').show();
            } else {
                $(that).parent().attr('href', 'https://www.imdb.com/name/' + data.imdb_id);
                that.trigger("click");
                that.off();
            }
        },
        error: (err) => {
            //console.log(err);
        }
    })
}

const showTimeline = (type, cinematicType) => {

    $('.timelineMovieWrapper').remove();
    $('#timeline').show();
    $('main, #nextMcuFilmPop').hide();
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

                finalClass = 'timelineMovieImg poster';

            } else {
                finalImg = 'https://image.tmdb.org/t/p/w1280' + cinematicArr[i].background;
                finalClass = 'timelineMovieImg background';
            }

            let timelineMovieLink = $('<a>', {
                class: 'timelineMovieLink',
                href: 'https://omriknight9.github.io/omris-movies/?title=' + cinematicArr[i].name + '&value=' + cinematicArr[i].id,
                target: '_blank',
                rel: 'noopener'
            }).appendTo(timelineMovieWrapper)
    
            let timelineMovieImg = $('<img>', {
                class: finalClass,
                src: finalImg,
                alt: 'movie img'
            }).appendTo(timelineMovieLink)

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

                finalClass = 'timelineMovieImg poster';

            } else {
                finalImg = 'https://image.tmdb.org/t/p/w1280' + tvShowTimelineArr[i].background;
                finalClass = 'timelineMovieImg background';
            }
    
            let timelineMovieImg = $('<img>', {
                class: finalClass,
                src: finalImg,
                alt: 'movie img'
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
    
    timelineUrl;

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
    $('#timeline').hide();
}

const configureDate = (data) => {

    let date = new Date(data);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return changeMonthName(month - 1) + ' ' + changeDayName(day) + ' ' + year;
}

const sort = (div, num) => {

    if ($('.sortContainer').is(':visible')) {
        $('.sortContainer').hide();
    }

    if ($('#toggle').hasClass('on')) {
        $('#toggle').removeClass('on')
    }

    switch (num) {
        case 1:
            if (marvelCounter == 1) {
                $(div).find($('.sortContainer')).fadeIn('fast');
                marvelCounter = 2;
                DCCounter = 1;
                valiantCounter = 1;
                othersCounter = 1;
                animationCounter = 1;
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
            } else {
                $(div).find($('.sortContainer')).fadeOut('fast');
                animationCounter = 1;
            }
            break;
    }
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

    for (let i = 0; i < data.items.length; i++) {

        let finalNameToSend;

        finalNameToSend = data.items[i].name.replace(/'/, "");
        finalNameToSend = finalNameToSend.replace(/-/, "");
        finalNameToSend = finalNameToSend.replace(/:/, "");
        finalNameToSend = finalNameToSend.replace(/\s/g, '');

        let tvShowWrapper = $('<div>', {
            class: 'tvShowWrapper ' + div,
            'year': data.items[i].first_air_date.substr(0, 4),
            'name': finalNameToSend,
            'value': data.items[i].id,

            click: function () {

                $.ajax({
                    type: 'GET',
                    crossDomain: true,
                    url: tvShowInfoUrl + $(this).attr('value') + "?api_key=" + tmdbKey + '&language=en-US',
                    dataType: "json",
                    success: function (data) {
                        $('.tvShowSeasonsPop').html('Seasons: ' + data.number_of_seasons);
                        $('.tvShowEpisodesPop').html('Episodes: ' + data.number_of_episodes);
                    },
                    error: function (err) {
                        //console.log(err);
                    }
                })

                $.ajax({
                    type: 'GET',
                    crossDomain: true,
                    url: tvShowInfoUrl + $(this).attr('value') + "/external_ids" + "?api_key=" + tmdbKey + '&language=en-US',
                    dataType: "json",
                    success: function (data) {
                        $('#tvShowImdbLink').attr('href', 'https://www.imdb.com/title/' + data.imdb_id);
                    },
                    error: function (err) {
                        //console.log(err);
                    }
                })

                $('#tvShowCredits').empty();
                $('.creditHeader').remove();

                $.ajax({
                    type: 'GET',
                    crossDomain: true,
                    url: tvShowInfoUrl + $(this).attr('value') + "/credits?api_key=" + tmdbKey + '&language=en-US',
                    dataType: "json",
                    success: function (data) {

                        if (data.cast.length > 0) {

                            let creditHeader = $('<span>', {
                                class: 'creditHeader',
                                text: 'Cast'
                            }).insertAfter($('.tvShowCoverWrapper'));

                            let finalLength;
    
                            if (data.cast.length < 21) {
                                finalLength = data.cast.length;
                            } else {
                                finalLength = 21
                            }

                            for (let i = 0; i < finalLength; i++) {

                                let tvCredit = $('<div>', {
                                    class: 'tvCredit'
                                }).appendTo($('#tvShowCredits'));

                                let actorImgPath;
                    
                                if (data.cast[i].profile_path == 'undefined' || data.cast[i].profile_path == null || data.cast[i].profile_path == '') {
            
                                    switch (data.cast[i].gender) {
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
                                    actorImgPath = 'https://image.tmdb.org/t/p/w1280' + data.cast[i].profile_path;
                                }

                                let imdbLink = $('<a>', {
                                    class: 'imdbLink',
                                    target: '_blank',
                                    rel: 'noopener',
                                }).appendTo(tvCredit);

                                let tvCreditImg = $('<img>', {
                                    class: 'tvCreditImg',
                                    src: actorImgPath,
                                    actorId: data.cast[i].id,
                                    click: function() {
                                        goToActorImdb($(this).attr('actorId'), $(this));
                                    }
                                }).appendTo(imdbLink);

                                let trimmedString;

                                if (data.cast[i].character.length > 25) {
            
                                    if (countInstances(data.cast[i].character, '/') > 1) {
                                    
                                        let maxLength = 25;
                                        trimmedString = data.cast[i].character.substr(0, maxLength);
                                        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
            
                                        trimmedString = data.cast[i].character.split('/');
            
                                        if (trimmedString.length > 2) {
                                            trimmedString = trimmedString[0] + '/' + trimmedString[1] + '& More';
                                        } else {
                                            trimmedString = trimmedString[0] + '/' + trimmedString[1];
                                        }
                
                                    } else {
                                        trimmedString = data.cast[i].character;
                                    }
            
                                } else {
                                    trimmedString = data.cast[i].character;
                                }

                                let tvCreditName = $('<span>', {
                                    class: 'tvCreditName',
                                    text: data.cast[i].name + ':'
                                }).appendTo(tvCredit);

                                let tvCreditCharacter = $('<span>', {
                                    class: 'tvCreditCharacter',
                                    text: trimmedString
                                }).appendTo(tvCredit);
                            }
                        }
                    },
                    error: function (err) {
                        //console.log(err);
                    }
                })

                $('.tvShowNamePop').removeClass('longTitle');

                if ($(this).find($('.name')).html().length > 30) {
                    $('.tvShowNamePop').addClass('longTitle');
                }

                $('.tvShowCoverWrapper').css('background', 'url(' + $(this).find('.tvShowImg').attr('src') + ') top center no-repeat');
                $('.tvShowNamePop').html($(this).find($('.name')).html());
                $('#tvShowDetails').fadeIn(150);

                $('#tvShowYoutubeImage').click(() => {     
                    $.ajax({
                        type: 'GET',
                        crossDomain: true,
                        url: tvShowInfoUrl + $(this).attr('value') + "/videos?api_key=" + tmdbKey + "&language=en-US",
                        dataType: "json",
                        success: (data) => {

                            if(data.results.length > 0) {
                                $('#tvShowDetails').hide();
                                $('#tvShowDetails').attr('chosenMovieId', '');
                                $('#trailer').fadeIn(150);
                                setTimeout(() => {
                                    let objectUrl = youtubeVideo + data.results[0].key + '?showinfo=0&enablejsapi=1';
                                    $('#trailerVideo').attr('src', objectUrl);
                                }, 500)
                            } else {
                                $('#noVideosPop').show();
                            }
                        },
                        error: (err) => {
                            //console.log(err);
                        }
                    })
                })
            }
        }).appendTo(tvShowContent);

        let tvShowImg = $('<img>', {
            class: 'tvShowImg',
            alt: 'tvShowImg',
            src: 'https://image.tmdb.org/t/p/w1280' + data.items[i].poster_path
        }).appendTo(tvShowWrapper);

        let tvShowName = $('<p>', {
            class: 'name',
            text: capitalize(data.items[i].name)
        }).appendTo(tvShowWrapper);

        let tvShowYear = $('<p>', {
            class: 'year',
            text: 'Year: ' + data.items[i].first_air_date.substr(0, 4)
        }).appendTo(tvShowWrapper);
    }
}

const countInstances = (string, word) => {
    return string.split(word).length - 1;
}

const showCinematicUniverse = (div, elem) => {

    for (let i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
        if ($($(div)[i]).attr(elem) == 'false') {
            $($(div)[i]).hide();
        }
    }

    for (let j = 0; j < $(div).length; j++) {
        let testDiv2 = $($($(div)[j]).parent())[0];
        if ($(testDiv2).children(':visible').length == 0) {
            $(testDiv2).css('padding-bottom', 0);
        } else {
            $(testDiv2).css('padding-bottom', '2rem');
        }
    }
}

const hideCinematicUniverse = (div, elem) => {

    for (let i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
        if ($($(div)[i]).attr(elem) == 'true') {
            $($(div)[i]).hide();
        }
    }

    for (let j = 0; j < $(div).length; j++) {
        let testDiv2 = $($($(div)[j]).parent())[0];
        if ($(testDiv2).children(':visible').length == 0) {
            $(testDiv2).css('padding-bottom', 0);
        } else {
            $(testDiv2).css('padding-bottom', '2rem');
        }
    }
}

const allOfKind = (div) => {

    for (let i = 0; i < $(div).length; i++) {

        let testDiv2 = $($($(div)[i]).parent())[0];
        $(testDiv2).css('padding-bottom', '2rem');

        $($(div)[i]).show();
        switch (cinematicType) {
            case 1:
                marvelCinematicCounter = 1;
                $('#btnMCU').html('MCU Only');
                break;
            case 2:
                dcCinematicCounter = 1;
                $('#btnDCEU').html('DCEU Only');
                break;
        }
    }

    $('.sortContainer').fadeOut('fast');
    marvelCounter = 1;
    DCCounter = 1;
    valiantCounter = 1;
    othersCounter = 1;
    animationCounter = 1;
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

    if (kind == 3) {
        $('#marvelContainer').empty();
        $('#dcContainer').empty();
        $('#valiantContainer').empty();
        $('#othersContainer').empty();
        $('#animationContainer').empty();
        $('#tvShowContainer').empty();
        mcuWasSorted = false;
        dceuWasSorted = false;
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
                case 3:
                    obj.idNum = parseInt(elem2.replace(/[^\d]/g, ""), 10);
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
                mcuWasSorted = true;
                dceuWasSorted = true;
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
                        mcuWasSorted = true;
                        dceuWasSorted = true;
                        break;
                }
                $(btnWrapper).attr('kind', kind);
                break;
            case 3:
                $('.spinnerWrapper').show();
                switch ($(container).attr('id')) {
                    case 'marvelContainer':
                        setTimeout(() => {
                            $('#marvel').click();
                        }, 1200);
                        break;
                    case 'dcContainer':
                        setTimeout(() => {
                            $('#dc').click();
                        }, 1200);
                        break;
                    case 'valiantContainer':
                        setTimeout(() => {
                            $('#valiant').click();
                        }, 1200);
                        break;
                    case 'othersContainer':
                        setTimeout(() => {
                            $('#others').click();
                        }, 1200);

                        break;
                    case 'animationContainer':
                        setTimeout(() => {
                            $('#disney').click();
                        }, 1200);
                        break;
                }

                loadJson();
                setTimeout(() => {
                    $('.spinnerWrapper').hide();
                }, 500);
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

const convertMinsToHrsMins = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? '' + h : h;
    m = m < 10 ? '' + m : m;

    if (h > 1) {
        if (m == 0) {
            return h + ' Hours'
        }
        return h + ' Hours ' + 'And ' + m + ' Minutes';
    } else {
        if (m == 0) {
            return h + ' Hour'
        }
        return h + ' Hour ' + 'And ' + m + ' Minutes';
    }
}
