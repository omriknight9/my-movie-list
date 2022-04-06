let cinematicType;
let lastChar;
let searchVal;
let cinematicArr = [];
let tvShowTimelineArr = [];
let providerTitle;
let providerClass;
let directorCounter = 0;
let commentsArr = [];
let valueFromUrl;
let searchAjax;
let lightMode = false;

const baseUrl = 'https://api.themoviedb.org/3';
const tmdbKey = '0271448f9ff674b76c353775fa9e6a82';
const movieInfoUrl = baseUrl + '/movie/';
const tvShowInfoUrl = baseUrl + '/tv/';
const movieActorsUrl = baseUrl + '/person/';
const youtubeVideo = 'https://www.youtube.com/embed/';
const listUrl = baseUrl + '/list/';
const searchMovieUrl = baseUrl + '/search/multi?api_key=' + tmdbKey + '&query=';
let upcomingUrl = movieInfoUrl + 'upcoming?api_key=' + tmdbKey + '&region=US&page=';
let nowPlayingUrl = movieInfoUrl + 'now_playing?api_key=' + tmdbKey + '&region=US&page=';
let getTrendingUrl = baseUrl + '/trending/all/day?api_key=' + tmdbKey + '&page=';
let moviesGenreUrl = baseUrl + '/discover/movie?api_key=' + tmdbKey + '&with_genres=';
let tvGenreUrl = baseUrl + '/discover/tv?api_key=' + tmdbKey + '&with_genres=';

// const providerUpcomingUrl = baseUrl + '/discover/movie?api_key=' + tmdbKey + '&watch_region=US&primary_release_date.gte=' + new Date().toISOString().substring(0, 10);
const providerUpcomingUrl = baseUrl + '/discover/movie?api_key=' + tmdbKey + '&watch_region=US';

$(document).ready(() => {
    if (window.location.href.indexOf("?movie=") > -1 || window.location.href.indexOf("?tvShow=") > -1 || window.location.href.indexOf("?actor=") > -1 || window.location.href.indexOf("?director=") > -1) { 
        const urlParams = new URLSearchParams(window.location.search);
        valueFromUrl = Number(urlParams.get('value'));
    }

    if (window.location.href.indexOf("?movie=") > -1) {
        chosenMovie(valueFromUrl, 1);
        refreshWindowScroll(1);

    } else if (window.location.href.indexOf("?tvShow=") > -1) {
        chosenMovie(valueFromUrl, 2);
        refreshWindowScroll(1);

    } else if (window.location.href.indexOf("?actor=") > -1) {
        getPersonDetails(valueFromUrl, 1);
        refreshWindowScroll(1);

    } else if (window.location.href.indexOf("?director=") > -1) {
        getPersonDetails(valueFromUrl, 2);
        refreshWindowScroll(2);

    } else if (window.location.href.indexOf("?timeline=") > -1) {
        window.history.replaceState({}, document.title, "/" + "my-movie-list/");
        refreshWindowScroll(2);
    } else {
        refreshWindowScroll(2);
    }

    loadJson();

    window.onbeforeunload = () => {
        window.scrollTo(0, 0);
    }

    $('#darkToggle').click(() => {
        if (!$('#darkToggle').hasClass('dark')) {
            lightMode = true;
            $("head").append("<link rel='stylesheet' type='text/css' href='css/lightMode.css' id='darkCss'/>");
        } else {
            lightMode = false;
            $('#darkCss').remove();
        }
      
        $('#darkToggle').toggleClass('dark');
    });

    $('.closeBtn').click(function () {
        if($(this).parent().parent().attr('id') == 'movieDetails') {
            $('#movieDetails').attr('chosenMovieId', '');
        }

        $(this).parent().parent().fadeOut(150);
    })

    $('#search').on('keyup', () => {
        setTimeout(() => {
            searchAjax.abort();
        }, 0)
        closeMenus();

        searchVal = $('#search').val();
        lastChar = searchVal.substr(searchVal.length - 1);
    
        if (lastChar == ' ') {
            return;
        }

        if (searchVal.length == 0) {
            $('#searchResults').empty().hide();
        } else {
            setTimeout(() => {
                showResults(searchVal);
            }, 100)
        }
    })
});

const loadJson = () => {
    let promise1 = new Promise((resolve) => {
        resolve(getList(7099604, 'marvel', $('#marvelContainer'), 1, 1));
    })
    .then(() => {
        getList(7099603, 'dc', $('#dcContainer'), 2, 1);
    })
    .then(() => {
        getList(7099609, 'valiant', $('#valiantContainer'), 3, 1);
    })
    .then(() => {
        getList(7099605, 'others', $('#othersContainer'), 4, 1);
    })
    .then(() => {
        getList(7099575, 'animation', $('#animationContainer'), 5, 1);
    })
    .then(() => {
        getList(7099607, 'tvShow', $('#tvShowContainer'), null, 2);
    })
}

const getList = (value, div, wrapper, type, movieOrTv) => {
    let arr = [];

    $.get('https://api.themoviedb.org/4/list/' + value + '?api_key=' + tmdbKey, (data) => {
        getComments(data, movieOrTv, arr, 1);

        if (data.total_pages > 1) {
            for (let i = 2; i < data.total_pages + 1; i++) {
                $.get('https://api.themoviedb.org/4/list/' + value + '?api_key=' + tmdbKey + '&page=' + i, (data) => {
                    getComments(data, movieOrTv, arr, 1);
                });
            }

            setTimeout(() => {
                if (movieOrTv == 1) {
                    buildMovies(arr, div, wrapper, type); 
                } else {
                    buildTvShows(arr, 'tvShow', $('#tvShowContainer'));
                }

            }, 1000)
        } else {
            setTimeout(() => {
                if (movieOrTv == 1) {
                    buildMovies(arr, div, wrapper, type); 
                } else {
                    buildTvShows(arr, 'tvShow', $('#tvShowContainer'));
                }
            }, 1000)
        }
    });
}

const getComments = (data, movieOrTv, arr, type) => {

    $.each(data.comments, (key, value) =>  {

        if (value !== null) {
            let finalOrder;
            if(value.split(',')[1] == undefined) {
                finalOrder = 0;
            } else {
                finalOrder = value.split(',')[1].trim();
            }

            let finalValue;

            if (movieOrTv == 1) {
                finalValue = key.replace('movie:', '');
            } else {
                finalValue = key.replace('tv:', '');
            }

            let obj;

            if (type == 1) {
                obj = {
                    value: finalValue,
                    quality: value.split(',')[0].trim(),
                    order: finalOrder
                }
            } else {
                obj = {
                    value: finalValue,
                    quality: value.split(',')[0].trim(),
                    order: finalOrder,
                    delete: value.split(',')[2].trim()
                }
            }

            commentsArr.push(obj);
        }
    });

    for (let i = 0; i < data.results.length; i++) {
        arr.push(data.results[i]); 
    }

    $.each(arr, (key, value) => {      
        for (let w = 0; w < commentsArr.length; w++) {     
            if (value.id == commentsArr[w].value) {
                arr[key].quality = commentsArr[w].quality;
                arr[key].order = commentsArr[w].order;
            }  
        }
    });
}

