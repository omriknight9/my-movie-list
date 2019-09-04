
var marvelMovies = [];
var dcMovies = [];
var otherMovies = [];
var animationMovies = [];
var tvShows = [];
var type;
var counter = 1;

$(document).ready(function (event) {
    loadJson();

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }

    window.onscroll = function () {
        scrollBtn();
        if (this.oldScroll > this.scrollY) {
            $('.header').css('margin-top', 0);
        } else {
            $('.header').css('margin-top', '-100rem');
        }
        this.oldScroll = this.scrollY;
    }

    $('.Xbtn').click(function () {
        $(this).parent().parent().hide();
        $('#trailerVideo').attr('src', '');
    })

    setTimeout(function () {
        $('.spinnerWrapper').hide();
        $('.searchContainer').show();
        $('button').show();
        $('#marvelContainer').css('display', 'flex');
        $('#dcContainer').css('display', 'flex');
        $('#othersContainer').css('display', 'flex');
        $('#animationContainer').css('display', 'flex');
        $('#tvShowContainer').css('display', 'flex');
        
    }, 1500);

    $('#search').on('input', function () {
        window.scrollTo(0, 0);
        $.each($('.movieWrapper'), function (key, value) {

            for (var i = 0; i < $(this).length; i++) {
                var movieName = $($(this)[i]).attr('name').toLowerCase();
                var searchVal = $('#search').val();
                var searchValCapitalized = searchVal.charAt(0).toUpperCase() + searchVal.slice(1);

                if (movieName.includes(searchValCapitalized) || movieName.includes(searchValCapitalized.toLowerCase())) {
                    $($(this)[i]).show();
                } else {
                    $($(this)[i]).hide();
                }
            }
        });
    })
});

function loadJson() {
    $.get('./lists/marvel.txt', function (data) {
        marvelMovies.push(JSON.parse(data));
        setTimeout(function () {
            buildMovies('marvelMovie', $('#marvelContainer'), marvelMovies, 1);
        }, 500);
    });

    $.get('./lists/dc.txt', function (data) {
        dcMovies.push(JSON.parse(data));
        setTimeout(function () {
            buildMovies('dcMovie', $('#dcContainer'), dcMovies, 2);
        }, 500);
    });

    $.get('./lists/others.txt', function (data) {
        otherMovies.push(JSON.parse(data));
        setTimeout(function () {
            buildMovies('otherMovie', $('#othersContainer'), otherMovies, 3);
        }, 500);
    });

    $.get('./lists/animation.txt', function (data) {
        animationMovies.push(JSON.parse(data));
        setTimeout(function () {
            buildMovies('animationMovie', $('#animationContainer'), animationMovies, 4);
        }, 500);
    });

    $.get('./lists/tvShows.txt', function (data) {
        tvShows.push(JSON.parse(data));
        setTimeout(function () {
            buildTvShow('tvShow', $('#tvShowContainer'), tvShows);
        }, 500);
    });
}

function goToDiv(div) {
    if ($(window).width() > 550) {
        $('html, body').animate({ scrollTop: $(div).position().top }, 'slow');
    } else {
        $('html, body').animate({ scrollTop: $(div).position().top }, 'slow');
    }
    setTimeout(function () {
        $('.header').css('margin-top', '-100rem');
    }, 700);
}