const showWishlist = () => {

    if ($("#wishlistContainer").text().length > 0) {
        return;
    }

    $('#miscellaneousList').hide();
    $('#miscellaneousRow').css('border-bottom', 'none');
    $('#spinnerWrapper').show();
    $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});

    if ($('#chosenMovie').is(':visible') || $('#chosenPerson').is(':visible') || $('#timeline').is(':visible')) {
        goToDiv('#wishlistContainer');
    }

    $('.container').hide();
    emptyContainers();

    let arr = [];

    commentsArr.reduceRight(function(acc, item, index, object) {
        if (item.delete === 'yes') {
          object.splice(index, 1);
        }
    }, []);

    $.get('https://api.themoviedb.org/4/list/' + 7110189 + '?api_key=' + tmdbKey, (data) => {
        
        getComments(data, 1, arr, 2);

        if (data.total_pages > 1) {
            for (let i = 2; i < data.total_pages + 1; i++) {
                $.get('https://api.themoviedb.org/4/list/' + 7110189 + '?api_key=' + tmdbKey + '&page=' + i, (data) => {
                    getComments(data, 1, arr, 2);
                });
            }
        }

        setTimeout(() => {     
            $('#wishlistContainer').css('display', 'flex');
            buildMovies(arr, 'wishlist', $('#wishlistContainer'), 10);
        }, 1000)
    })
    .done(() => {
        setTimeout(() => {
            $('#spinnerWrapper').hide();
            $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
        }, 1500)
    })
    .fail(() => {
        setTimeout(() => {
            $('#spinnerWrapper').hide();
            $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
        }, 1500)
    })
}

const showTrending = () => {
    if ($("#trendingContainer").text().length > 0) {
        return;
    }

    $('#spinnerWrapper').show();
    $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});

    if ($('#chosenMovie').is(':visible') || $('#chosenPerson').is(':visible') || $('#timeline').is(':visible')) {
        goToDiv('#trendingContainer');
    }

    $('.container').hide();
    emptyContainers();

    let totalPages;
    let arr = [];

    $.get(getTrendingUrl + 1, (data) => {
        for (let  i = 0; i < data.results.length; i++) {
            arr.push(data.results[i]);
        }

        totalPages = data.total_pages;

        if (totalPages > 1) {
            setTimeout(() => {
                $.get(getTrendingUrl + 2, (data) => {
                    for (let  j = 0; j < data.results.length; j++) {
                        arr.push(data.results[j]);
                    }
        
                    setTimeout(() => {
                        $('#trendingContainer').css('display', 'flex');
                        buildTrending(arr, 'trending', $('#trendingContainer'));
                    }, 500)
                });
            }, 1000)
        }
    })
}

const showProvider = (providerId) => {
    
    if ($("#providerContainer").text().length > 0) {
        return;
    }

    switch (providerId) {
        case 337:
            providerTitle = 'Disney Plus';
            providerClass = 'disneyPlus';
            break;
        case 384:
            providerTitle = 'HBO Max';
            providerClass = 'hboMax';
            break;
        case 8:
            providerTitle = 'Netflix';
            providerClass = 'netflix';
            break;
        case 9:
            providerTitle = 'Amazon Prime Video';
            providerClass = 'amazonPrime';
            break;
    }

    $('#spinnerWrapper').show();
    $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});

    if ($('#chosenMovie').is(':visible') || $('#chosenPerson').is(':visible') || $('#timeline').is(':visible')) {
        goToDiv('#providerContainer');
    }

    $('.container').hide();
    emptyContainers();

    let totalPages;
    let arr = [];

    $.get(providerUpcomingUrl + '&page=1&with_watch_providers=' + providerId, (data) => {
        for (let i = 0; i < data.results.length; i++) {
            arr.push(data.results[i]);     
        }

        totalPages = data.total_pages;

        if (totalPages > 1) {
            getInfo(providerUpcomingUrl + '&page=2&with_watch_providers=' + providerId, arr, 'provider', $('#providerContainer'), 9);
        }
    })
    .done(() => {
        setTimeout(() => {
            $('#spinnerWrapper').hide();
            $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
        }, 1500)
    })
    .fail(() => {
        setTimeout(() => {
            $('#spinnerWrapper').hide();
            $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
        }, 1500)
    })
}

const showPlayingNow = () => {
    if ($("#playingNowContainer").text().length > 0) {
        return;
    }

    $('#spinnerWrapper').show();
    $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});

    if ($('#chosenMovie').is(':visible') || $('#chosenPerson').is(':visible') || $('#timeline').is(':visible')) {
        goToDiv('#playingNowContainer');
    }

    $('.container').hide();
    emptyContainers();

    let totalPages;
    let arr = [];

    $.get(nowPlayingUrl + 1, (data) => {
        for (let  i = 0; i < data.results.length; i++) {
            arr.push(data.results[i]);
        }

        totalPages = data.total_pages;

        if (totalPages > 1) {
            getInfo(nowPlayingUrl + 2, arr, 'playingNow', $('#playingNowContainer'), 7);
        }
    })
}