function buildMovies(div, wrapper, arr, type) {
    $('#trailerVideo').attr('src', '');

    var movies = arr[0].movies;
    //var headerText;

    switch (type) {
        case 1:
            var typeheader = $('<h2>', {
                class: 'typeheader',
                text: 'Marvel'
            }).appendTo(wrapper);

            headerText = 'Marvel';
            var btnWrapper = $('<div>', {
                class: 'btnWrapper',
            }).appendTo(wrapper);

            var dateSortBtn = $('<button>', {
                class: 'marvelBtn',
                text: 'Sort By Date',
                click: function () {
                    sortMovies($('#marvelContainer'), 'date', 1);
                }
            }).appendTo(btnWrapper);

            var nameSortBtn = $('<button>', {
                class: 'marvelBtn',
                text: 'Sort By Name',
                click: function () {
                    sortMovies($('#marvelContainer'), 'name', 2);
                }
            }).appendTo(btnWrapper);

            var groupSortBtn = $('<button>', {
                class: 'marvelBtn',
                text: 'Sort By Group',
                click: function () {
                    sortMovies($('#marvelContainer'), 'group', 3);
                }
            }).appendTo(btnWrapper);

            var MCUOnlyBtn = $('<button>', {
                class: 'marvelBtn',
                id: 'btnMCU',
                text: 'MCU Only',
                click: function () {
                    showCinematicUniverse($('.marvelMovie'), 'mcu');
                }
            }).appendTo(btnWrapper);

            var NonMCUBtn = $('<button>', {
                class: 'marvelBtn',
                id: 'btnNonMCU',
                text: 'NON MCU Only',
                click: function () {
                    hideCinematicUniverse($('.marvelMovie'), 'mcu');
                }
            }).appendTo(btnWrapper);

            var allMarvelBtn = $('<button>', {
                class: 'marvelBtn',
                id: 'btnAllMarvel',
                text: 'All Marvel',
                click: function () {
                    allOfKind($('.marvelMovie'));
                }
            }).appendTo(btnWrapper);
            break;
        case 2:
            var typeheader = $('<h2>', {
                class: 'typeheader',
                text: 'DC'
            }).appendTo(wrapper);

            var btnWrapper = $('<div>', {
                class: 'btnWrapper',
            }).appendTo(wrapper);

            var dateSortBtn = $('<button>', {
                class: 'dcBtn',
                text: 'Sort By Date',
                click: function () {
                    sortMovies($('#dcContainer'), 'date', 1);
                }
            }).appendTo(btnWrapper);

            var nameSortBtn = $('<button>', {
                class: 'dcBtn',
                text: 'Sort By Name',
                click: function () {
                    sortMovies($('#dcContainer'), 'name', 2);
                }
            }).appendTo(btnWrapper);

            var groupSortBtn = $('<button>', {
                class: 'dcBtn',
                text: 'Sort By Group',
                click: function () {
                    sortMovies($('#dcContainer'), 'group', 3);
                }
            }).appendTo(btnWrapper);

            var DCEUOnlyBtn = $('<button>', {
                class: 'dcBtn',
                id: 'btnDCEU',
                text: 'DCEU Only',
                click: function () {
                    showCinematicUniverse($('.dcMovie'), 'dceu');
                }
            }).appendTo(btnWrapper);

            var NonDCEUBtn = $('<button>', {
                class: 'dcBtn',
                id: 'btnNonDCEU',
                text: 'NON DCEU Only',
                click: function () {
                    hideCinematicUniverse($('.dcMovie'), 'dceu');
                }
            }).appendTo(btnWrapper);

            var allDCBtn = $('<button>', {
                class: 'dcBtn',
                id: 'btnAllDC',
                text: 'All DC',
                click: function () {
                    allOfKind($('.dcMovie'));
                }
            }).appendTo(btnWrapper);
            break;
        case 3:
            var typeheader = $('<h2>', {
                class: 'typeheader',
                text: 'Others'
            }).appendTo(wrapper);

            var btnWrapper = $('<div>', {
                class: 'btnWrapper',
            }).appendTo(wrapper);

            var dateSortBtn = $('<button>', {
                class: 'othersBtn',
                text: 'Sort By Date',
                click: function () {
                    sortMovies($('#othersContainer'), 'date', 1);
                }
            }).appendTo(btnWrapper);

            var nameSortBtn = $('<button>', {
                class: 'othersBtn',
                text: 'Sort By Name',
                click: function () {
                    sortMovies($('#othersContainer'), 'name', 2);
                }
            }).appendTo(btnWrapper);

            var groupSortBtn = $('<button>', {
                class: 'othersBtn',
                text: 'Sort By Group',
                click: function () {
                    sortMovies($('#othersContainer'), 'group', 3);
                }
            }).appendTo(btnWrapper);
            break;
        case 4:
            var typeheader = $('<h2>', {
                class: 'typeheader',
                text: 'Animations'
            }).appendTo(wrapper);

            var btnWrapper = $('<div>', {
                class: 'btnWrapper',
            }).appendTo(wrapper);

            var dateSortBtn = $('<button>', {
                class: 'animationBtn',
                text: 'Sort By Date',
                click: function () {
                    sortMovies($('#animationContainer'), 'date', 1);
                }
            }).appendTo(btnWrapper);

            var nameSortBtn = $('<button>', {
                class: 'animationBtn',
                text: 'Sort By Name',
                click: function () {
                    sortMovies($('#animationContainer'), 'name', 2);
                }
            }).appendTo(btnWrapper);

            var groupSortBtn = $('<button>', {
                class: 'animationBtn',
                text: 'Sort By Group',
                click: function () {
                    sortMovies($('#animationContainer'), 'group', 3);
                }
            }).appendTo(btnWrapper);
            break;
    }
    
    for (var i = 0; i < movies.length; i++) {

        var groupStr = JSON.stringify(movies[i].group);

        var groupWrapper;

        if ($(groupWrapper).hasClass("group" + groupStr)) {

        } else {
            groupWrapper = $('<div>', {
                class: "group" + groupStr + ' groupWrapper'
            }).appendTo(wrapper);

            if (groupStr % 2 == 0) {
                $(groupWrapper).addClass('evenGroup');
            } else {
                $(groupWrapper).addClass('oddGroup');
            }
        }

        var movieType = movies[i].group;

        var movieWrapper = $('<div>', {
            class: 'movieWrapper ' + div,
            'name': movies[i].name,
            'movieId': movieType,
            'quality': movies[i].quality,
            'imdbId': movies[i].imdbId,
            'revenue': movies[i].revenue,
            'runtime': movies[i].runtime,
            'trailer': movies[i].trailer,
            'date': movies[i].date,
            'mcu': movies[i].mcu,
            'dceu': movies[i].dceu,
            click: function () {
                if ($(this).attr('revenue') == undefined || $(this).attr('revenue') == 'Unknown') {
                    $('.movieRevenuePop').hide();
                } else {
                    $('.movieRevenuePop').html('Revenue: $' + $(this).attr('revenue'));
                    $('.movieRevenuePop').show();
                }
                
                $('#movieCover').attr('src', $(this).find('.movieImg').attr('src'));
                $('.movieRuntimePop').html('Runtime: ' + convertMinsToHrsMins($(this).attr('runtime')));
                $('.movieNamePop').html($(this).attr('name'));
                $('.movieQualityPop').html('Quality: ' + $(this).attr('quality'));
                $('#movieImdbLink').attr('href', 'https://www.imdb.com/title/' + $(this).attr('imdbId'));
                $('#trailerVideo').attr('src', 'https://www.youtube.com/embed/' + $(this).attr('trailer'));
                $('#movieDetails').show();

                console.log($(this).parent().parent());
                switch ($(this).parent().parent().attr('id')) {
                    case 'marvelContainer':
                        $('.popupBtn').css('background-color', '#e62429');
                        break;
                    case 'dcContainer':
                        $('.popupBtn').css('background-color', '#0282f9');
                        break;
                    case 'othersContainer':
                        $('.popupBtn').css('background-color', 'rgba(100, 100, 255, .9)');
                        break;
                    case 'animationContainer':
                        $('.popupBtn').css('background-color', 'rgba(100, 200, 100, .9)');
                        break;
                }

                $('#movieYoutubeImage').click(function () {
                    $('#movieDetails').hide();
                    $('#trailer').show();
                    setTimeout(function () {
                        $('#trailerVideo').attr('src', $('#trailerVideo').attr('src').replace('?autoplay=1&amp;rel=0&enablejsapi=1', ''));
                        $('#trailerVideo').attr('src', $('#trailerVideo').attr('src') + '?autoplay=1&amp;rel=0&enablejsapi=1');
                    }, 500)
                })
            }
        }).appendTo(groupWrapper);

        var newDate = new Date(movies[i].date);

        var movieName = $('<p>', {
            class: div + 'Name',
            text: movies[i].name
        }).appendTo(movieWrapper);

        var movieYear = $('<p>', {
            class: div + 'Year',
            text: 'Year: ' + newDate.getFullYear()
        }).appendTo(movieWrapper);

        var movieDate = $('<p>', {
            class: div + 'Date',
            text: 'Release Date: ' + movies[i].dateText
        }).appendTo(movieWrapper);

        var movieImgWrapper = $('<div>', {
            class: 'movieImgWrapper',
        }).appendTo(movieWrapper);

        var movieImg = $('<img>', {
            class: 'movieImg',
            alt: 'movieImg',
            src: './images/movies/' + movies[i].image
        }).appendTo(movieImgWrapper);

        if (movies[i].group % 2 == 0) {
            switch (movieWrapper.attr('class')) {
                case 'movieWrapper marvelMovie':
                    $(movieWrapper).css('background-color', 'lightblue');
                    break;
                case 'movieWrapper dcMovie':
                    $(movieWrapper).css({'background-color': '#e62429', 'color': 'white' });
                    break;
                case 'movieWrapper otherMovie':
                    $(movieWrapper).css({ 'background-color': 'crimson', 'color': 'white' });
                    break;
                case 'movieWrapper animationMovie':
                    $(movieWrapper).css('background-color', 'silver');
                    break;
            }
        } else {
            switch (movieWrapper.attr('class')) {
                case 'movieWrapper marvelMovie':
                    $(movieWrapper).css('background-color', 'orange');
                    break;
                case 'movieWrapper dcMovie':
                    $(movieWrapper).css('background-color', 'lightgreen');
                    break;
                case 'movieWrapper otherMovie':
                    $(movieWrapper).css('background-color', 'aqua');
                    break;
                case 'movieWrapper animationMovie':
                    $(movieWrapper).css({'background-color': 'purple', 'color': 'white'});
                    break;
            }
        }
    }
}