const showUpcoming = () => {
    if ($("#upcomingContainer").text().length > 0) {
        return;
    }

    $('#spinnerWrapper').show();
    $('#chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'none', 'opacity': 0});

    if ($('#chosenMovie').is(':visible') || $('#chosenPerson').is(':visible') || $('#timeline').is(':visible')) {
        goToDiv('#upcomingContainer');
    }

    $('.container').hide();
    emptyContainers();

    let totalPages;
    let arr = [];

    $.get(upcomingUrl + 1, (data) => {
        for (let  i = 0; i < data.results.length; i++) {
            arr.push(data.results[i]);
        }

        totalPages = data.total_pages;

        if (totalPages > 1) {
            getInfo(upcomingUrl + 2, arr, 'upcoming', $('#upcomingContainer'), 6);
        }
    })
}

const emptyContainers = () => {
    $.each($('.emptyable'), function (key, value) {
        if ($(value).text().length > 0) {
            $(value).empty();
        }
    });
}

const getInfo = (url, arr, className, container, type, ) => {
    setTimeout(() => {
        $.get(url, (data) => {
            for (let j = 0; j < data.results.length; j++) {
                arr.push(data.results[j]);
            }

            setTimeout(() => {
                $(container).css('display', 'flex');
                buildMovies(arr, className, container, type);
            }, 500)
        })
        .done(() => {
            setTimeout(() => {
                $('#spinnerWrapper').hide();
                $('main, #chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
            }, 1000)
        })
        .fail(() => {
            setTimeout(() => {
                $('#spinnerWrapper').hide();
                $('main, #chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
            }, 1000)
        })
    }, 1000)
}

const showResults = (value) => {
    searchAjax = $.get(searchMovieUrl + value, (data) => {
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
                class: 'resultRow pointer',
                popularity: data.results[i].popularity,
                name: finalTitle,
                id: data.results[i].id,
                type: data.results[i].media_type,
                knownFor: data.results[i].known_for_department,
                click: function () {
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

                            if ($(this).attr('knownFor') == 'Directing') {
                                getPersonDetails(data.results[i].id, 2);
                            } else if($(this).attr('knownFor') == 'Acting') {
                                getPersonDetails(data.results[i].id, 1);
                            } else if($(this).attr('knownFor') == 'Writing') {
                                getPersonDetails(data.results[i].id, 3);
                            }
                            
                            break;
                    }
                }
            }).appendTo($('#searchResults'));

            $('<img>', {
                class: 'resultPoster',
                alt: 'poster',
                src: posterUrl
            }).appendTo(resultWrapper);

            $('<p>', {
                class: 'resultName',
                text: capitalize(finalTitle)
            }).appendTo(resultWrapper);

            if (data.results[i].media_type !== 'person') {
                $('<p>', {
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
                    $('<p>', {
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
    lazyloadImages.forEach((img) => {
        if (img.getBoundingClientRect().top + 100 < (window.innerHeight)) {
            if ($(img).is(':visible')) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            }
        }
    });
}

const buildTrending = (data, div, wrapper) => {

    if (!$('#breadcrumbs').is(':visible')) {
        $('#breadcrumbs').show();
    }

    $('#logo').css('pointerEvents', 'all');
    $('#typeOfContent').attr('class', 'fas fa-fire');

    $('#contentPoster').css('background', '').hide();

    $('#trendingContainer').attr({'nameCounter': '1', 'dateCounter': '1'})

    $('<h2>', {
        class: 'trendingHeader',
        text: 'Trending'
    }).appendTo(wrapper);

    let headerLine = $('<div>', {
        class: 'line lineTrending',
    }).appendTo(wrapper);

    $('<span>', {
        class: 'headerLogo',
    }).appendTo(headerLine);

    let trendingContent = $('<div>', {
        id: 'trendingContent',
    }).appendTo(wrapper);

    let btnWrapper = $('<div>', {
        class: 'btnWrapper filter',
    }).appendTo(trendingContent);

    $('<i>', {
        class: 'sortNameBtn fas fa-sort-alpha-down pointer',
        click: function () {
            sortByName(wrapper, 2);
        }
    }).appendTo(btnWrapper);

    $('<i>', {
        class: 'sortDateBtn far fa-calendar-alt pointer',
        click: function () {
            sortByDate(wrapper, 2);
        }
    }).appendTo(btnWrapper);

    for (let i = 0; i < data.length; i++) {
        let finalTitle;
        let type;
        let finalDate;
        if (data[i].media_type == 'movie') {
            type = 1;
            finalTitle = data[i].title;
            finalDate = data[i].release_date;
        } else if (data[i].media_type == 'tv') {
            type = 2;
            finalTitle = data[i].name;
            finalDate = data[i].first_air_date;
        }

        if (type == 1 || type == 2) {
            let trendingWrapper = $('<div>', {
                class: 'trendingWrapper hoverEffect pointer ' + div,
                'date': finalDate,
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
    
            $('<img>', {
                class: finalClass,
                alt: 'movieImg',
                'data-src': dataSrc,
                'src': finalSrc
            }).appendTo(trendingWrapper);
    
            $('<p>', {
                class: 'name',
                text: capitalize(finalTitle),
            }).appendTo(trendingWrapper);
    
            $('<p>', {
                class: 'date',
                text: configureDate(finalDate)
            }).appendTo(trendingWrapper);

            updateVotes(data[i].vote_average, trendingWrapper);
        }
    }

    setTimeout(() => {
        $('#spinnerWrapper').hide();
        $('main, #chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
    }, 2000)
}

const buildMovies = (data, div, wrapper, type) => {

    $(wrapper).attr({'nameCounter': '1', 'dateCounter': '1'});

    data.sort(function (a, b) { return (a.order - b.order); });

    let headerText;
    let headerLineClass;
    let iconForBreadcrumb;

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
            headerText = 'Upcoming';
            headerLineClass = 'lineUpcoming';
            iconForBreadcrumb = 'fas fa-calendar-day';
            break;
        case 7:
            headerText = 'Playing Now';
            headerLineClass = 'linePlayingNow';
            iconForBreadcrumb = 'fas fa-ticket-alt';
            break;
        case 8:
            headerText = 'Movies';
            headerLineClass = 'lineGenre';
            iconForBreadcrumb = 'fas fa-theater-masks';
            break;
        case 9:
            headerText = providerTitle;
            headerLineClass = 'lineProvider ' + providerClass;
            iconForBreadcrumb = 'fas fa-satellite-dish';
            break;
        case 10:
            headerText = 'Wishlist';
            headerLineClass = 'lineWishlist';
            iconForBreadcrumb = 'fas fa-clipboard-list';
            break;
    }

    if (type > 5) {
        $('#breadcrumbs').show();
        $('#typeOfContent').attr('class', iconForBreadcrumb);

        $('#contentPoster').css('background', '').hide();

        $('#logo').css('pointerEvents', 'all');
    }

    $('<h2>', {
        class: 'typeheader',
        text: headerText
    }).appendTo(wrapper);

    let headerLine = $('<div>', {
        class: 'line ' + headerLineClass,
    }).appendTo(wrapper);

    $('<span>', {
        class: 'headerLogo',
    }).appendTo(headerLine);

    let moviesContent = $('<div>', {
        class: 'moviesContent',
    }).appendTo(wrapper);

    if (type !== 6 && type !== 3) {
        let btnWrapper = $('<div>', {
            class: 'btnWrapper filter',
        }).appendTo(moviesContent);

        $('<i>', {
            class: 'sortNameBtn fas fa-sort-alpha-down pointer',
            click: function () {
                sortByName(wrapper, 1);
            }
        }).appendTo(btnWrapper);

        $('<i>', {
            class: 'sortDateBtn far fa-calendar-alt pointer',
            click: function () {
                sortByDate(wrapper, 1);
            }
        }).appendTo(btnWrapper);

        if (type == 1 || type == 2) {
            let finalCinematicUrl;
            let finalTvUrl;
            let finalImgSrc;
            let finalCinematicClass;

            if (type == 1) {
                finalCinematicUrl = listUrl + '7099064?api_key=' + tmdbKey;
                finalTvUrl = listUrl + '7099128?api_key=' + tmdbKey;
                finalImgSrc = './images/mcu.png';
                finalCinematicClass = 'mcuBtn';
            } else {
                finalCinematicUrl = listUrl + '7099063?api_key=' + tmdbKey;
                finalTvUrl = listUrl + '7099130?api_key=' + tmdbKey;
                finalImgSrc = './images/dceu.png';
                finalCinematicClass = 'dceuBtn';
            }

            $('<img>', {
                class: 'pointer ' + finalCinematicClass,
                src: finalImgSrc,
                alt: 'cinematic',
                click: () => {
                    closeMenus();
                    $('main, #menuOpenWrapper, footer, #goToTopBtn').css({'pointer-events': 'none', 'opacity': '0'});
                    $('.popUpInfo').css({'pointer-events': 'none', 'opacity': '.1'});
                    $('#spinnerWrapper').show();

                    getCinematicInfo(finalCinematicUrl, type, true);
                    setTimeout(() => {
                        getTVShowInfo(finalTvUrl, type);
                    }, 1000);
                }
            }).appendTo(btnWrapper);
        }    
    }

    for (let i = 0; i < data.length; i++) {

        let finalReleaseDate;
        if (data[i].release_date == '' || data[i].release_date == null || data[i].release_date == undefined) {
            finalReleaseDate = 'Unknown';
 
        } else {
            finalReleaseDate = configureDate(data[i].release_date); 
        }

        let movieWrapper = $('<div>', {
            class: 'movieWrapper hoverEffect pointer ' + div,
            'date': data[i].release_date,
            'value': data[i].id,
            'quality': data[i].quality,
            'order': data[i].order,
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

        $('<img>', {
            class: finalClass,
            alt: 'movieImg',
            'data-src': dataSrc,
            'src': finalSrc
        }).appendTo(movieWrapper);

        $('<p>', {
            class: 'name',
            text: capitalize(data[i].title),
        }).appendTo(movieWrapper);

        $('<p>', {
            class: 'date',
            text: finalReleaseDate
        }).appendTo(movieWrapper);

        updateVotes(data[i].vote_average, movieWrapper);
    }

    if (type == 1) {
        setTimeout(() => {
            $('#spinnerWrapper').hide();
            $('.searchContainer').css({'pointer-events': 'all', 'opacity': 1});
            $('button').show();
            $('.container, footer').css('display', 'flex');
        }, 500);
    }
}

const buildTvShows = (data, div, wrapper) => {

    data.sort(function (a, b) { return (a.order - b.order); });

    $('<h2>', {
        class: 'tvShowsHeader',
        text: 'TV Shows'
    }).appendTo(wrapper);

    let headerLine = $('<div>', {
        class: 'line lineTvShows',
    }).appendTo(wrapper);

    $('<span>', {
        class: 'headerLogo',
    }).appendTo(headerLine);

    let tvShowContent = $('<div>', {
        id: 'tvShowContent',
    }).appendTo(wrapper);

    for (let i = 0; i < data.length; i++) {
        let tvShowWrapper = $('<div>', {
            class: 'tvShowWrapper hoverEffect pointer ' + div,
            'year': data[i].first_air_date.substr(0, 4),
            'value': data[i].id,
            'quality': data[i].quality,
            'order': data[i].order,
            click: function () {
                chosenMovie(data[i].id, 2);
            }
        }).appendTo(tvShowContent);

        $('<img>', {
            class: 'tvShowImg',
            alt: 'tvShowImg',
            src: 'https://image.tmdb.org/t/p/w1280' + data[i].poster_path
        }).appendTo(tvShowWrapper);

        $('<p>', {
            class: 'name',
            text: capitalize(data[i].name)
        }).appendTo(tvShowWrapper);

        $('<p>', {
            class: 'year',
            text: 'Year: ' + data[i].first_air_date.substr(0, 4)
        }).appendTo(tvShowWrapper);

        updateVotes(data[i].vote_average, tvShowWrapper);
    }
}

const chosenMovie = (value, type) => {

    if (!$('.searchContainer').is(':visible')) {
        $('.searchContainer').show();
    }

    closeMenus();
    emptyChosen(1, true);
    
    $('#chosenMovie').show();

    let chosenUrl;
    let finalUrl = getFinalUrl(type);

    if (type == 1) {
        chosenUrl = 'movie';
    } else {
        chosenUrl = 'tvShow';
    }

    // getCredits(value, type);
    // getSimilar(value, type);
    // getImages(value, type);
    // getVideos(value, type);
    // getWatchProviders(value, type);

    $.get(finalUrl + value + "?api_key=" + tmdbKey + '&append_to_response=images,similar,videos,keywords,credits,watch/providers,external_ids', (data) => {
        let finalTitle;

        if (type == 1) {
            finalTitle = data.title;
        } else {
            finalTitle = data.name;
        }

        refreshUrl(value, finalTitle, 2, null, chosenUrl);

        let finalImg;

        if (data.backdrop_path == null || data.backdrop_path == undefined || data.backdrop_path == '') { 
            finalImg = './images/stockMovie.jpg';
        } else {
            finalImg = 'https://image.tmdb.org/t/p/w1280' + data.backdrop_path;
        }
        
        if (type == 2) {
            $('#chosenMovieTitle').html(capitalize(data.name));
        } else {
            $('#chosenMovieTitle').html(capitalize(data.title));
        }

        if (data.external_ids.imdb_id !== null) {
            $('#chosenMovieImdb').attr('href', 'https://www.imdb.com/title/' + data.external_ids.imdb_id);
            $('#chosenMovieImdb').css('pointer-events', 'all');
        } else {
            $('#chosenMovieImdb').css('pointer-events', 'none');
        }

        $('#chosenMovieImg').attr('src', finalImg);
        $('#chosenMovieSentence').html(data.tagline);
        
        if (finalImg == './images/stockMovie.jpg') {
            $('#contentPoster').css('background', '').hide();   
        } else {
            $('#contentPoster').attr('src', finalImg).show();
        }

        let companiesArr = [56, 79, 104, 308, 435, 779, 1225, 6573, 7297, 10246, 13184, 16615, 30148, 103673];
        
        if (data.production_companies.length > 0) {
            for (let i = 0; i < data.production_companies.length; i++) {
                if (data.production_companies[i].logo_path !== null && !companiesArr.includes(data.production_companies[i].id)) {
                    $('<img>', {
                        class: 'companyImg',
                        alt: 'company img',
                        src: 'https://image.tmdb.org/t/p/w1280' + data.production_companies[i].logo_path
                    }).appendTo($('#productionCompenies'));
                }
            }
        }

        if(data.overview !== null && data.overview !== '' && data.overview !== undefined) {
            $('<p>', {
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
            $('<div>', {
                id: 'tvShowSeasonsWrapper',
            }).insertAfter($('#chosenMovieGenres'));

            if(data.number_of_seasons > 1) {
                $('<button>', {
                    id: 'allSeasonsBtn',
                    text: 'View All Seasons',
                    click: () => {
                        $('.overviewWrapper').remove();
                        showSeasonsBtns(data.number_of_seasons, 1);
                    }
                }).appendTo($('#tvShowSeasonsWrapper'));
            } else {
                showSeasonsBtns(data.number_of_seasons, 2);
            }
        }

        if (data.original_language !== 0 && data.original_language !== undefined) {
            $('#movieLang').html('Language: ' + data.original_language);        
            $('#chosenMovieLang').show();
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
                $('#genresText').html('Genres: ');

                let genresContent = $('<div>', {
                    id: 'genresContent',
                }).appendTo($('#chosenMovieGenres'));

                for (let w = 0; w < movieObj.length; w++) {
                    $('<span>', {
                        class: 'genre pointer',
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
                            emptyContainers();

                            let totalPages;
                            let arr = [];

                            let finalGenreUrl;

                            if (type == 1) {
                                finalGenreUrl = moviesGenreUrl + movieObj[w].id;
                            } else {
                                finalGenreUrl = tvGenreUrl + movieObj[w].id;
                            }

                            $.get(finalGenreUrl + '&page=1', (data) => {
                                for (let  s = 0; s < data.results.length; s++) {
                                    arr.push(data.results[s]);
                                }

                                totalPages = data.total_pages;

                                if (totalPages > 1) {
                                    setTimeout(() => {
                                        $.get(finalGenreUrl + '&page=2', (data) => {
                                            for (let  x = 0; x < data.results.length; x++) {
                                                arr.push(data.results[x]);
                                            }
                                            setTimeout(() => {
                                                $('#genreChosen').css('display', 'flex');
                                                if (type == 1) {
                                                    buildMovies(arr, 'genreMovie', $('#genreChosen'), 8);
                                                } else {
                                                    buildTvShows(arr, 'genreMovie', $('#genreChosen'));
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

        getImages(data.images);
        getVideos(data.videos);
        getSimilar(data.similar, type);
        getCredits(data.credits, type);
        getWatchProviders(data['watch/providers'], type);
    });

    setTimeout(() => {
        refreshWindowScroll(1);
    }, 1000)
}

const getWatchProviders = (data, type) => {
    let providerArr = [337, 8, 384, 37, 9, 15, 350];

    if (data.results.US !== undefined && data.results.US.flatrate !== undefined) {
        let results = data.results.US.flatrate;

        for (let i = 0; i < results.length; i++) {
            if (results[i].logo_path !== null) {
                if (providerArr.includes(results[i].provider_id)) {
                    $('<img>', {
                        class: 'watchProvider',
                        alt: 'watch provider img',
                        src: 'https://image.tmdb.org/t/p/w1280' + results[i].logo_path
                    }).appendTo($('#watchProviders')); 
                }
            }
        }
    }

    setTimeout(() => {
        $('#spinnerWrapper').hide();
        $('#chosenMovie, footer, #menuOpenWrapper, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});

        $('#breadcrumbs').show();
        $('#logo').css('pointerEvents', 'all');

        let iconClass;
        if (type == 1) {
            iconClass = 'fas fa-video';
        } else {
            iconClass = 'fas fa-tv';
        }
        $('#typeOfContent').attr('class', iconClass);

    }, 1500)
}

const getCredits = (data, type) => {
    directorCounter = 0;
    $('#directorsWrapper').hide();
    $('#castHeader').remove();

    if (type == 1) {
        if (data.crew.length > 0) {

            $('#directorsWrapper').show();

            $('<p>', {
                class: 'directorHeader chosenHeader filter',
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
    
                        $('<img>', {
                            class: 'directorImg hoverEffect lazy pointer filter',
                            'data-src': directorImgPath,
                            'src': './images/actor.jpg',
                            alt: 'director',
                            id: data.crew[w].id,
                            click: () => {
                                getPersonDetails(data.crew[w].id, 2);
                            }
                        }).appendTo(directorName);

                        $('<span>', {
                            class: 'actorName filter',
                            text: data.crew[w].name
                        }).appendTo(directorName);

                        let directorLinksWrapper = $('<div>', {
                            class: 'directorLinksWrapper',
                        }).appendTo(directorName);

                        $.get(movieActorsUrl + data.crew[w].id + "/external_ids?api_key=" + tmdbKey, (data) => {
                            if(data.imdb_id !== null) {

                                let imdbLinkWrapper = $('<a>', {
                                    class: 'imdbLinkWrapper',
                                    rel: 'noopener',
                                    target: '_blank',
                                    href: 'https://www.imdb.com/name/' + data.imdb_id
                                }).appendTo(directorLinksWrapper);
            
                                $('<img>', {
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
            
                                $('<img>', {
                                    class: 'directorInstagramLink',
                                    src: './images/instagram.png',
                                    alt: 'instagramImg',
                                }).appendTo(instagramWrapper);
                            }

                            if(data.instagram_id == null && data.imdb_id !== null) {
                                $(directorLinksWrapper).find($('.imdbLinkWrapper')).css('margin-right', 0);
                            } else if(data.instagram_id !== null && data.imdb_id == null) {
                                $(directorLinksWrapper).find($('.instagramWrapper')).css('margin-left', 0);
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
        
        $('<p>', {
            id: 'castHeader',
            class: 'chosenHeader filter',
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

                $('<img>', {
                    class: 'actorImg hoverEffect lazy pointer filter',
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

                $('<span>', {
                    class: 'actorName filter',
                    text: finalActorName
                }).appendTo(actor);

                $('<span>', {
                    class: 'characterName filter',
                    text: trimmedString
                }).appendTo(actor);

                let actorLinksWrapper = $('<div>', {
                    class: 'linksWrapper',
                }).appendTo(actor);

                $.get(movieActorsUrl + data.cast[k].id + "/external_ids?api_key=" + tmdbKey, (data) => {
                    if(data.imdb_id !== null) {
                        let imdbLinkWrapper = $('<a>', {
                            class: 'imdbLinkWrapper',
                            rel: 'noopener',
                            target: '_blank',
                            href: 'https://www.imdb.com/name/' + data.imdb_id
                        }).appendTo(actorLinksWrapper);
    
                        $('<img>', {
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
    
                        $('<img>', {
                            class: 'actorInstagramLink',
                            src: './images/instagram.png',
                            alt: 'instagramImg',
                        }).appendTo(instagramWrapper);
                    }

                    if(data.instagram_id == null && data.imdb_id !== null) {
                        $(actorLinksWrapper).find($('.imdbLinkWrapper')).css('margin-right', 0);
                    } else if(data.instagram_id !== null && data.imdb_id == null) {
                        $(actorLinksWrapper).find($('.instagramWrapper')).css('margin-left', 0);
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }

        checkLength(finalLength, '#castContent');
    }

}

const getImages = (data) => {
    $('#chosenMovieImagesWrapper').hide();

    if (data.backdrops.length > 0) {
        $('#chosenMovieImagesWrapper').css('display', 'flex');
        let finalLength;
        if (data.backdrops.length > 10) {
            finalLength = 10;
        } else {
            finalLength = data.backdrops.length;
        }

        for (let q = 0; q < finalLength; q++) {
            try {
                if (data.backdrops[q].file_path == null || data.backdrops[q].file_path == '') {
                    galleryImg = './images/stockMovie.jpg';
                } else {
                    galleryImg = 'https://image.tmdb.org/t/p/w1280' + data.backdrops[q].file_path;
                }

                $('<img>', {
                    class: 'movieGalleryImg lazy filter',
                    src: './images/stockMovie.jpg',
                    'data-src': galleryImg,
                    alt: 'movieGalleryImg',
                }).appendTo($('#chosenMovieImagesWrapper'));
            
            } catch (e) {
                console.log(e);
            }
        }
    }
}

const getVideos = (data) => {
    $('#videosWrapper').hide();

    if (data.results.length > 0) {
        $('#videosWrapper').css('display', 'flex');
        let finalLength;
        if (data.results.length > 5) {
            finalLength = 5;
        } else {
            finalLength = data.results.length;
        }

        for (let t = 0; t < finalLength; t++) {
            let objectUrl = youtubeVideo + data.results[t].key + '?showinfo=0&enablejsapi=1';
            $('<iframe>', {
                class: 'movieVideo',
                title: 'video',
                src: objectUrl,
                width: '420',
                height: '315',
                allowfullscreen: true,
            }).appendTo($('#videosWrapper'));
        }
    }
}

const getSimilar = (data, type) => {
    if (type == 1) {
        $('#similarHeader').html('Similar Movies'); 
    } else {
        $('#similarHeader').html('Similar TV Shows'); 
    }

    $('#similarMovies').hide();

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

                $('<img>', {
                    class: 'similarMovieImg hoverEffect lazy pointer filter',
                    'data-src': img,
                    'src': './images/stock.png',
                    alt: 'similarMovieImg',
                    click: () => {
                        chosenMovie(data.results[i].id, type);
                    }
                }).appendTo(credit);

                $('<span>', {
                    class: 'similarMovieName filter',
                    text: finalTitle
                }).appendTo(credit);
            } catch (e) {
                console.log(e);
            }
        }

        checkLength(data.results.length, '#similarMoviesContent');
    }
}

const showSeasonsBtns = (seasonsNum, type) => {

    $('#guestCast, #guestCastHeader').remove();
    $('#allSeasonsBtn').hide();
    $('#seasonBackBtn, #seasonBtnWrapper').remove();

    let seasonBtnWrapper = $('<div>', {
        id: 'seasonBtnWrapper',
    }).appendTo($('#tvShowSeasonsWrapper'));

    if (type == 1) {
        $('<button>', {
            id: 'seasonBackBtn',
            text: 'Back',
            click: () => {
                $('#seasonBtnWrapper').hide();
                setTimeout(() => {
                    $('#seasonBtnWrapper').show(); 
                }, 500)
                $('#allSeasonsBtn').show();
                $('#seasonBtnWrapper, .overviewWrapper').remove();
            }
        }).appendTo(seasonBtnWrapper); 

        for (let i = 0; i < seasonsNum; i++) {
            $('<button>', {
                class: 'seasonBtn',
                text: (i + 1),
                click: () => {
                    $('#seasonBtnWrapper').hide();
                    setTimeout(() => {
                        $('#seasonBtnWrapper').show(); 
                    }, 500)
                    seasonClicked(i + 1, 1);
                }
            }).appendTo(seasonBtnWrapper); 
        }  

    } else {
        $('<span>', {
            id: 'episodeHeader',
            class: 'chosenHeader filter',
            text: 'Episodes',
        }).appendTo(seasonBtnWrapper); 

        seasonClicked(1, 2);
    }
}

const seasonClicked = (seasonNum, type) => {

    const urlParams = new URLSearchParams(window.location.search);
    const value = Number(urlParams.get('value'));

    $('#seasonBackBtn').hide();

    if (type == 1) {
        $('<button>', {
            id: 'episodeBackBtn',
            text: 'Back',
            click: () => {
                $('#seasonBtnWrapper').hide();
                setTimeout(() => {
                    $('#seasonBtnWrapper').show(); 
                }, 500)
                $('.episodeBtn, #episodeBackBtn, .overviewWrapper').remove();
                $('.seasonBtn, #seasonBackBtn').show();
            }
        }).appendTo($('#seasonBtnWrapper')); 
    }

    $.get('https://api.themoviedb.org/3/tv/' + value + '/season/' + seasonNum + '?api_key=' + tmdbKey, (data) => {

        $('.seasonBtn').hide();

        if(data.overview !== null && data.overview !== '' && data.overview !== undefined) {
            showOverview(data.overview, 1);
        }

        for (let i = 0; i < data.episodes.length; i++) {
            $('<button>', {
                class: 'episodeBtn',
                text: (i + 1),
                click: () => {
                    $('#seasonBtnWrapper').hide();
                    setTimeout(() => {
                        $('#seasonBtnWrapper').show(); 
                    }, 500)
                    if (type == 1) {
                        episodeClicked(seasonNum, i + 1, 1); 
                    } else {
                        episodeClicked(seasonNum, i + 1, 2);
                    }
                    
                }
            }).appendTo($('#seasonBtnWrapper'));        
        }
    });
}

const showOverview = (text, type) => {

    let divToAppend;

    if (type == 1) {
        divToAppend = $('#tvShowSeasonsWrapper');
        $('#tvShowSeasonsWrapper').find($('.overviewWrapper')).remove();
    } else {
        divToAppend = $('#personOverviewWrapper');
    }

    let overviewWrapper = $('<div>', {
        class: 'overviewWrapper'
    }).appendTo(divToAppend);

    $('<p>', {
        class: 'overviewHeader filter',
        text: 'Overview'
    }).appendTo(overviewWrapper);

    let overview = $('<p>', {
        class: 'overviewText',
        text: text
    }).appendTo(overviewWrapper);

    $(overview).removeClass('longText');
    $(overviewWrapper).find($('.overviewArrowWrapper')).remove();

    if (text.length > 300) {
        $(overview).addClass('longText');

        let overviewArrowWrapper = $('<div>', {
            class: 'overviewArrowWrapper',
        }).appendTo(overview);

        $('<i>', {
            class: 'overviewArrow fas fa-angle-double-down pointer',
            click: function () {

                if ($(overview).hasClass('longText')) {
                    $(overview).removeClass('longText');
                    $(overviewArrowWrapper).addClass('turnArrow');
                } else {
                    $(overview).addClass('longText');
                    $(overviewArrowWrapper).removeClass('turnArrow');
                }
            }
        }).appendTo(overviewArrowWrapper);
    }
}

const episodeClicked = (seasonNum, episodeNum, type) => {

    $('#guestCast, #guestCastHeader').remove();

    const urlParams = new URLSearchParams(window.location.search);
    const value = Number(urlParams.get('value'));

    $.get('https://api.themoviedb.org/3/tv/' + value + '/season/' + seasonNum + '/episode/' + episodeNum + '?api_key=' + tmdbKey, (data) => {

        if(data.overview !== null && data.overview !== '' && data.overview !== undefined) {
            showOverview(data.overview, 1);
        }

        if (type == 1) {
            $('.seasonBtn, .episodeBtn, #seasonBackBtn, #episodeBackBtn').remove();
            $('#allSeasonsBtn').show();
        }

        if (data.guest_stars.length > 0) {
            if (data.guest_stars.length < 21) {
                finalLength = data.guest_stars.length;
            } else {
                finalLength = 21;
            }

            let guestCast = $('<div>', {
                id: 'guestCast',
                class: 'content'
            }).insertAfter($('#watchProviders'));

            $('<p>', {
                id: 'guestCastHeader',
                class: 'chosenHeader filter',
                text: 'Guest Cast'
            }).insertBefore(guestCast);

            for (let i = 0; i < finalLength; i++) {
                try {
                    let actorImgPath;

                    if (data.guest_stars[i].profile_path == 'undefined' || data.guest_stars[i].profile_path == null || data.guest_stars[i].profile_path == '') {

                        switch (data.guest_stars[i].gender) {
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
                        actorImgPath = 'https://image.tmdb.org/t/p/w1280' + data.guest_stars[i].profile_path;
                    }

                    let trimmedString;

                    if (data.guest_stars[i].character.length > 25) {
                        if (countInstances(data.guest_stars[i].character, '/') > 1) {
                            trimmedString = data.guest_stars[i].character.substr(0, 25);
                            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
                            trimmedString = data.guest_stars[i].character.split('/');

                            if (trimmedString.length > 2) {
                                trimmedString = trimmedString[0] + '/' + trimmedString[1] + '& More';
                            } else {
                                trimmedString = trimmedString[0] + '/' + trimmedString[1];
                            }
                        } else {
                            trimmedString = data.guest_stars[i].character;
                        }
                    } else {
                        trimmedString = data.guest_stars[i].character;
                    }

                    let actor = $('<div>', {
                        class: 'actor',
                    }).appendTo(guestCast);

                    $('<img>', {
                        class: 'actorImg hoverEffect lazy pointer filter',
                        'data-src': actorImgPath,
                        'src': './images/actor.jpg',
                        alt: 'actorImg',
                        id: data.guest_stars[i].id,
                        click: () => {
                            getPersonDetails(data.guest_stars[i].id, 1);
                        }
                    }).appendTo(actor);

                    let finalActorName;

                    if (data.guest_stars[i].character == '') {
                        finalActorName = data.guest_stars[i].name;
                    } else {
                        finalActorName = data.guest_stars[i].name + ':';
                    }

                    $('<span>', {
                        class: 'actorName filter',
                        text: finalActorName
                    }).appendTo(actor);

                    $('<span>', {
                        class: 'characterName filter',
                        text: trimmedString
                    }).appendTo(actor);

                    let actorLinksWrapper = $('<div>', {
                        class: 'linksWrapper',
                    }).appendTo(actor);

                    $.get(movieActorsUrl + data.guest_stars[i].id + "/external_ids?api_key=" + tmdbKey, (data) => {
                        if(data.imdb_id !== null) {
                            let imdbLinkWrapper = $('<a>', {
                                class: 'imdbLinkWrapper',
                                rel: 'noopener',
                                target: '_blank',
                                href: 'https://www.imdb.com/name/' + data.imdb_id
                            }).appendTo(actorLinksWrapper);
        
                            $('<img>', {
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
        
                            $('<img>', {
                                class: 'actorInstagramLink',
                                src: './images/instagram.png',
                                alt: 'instagramImg',
                            }).appendTo(instagramWrapper);
                        }

                        if(data.instagram_id == null && data.imdb_id !== null) {
                            $(actorLinksWrapper).find($('.imdbLinkWrapper')).css('margin-right', 0);
                        } else if(data.instagram_id !== null && data.imdb_id == null) {
                            $(actorLinksWrapper).find($('.instagramWrapper')).css('margin-left', 0);
                        }
                    });

                } catch (e) {
                    console.log(e);
                }

                checkLength(finalLength, '#castContent');
            }        
        }
    });
}

const getFinalUrl = (type) => {
    if (type == 1) {
        return movieInfoUrl;
    } else {
        return tvShowInfoUrl;
    }
}

const getPersonDetails = (value, type) => {

    emptyChosen(1, true);

    $.get(movieActorsUrl + value + "?api_key=" + tmdbKey + '&append_to_response=combined_credits,images,external_ids,tagged_images', (data) => {
        $('#chosenPersonName').html(data.name);

        if(data.biography !== null && data.biography !== '' && data.biography !== undefined) {

            $('<div>', {
                id: 'personOverviewWrapper',
            }).insertAfter($('#chosenPersonDetails'));

            showOverview(data.biography, 2);
        }

        refreshUrl(value, data.name, 1, type, null);

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

            $('<img>', {
                id: 'chosenPersonImg',
                class: 'filter',
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

        getPersonCredits(data.combined_credits, type);
        if (type == 2) {
            getPersonCredits(data.combined_credits, type + 1);
        }
        getPersonExternalIds(data.external_ids);
        getPersonImages(data.images);
        getPersonMovieImages(data.tagged_images);

    });
}

const getPersonCredits = (data, type) => {
    $('#personMovies').empty();
    $('#personCreditsHeader').remove();
    let finalData;

    if (type == 1) {
        finalData = data.cast;
    } else {
        finalData = data.crew;
    }

    if (finalData.length !== 0) {
        if (type !== 3) {
            $('<p>', {
                id: 'personCreditsHeader',
                class: 'chosenHeader filter',
                text: 'Credits',
            }).insertBefore($('#personMovies'));
        }

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

                    $('<img>', {
                        class: 'actorImg hoverEffect pointer lazy filter',
                        'data-src': movieImgPath,
                        'src': './images/stock.png',
                        alt: 'actorMovieImg',
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

                    let actorMovieClass;

                    if (/[\u0590-\u05FF]/.test(finalTitle)) {
                        actorMovieClass = 'actorMovieName filter rtl';
                    } else {
                        actorMovieClass = 'actorMovieName filter';
                    }

                    $('<span>', {
                        class: actorMovieClass,
                        text: finalTitle
                    }).appendTo(credit);

                    $('<span>', {
                        class: 'characterName filter',
                        text: trimmedString
                    }).appendTo(credit);
                }

                if (finalData[i].job == 'Director' && type == 2 || finalData[i].department == 'Writing' && type == 3) {
                    if (finalData[i].job !== 'Novel' && finalData[i].job !== 'Teleplay' && finalData[i].job !== 'Story') {

                        let credit = $('<div>', {
                            class: 'credit',
                            popularity: finalData[i].popularity
                        }).appendTo($('#personMovies'));
    
                        let imageLink = $('<a>', {
                            class: 'imageLink',
                            'target': '_blank'
                        }).appendTo(credit);
    
                        $('<img>', {
                            class: 'actorImg hoverEffect pointer lazy filter',
                            'data-src': movieImgPath,
                            'src': './images/stock.png',
                            alt: 'actorMovieImg',
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

                        let directorMovieClass;

                        if (/[\u0590-\u05FF]/.test(finalTitle)) {
                            directorMovieClass = 'actorMovieName filter rtl';
                        } else {
                            directorMovieClass = 'actorMovieName filter';
                        }
    
                        $('<span>', {
                            class: directorMovieClass,
                            text: finalTitle
                        }).appendTo(credit);

                        $('<span>', {
                            class: 'characterName filter',
                            text: finalData[i].job
                        }).appendTo(credit);
                    }        
                }

            } catch (e) {
                console.log(e);
            }

            setTimeout(() => {
                sortPopularMovies($('#personMovies'), 'popularity', 3);
            }, 500);
        }

        checkLength(finalData.length, '#personMovies');
    }
}

const getPersonImages = (data) => {
    $('#personImages').empty();
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

            $('<img>', {
                class: 'personPoster lazy filter',
                src: './images/stock.png',
                'data-src': finalImg,
                alt: 'person poster',
            }).appendTo($('#personImages'));
        }
    }
}

const getPersonMovieImages = (data) => {
    $('#personMovieImages').empty();

    if (data.results.length > 0) {
        let finalLength;

        if (data.results.length > 10) {
            finalLength = 10;
        } else {
            finalLength = data.results.length;
        }

        let personMovieArr = [];

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

            if (!personMovieArr.includes(finalImg)) {
                personMovieArr.push(finalImg);
                $('<img>', {
                    class: 'personMovieImg lazy filter',
                    src: './images/stockMovie.jpg',
                    'data-src': finalImg,
                    alt: 'person tagged img',
                }).appendTo($('#personMovieImages'));
            }
        }
    }

    setTimeout(() => {
        $('#spinnerWrapper').hide();
        $('#chosenPerson').show();
        $('footer, #menuOpenWrapper, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});

        $('#breadcrumbs').show();
        $('#logo').css('pointerEvents', 'all');
        $('#typeOfContent').attr('class', 'fas fa-user-alt');
        $('#contentPoster').css('background', '').hide();
    }, 1500)
}

const getPersonExternalIds = (data) => {
    if(data.instagram_id !== null) {                               
        let personInstagramLink = $('<a>', {
            id: 'personInstagramLink',
            rel: 'noopener',
            target: '_blank',
            href: 'https://www.instagram.com/' + data.instagram_id
        }).appendTo($('#personInstagramWrapper'));

        $('<img>', {
            id: 'personInstagramImg',
            class: 'filter',
            src: './images/instagram.png',
            alt: 'instagramImg',
        }).appendTo(personInstagramLink);
    }

    if(data.instagram_id == null && data.imdb_id !== null) {
        $('#personInstagramWrapper').find($('.imdbLinkWrapper')).css('margin-right', 0);
    } else if(data.instagram_id !== null && data.imdb_id == null) {
        $('#personInstagramWrapper').find($('.instagramWrapper')).css('margin-left', 0);
    }
}

const getPopular = () => {
    if ($("#popularContent").text().length > 0) {
        return;
    }

    if ($('#chosenMovie').is(':visible') || $('#chosenPerson').is(':visible') || $('#timeline').is(':visible')) {
        goToDiv('#popular');
    }

    $('.container').hide();
    emptyContainers();
    emptyChosen(1);

    let totalPages;
    let arr = [];

    $.get(movieActorsUrl + "popular?api_key=" + tmdbKey, (data) => {
        for (let  i = 0; i < data.results.length; i++) {
            arr.push(data.results[i]);
        }

        totalPages = data.total_pages;

        if (totalPages > 1) {
            setTimeout(() => {
                $.get(movieActorsUrl + "popular?api_key=" + tmdbKey + '&page=2', (data) => {
                    for (let  j = 0; j < data.results.length; j++) {
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
    .done(() => {
        setTimeout(() => {
            $('#spinnerWrapper').hide();
            $('main, footer, #menuOpenWrapper, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
        }, 1500)
    })
    .fail(() => {
        setTimeout(() => {
            $('#spinnerWrapper').hide();
            $('main, footer, #menuOpenWrapper, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
        }, 1500)
    })
}

const buildPopular = (arr) => {

    if (!$('#breadcrumbs').is(':visible')) {
        $('#breadcrumbs').show();
    }

    $('#logo').css('pointerEvents', 'all');
    $('#typeOfContent').attr('class', 'fas fa-star');
    $('#contentPoster').css('background', '').hide();

    $('<h2>', {
        class: 'popularHeader',
        text: 'Popular People'
    }).appendTo($('#popular'));

    let headerLine = $('<div>', {
        class: 'line linePopular',
    }).appendTo($('#popular'));

    $('<span>', {
        class: 'headerLogo',
    }).appendTo(headerLine);

    let popularContent = $('<div>', {
        id: 'popularContent',
    }).appendTo($('#popular'));

    for (let i = 0; i < arr.length; i++) {
        let popularPerson = $('<div>', {
            class: 'popularPerson hoverEffect pointer',
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

        $('<img>', {
            class: finalClass,
            alt: 'popular person',
            'src': finalSrc,
            'data-src': dataSrc,
            click: () => {
                $('#search').val('');
                $('main').hide();
                getPersonDetails(arr[i].id, 1);
            }
        }).appendTo(popularPerson)

        $('<p>', {
            class: 'name',
            text: arr[i].name
        }).appendTo(popularPerson)
    }

    setTimeout(() => {
        sortPopularMovies($('#popularContent'), 'popularity', 4);
    }, 500);
}

const showMiscellaneous = () => {

    if ($('#miscellaneousList').is(':visible')) {
        $('#miscellaneousRow').css('border-bottom', 'none');
        $('#miscellaneousList').fadeOut(100);
    } else {
        if(lightMode) {
            $('#miscellaneousRow').css('border-bottom', '1px solid black');
        } else {
            $('#miscellaneousRow').css('border-bottom', '1px solid #ff7b00');
        }
        
        $('#miscellaneousList').fadeIn(100);
    }

    setTimeout(() => {
        $('#toggle').addClass('on');
    }, 0)
}

const goToDiv = (div) => {

    $('#breadcrumbs').hide();
    $('#typeOfContent').attr('class', '');
    $('#contentPoster').css('background', '').hide();
    $('#logo').css('pointerEvents', 'none');
    $('.searchContainer').show();

    if (!$('#marvelContainer').is(':visible')) {
        $('.container').css('display', 'flex');
        emptyChosen(2);
        setTimeout(() => {
            $('#spinnerWrapper').hide();
            $('main, #chosenMovie, footer, #menuOpenWrapper, #chosenPerson, .searchContainer').css({'pointer-events': 'all', 'opacity': 1});
        }, 2000)
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

    $('#miscellaneousList').hide();
    $('#miscellaneousRow').css('border-bottom', 'none');
}

const getCinematicInfo = (url, type, showPopup) => {
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

        if (showPopup) {
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
    
                $('<img>', {
                    id: 'nextCinematicImg',
                    class: 'pointer',
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
        }
    }).done(() => {
        if (!showPopup) {
            setTimeout(() => {
                showTimeline(1, type);
                $('footer').css({'pointer-events': 'all', 'opacity': 1});
                $('#spinnerWrapper').hide();
            }, 1500) 
        }

    }).fail(() => {
        if (!showPopup) {
            setTimeout(() => {
                $('footer').css({'pointer-events': 'all', 'opacity': 1});
                $('#spinnerWrapper').hide();
            }, 1500) 
        }
    })
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
            $('main, #menuOpenWrapper, #goToTopBtn').css({'pointer-events': 'all', 'opacity': '1'});
            $('.popUpInfo').css({'pointer-events': 'all', 'opacity': '1'});
            $('#spinnerWrapper').hide(); 
            $('footer').css({'pointer-events': 'all', 'opacity': '1'});
        }, 0)   
    })
}

const showTimeline = (type, cinematicType) => {

    $('#breadcrumbs').show();
    $('#logo').css('pointerEvents', 'all');
    $('.searchContainer').hide();
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

        $('#typeOfContent').attr('class', 'fas fa-stopwatch');

        $('#contentPoster').css('background', '').hide();
        
        for (let i = 0; i < cinematicArr.length; i++) {
            let timelineMovieWrapper = $('<div>', {
                class: 'timelineMovieWrapper'
            }).appendTo($('#timelineContent'))
    
            $('<p>', {
                class: 'timelineMovieName',
                text: capitalize(cinematicArr[i].name)
            }).appendTo(timelineMovieWrapper)
    
            let finalImg = cinematicArr[i].background;
    
            if (finalImg == null) {
                if (cinematicArr[i].poster == null) {
                    finalImg = './images/stockMovie.jpg';
                } else {
                    finalImg = 'https://image.tmdb.org/t/p/w1280' + cinematicArr[i].poster;
                }
            } else {
                finalImg = 'https://image.tmdb.org/t/p/w1280' + cinematicArr[i].background;
            }
    
            $('<img>', {
                class: 'timelineMovieImg hoverEffect background pointer',
                src: finalImg,
                alt: 'movie img',
                click: () => {
                    $('#timeline').hide();
                    window.history.replaceState({}, document.title, "/" + "my-movie-list/");
                    chosenMovie(cinematicArr[i].id, 1);
                }
            }).appendTo(timelineMovieWrapper)

            $('<p>', {
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

        $('#typeOfContent').attr('class', 'fas fa-tv');

        $('#contentPoster').css('background', '').hide();

        for (let i = 0; i < tvShowTimelineArr.length; i++) {
            let timelineMovieWrapper = $('<div>', {
                class: 'timelineMovieWrapper'
            }).appendTo($('#timelineContent'))
    
            $('<p>', {
                class: 'timelineMovieName',
                text: tvShowTimelineArr[i].name
            }).appendTo(timelineMovieWrapper)
    
            let finalImg = tvShowTimelineArr[i].background;
    
            if (finalImg == null) {
                if (tvShowTimelineArr[i].poster == null) {
                    finalImg = './images/stockMovie.jpg';
                } else {
                    finalImg = 'https://image.tmdb.org/t/p/w1280' + tvShowTimelineArr[i].poster;
                }
            } else {
                finalImg = 'https://image.tmdb.org/t/p/w1280' + tvShowTimelineArr[i].background;
            }
    
            $('<img>', {
                class: 'timelineMovieImg hoverEffect background pointer',
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

            $('<p>', {
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

const sortByName = (container, type) => {

    if ($(container).attr('dateCounter') == '2') {
        $(container).attr('dateCounter', '1');
    }

    if ($(container).attr('isSorted') == 'false') {
        $(container).attr('isSorted', 'true');
    }

    let children;
    let ids = [], obj, i, len;

    if(type == 1){
        children = $(container).find('.movieWrapper');
    } else {
        children = $(container).find('.trendingWrapper');
    }

    for (i = 0, len = children.length; i < len; i++) { 
        obj = {};
        obj.element = children[i];
        let elem2 = $(children[i]).find($('.name')).html();
        obj.idNum = elem2;
        ids.push(obj);
    }

    if ($(container).attr('nameCounter') == '1') {   
        ids.sort(function (a, b) { 

            if(a.idNum < b.idNum) { 
                return -1; 
            }
            if(a.idNum > b.idNum) {
                return 1; 
            }
            
            return 0;  
        });

        $(container).attr('nameCounter', '2');
        $(container).find($('.sortNameBtn ').attr('class', 'sortNameBtn fas fa-sort-alpha-down-alt pointer'));

    } else {
        ids.sort(function (a, b) { 

            if(b.idNum < a.idNum) { 
                return -1; 
            }
            if(b.idNum > a.idNum) {
                return 1; 
            }
            return 0;    
        });

        $(container).attr('nameCounter', '1');
        $(container).find($('.sortNameBtn ').attr('class', 'sortNameBtn fas fa-sort-alpha-up pointer'));
    }

    for (i = 0; i < ids.length; i++) {
        $(container).append(ids[i].element);
    }
}

const sortByDate = (container, type) => {

    if ($(container).attr('nameCounter') == '2') {
        $(container).attr('nameCounter', '1');
        $(container).find($('.sortNameBtn ').attr('class', 'sortNameBtn fas fa-sort-alpha-up pointer'));
    }

    if ($(container).attr('isSorted') == 'false') {
        $(container).attr('isSorted', 'true');
    }

    let children;

    if(type == 1) {
        children = $(container).find('.movieWrapper');
    } else {
        children = $(container).find('.trendingWrapper');
    }
    let ids = [], obj, i, len;

    for (i = 0, len = children.length; i < len; i++) {
        obj = {};
        obj.element = children[i];
        let elem2 = $(children[i]).attr('date');
        obj.idNum = new Date(elem2);
        ids.push(obj);
    }

    if ($(container).attr('dateCounter') == '1') {
        
        ids.sort(function (a, b) { 

            if(a.idNum < b.idNum) { 
                return -1; 
            }
            if(a.idNum > b.idNum) {
                return 1; 
            }
            
            return 0;    
        });

        $(container).attr('dateCounter', '2');

    } else {
        ids.sort(function (a, b) { 

            if(b.idNum < a.idNum) { 
                return -1; 
            }
            if(b.idNum > a.idNum) {
                return 1; 
            }
            return 0;    
        });

        $(container).attr('dateCounter', '1');
    }

    for (i = 0; i < ids.length; i++) {
        $(container).append(ids[i].element);
    }
}

const sortByOrder = (container) => {

    $(container).attr({'nameCounter': '1', 'dateCounter': '1'});
    $(container).find($('.sortNameBtn ').attr('class', 'sortNameBtn fas fa-sort-alpha-up pointer'));

    let children;

    let ids = [], obj, i, len;

    children = $(container).find('.movieWrapper');

    for (i = 0, len = children.length; i < len; i++) { 
        obj = {};
        obj.element = children[i];
        let elem2 = $(children[i]).attr('order');
        obj.idNum = elem2;
        ids.push(obj);
    }

    ids.sort(function (a, b) { return (a.idNum - b.idNum); });

    for (i = 0; i < ids.length; i++) {
        $(container).append(ids[i].element);
    }
}