function buildTvShow(div, wrapper, arr) {
    $('#trailerVideo').attr('src', '');

    var tvShows = arr[0].tvShows;

    var typeheader = $('<h2>', {
        class: 'typeheader',
        text: 'TV Shows'
    }).appendTo(wrapper);

    for (var i = 0; i < tvShows.length; i++) {
        var tvShowType = tvShows[i].group;

        var tvShowWrapper = $('<div>', {
            class: 'tvShowWrapper ' + div,
            'year': tvShows[i].year,
            'name': tvShows[i].name,
            'movieId': tvShowType,
            'quality': tvShows[i].quality,
            'imdbId': tvShows[i].imdbId,
            'seasons': tvShows[i].seasons,
            'episodes': tvShows[i].episodes,
            'trailer': tvShows[i].trailer,

            click: function () {
                $('#tvShowCover').attr('src', $(this).find('.tvShowImg').attr('src'));
                $('.tvShowSeasonsPop').html('Seasons: ' + $(this).attr('seasons'));
                $('.tvShowEpisodesPop').html('Episodes: ' + $(this).attr('episodes'));
                $('.tvShowNamePop').html($(this).attr('name'));
                $('.tvShowQualityPop').html('Quality: ' + $(this).attr('quality'));
                $('#tvShowImdbLink').attr('href', 'https://www.imdb.com/title/' + $(this).attr('imdbId'));
                $('#trailerVideo').attr('src', 'https://www.youtube.com/embed/' + $(this).attr('trailer'));
                $('#tvShowDetails').show();
                $('.popupBtn').css('background-color', '#D67B6E');

                $('#tvShowYoutubeImage').click(function () {
                    $('#tvShowDetails').hide();
                    $('#trailer').show();
                    setTimeout(function () {
                        $('#trailerVideo').attr('src', $('#trailerVideo').attr('src').replace('?autoplay=1&amp;rel=0&enablejsapi=1', ''));
                        $('#trailerVideo').attr('src', $('#trailerVideo').attr('src') + '?autoplay=1&amp;rel=0&enablejsapi=1');
                    }, 500)
                })
            }
        }).appendTo(wrapper);

        var tvShowName = $('<p>', {
            class: div + 'Name',
            text: tvShows[i].name
        }).appendTo(tvShowWrapper);

        var tvShowYear = $('<p>', {
            class: div + 'Year',
            text: 'Year: ' + tvShows[i].year
        }).appendTo(tvShowWrapper);

        var tvShowImgWrapper = $('<div>', {
            class: 'tvShowImgWrapper',
        }).appendTo(tvShowWrapper);

        var tvShowImg = $('<img>', {
            class: 'tvShowImg',
            alt: 'tvShowImg',
            src: './images/' + tvShows[i].image
        }).appendTo(tvShowImgWrapper);

        if (tvShows[i].group % 2 == 0) {

            $(tvShowWrapper).css('background-color', 'lightblue');
        } else {
            $(tvShowWrapper).css('background-color', 'lightgreen');
        }
    }
}

function showCinematicUniverse(div, elem) {
    for (var i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
        if ($($(div)[i]).attr(elem) == 'false') {
            $($(div)[i]).hide();
        }
    }
}

function hideCinematicUniverse(div, elem) {
    for (var i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
        if ($($(div)[i]).attr(elem) == 'true') {
            $($(div)[i]).hide();
        }
    }
}

function allOfKind(div) {
    for (var i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
    }
}

function goToTop() {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
    $('.goToTopBtn').animate({ bottom: '50rem' });
    setTimeout(function () {
        $('.goToTopBtn').css('bottom', '4rem');
    }, 1000)
}

function scrollBtn() {

    if ($(this).scrollTop() > 550) {
        $('.goToTopBtn').fadeIn();
    }
    else {
        $('.goToTopBtn').fadeOut();
    }
}

function sortMovies(container, elem1, kind) {

    $('.groupWrapper').removeClass('oddGroup');
    $('.groupWrapper').removeClass('evenGroup');

    var btnWrapper = $(container).find($('.btnWrapper'));

    if ($(btnWrapper).attr('kind') == kind) {
    } else {
        $(btnWrapper).attr('kind', kind);
        counter = 1;
    }

    if (kind == 3) {
        $('#marvelContainer').empty();
        $('#dcContainer').empty();
        $('#othersContainer').empty();
        $('#animationContainer').empty();
        $('#tvShowContainer').empty();
    }

    var children;
    $.each($(container), function (key, value) {
        var ids = [], obj, i, len;

        if ($(container).attr('id') == 'tvShowContainer') {
            children = $(this).find('.tvShowWrapper');
        } else {
            children = $(this).find('.movieWrapper');
        }

        for (i = 0, len = children.length; i < len; i++) {
            obj = {};
            obj.element = children[i];
            var elem2 = $(children[i]).attr(elem1);
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
                        ids.sort(function (a, b) { return (a.idNum - b.idNum); });
                        counter = 2;
                        break;
                    case 2:
                        ids.sort(function (a, b) { return (b.idNum - a.idNum); });
                        counter = 1;
                        break;
                }
                $(btnWrapper).attr('kind', kind);
                $('.groupSortBtn').css('pointer-events', 'all');
                break;
            case 2:
                switch (counter) {
                    case 1:
                        ids.sort(function (a, b) {
                            if (a.idNum > b.idNum) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });

                        counter = 2;
                        break;

                    case 2:
                        ids.sort(function (a, b) {
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
                $('.groupSortBtn').css('pointer-events', 'all');
                break;
            case 3:
                $('.spinnerWrapper').show();
                $('.groupSortBtn').css('pointer-events', 'none');
                switch ($(container).attr('id')) {
                    case 'marvelContainer':
                        setTimeout(function () {
                            $('#marvel').click();
                        }, 1200)
                        break;
                    case 'dcContainer':
                        setTimeout(function () {
                            $('#dc').click();
                        }, 1200)
                        break;
                    case 'othersContainer':
                        setTimeout(function () {
                            $('#others').click();
                        }, 1200)

                        break;
                    case 'animationContainer':
                        setTimeout(function () {
                            $('#disney').click();
                        }, 1200)

                        break;
                }
                loadJson();
                setTimeout(function () {
                    $('.spinnerWrapper').hide();
                }, 500);
                break;
        }

        for (i = 0; i < ids.length; i++) {
            $(this).append(ids[i].element);
        }
    });
}

function removePopup(container) {

    $(document).mouseup(function (e) {
        if (container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
            e.stopPropagation();
            $(document).off('mouseup');
        }
    })
}

function closeCurrentPopup(that) {
    $($(that)[0].parentElement.parentElement.parentElement).hide();
}

function convertMinsToHrsMins(mins) {
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
