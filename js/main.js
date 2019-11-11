
let marvelMovies = [];
let dcMovies = [];
let otherMovies = [];
let animationMovies = [];
let tvShows = [];
let cinematicType;
let counter = 1;
let marvelCinematicCounter = 1;
let dcCinematicCounter = 1;

let marvelCounter = 1;
let DCCounter = 1;
let OthersCounter = 1;
let animationCounter = 1;

let selectedDiv;
let lastChar;
let searchVal;

$(document).ready(function (event) {

    loadJson();

    setTimeout(function(){
        $.each($('.movieWrapper'), function (key, value) {
            let thisMovieName = $(value).find($('.name')).html();
            let thisMovieImg = $(value).find($('.movieImg')).attr('src');

            let that = $(this);
            if (thisMovieName === localStorage.getItem(thisMovieName)) {
                $($(that).find($('.star')).attr('src', '../images/star.png'));
                let favoriteWrapper = $('<div>', {
                    class: 'favoriteWrapper',
                    click: function() {
                        goToFavoriteMovie(thisMovieName);
                    }
                }).appendTo($('#favorites #favoritesGallery'));

                let favoriteNamePop = $('<p>', {
                    text: thisMovieName,
                    class: 'favoritesGalleryImgName'
                }).appendTo(favoriteWrapper);

                let favoriteiImgPop = $('<img>', {
                    src: thisMovieImg,
                    class: 'favoritesGalleryImg',
                    alt: 'movie img'
                }).appendTo(favoriteWrapper);

            } else {
                $($(that).find($('.star')).attr('src', '../images/emptyStar.png'));
            }
        });
    }, 1000)


    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }

    window.onscroll = function () {
        scrollBtn();
        if (this.oldScroll > this.scrollY) {
            $(".headerContainer").css("opacity", 1 + $(window).scrollTop() / 250);
            $(".headerContainer").css('pointer-events', 'all');
        } else {
            $(".headerContainer").css("opacity", 1 - $(window).scrollTop() / 350);
            if ($(".headerContainer").css('opacity') < 0.5) {
                $(".headerContainer").css('pointer-events', 'none');
            }
        }
        this.oldScroll = this.scrollY;
    }

    $('.Xbtn').click(function () {
        if ($($(this).parent().parent()).hasClass('animated')) {
            $(selectedDiv).css({border: '0 solid black'}).animate({
                borderWidth: 0
            }, 200);
        }

        $(this).parent().parent().fadeOut(150);
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

        searchVal = $('#search').val();
        lastChar = searchVal.substr(searchVal.length - 1);
    
        if (lastChar == ' ') {
            return; 
        } else {
            $('#searchResults').empty();
        }

        $.each($('.tvShowWrapper'), function (key, value) {
            showResult($('.tvShowWrapper'),$('.tvShowImg'), $(this));
        });

        $.each($('.movieWrapper'), function (key, value) {
            showResult($('.movieWrapper'), $('.movieImg'), $(this));
        });

    })
});

function goToFavoriteMovie(name) {
    $.each($('.movieWrapper'), function (key, value) {
        if (name == $(value).find($('.name')).html()) {
            goToResult($(value).parent());
            $('#favorites').hide();
            $('body').css('pointer-events', 'none');
            setTimeout(function() {
                $(value).click();
                $('body').css('pointer-events', 'all');
            }, 1500)
        }
    });
}

function showResult(div, img, that) {

    for (let i = 0; i < $(that).length; i++) {

        let movieName = $($(that)[i]).attr('name');

        let movieImg = $($(that)[i]).find(img).attr('src');

        let searchValCapitalized = searchVal.charAt(0).toUpperCase() + searchVal.slice(1);

        if (searchVal.length == 0 || $('.result').length < 1) {
            $('#searchResults').hide();
            $('#search').css({'border-bottom-right-radius': '5px', 'border-bottom-left-radius': '5px'});
        } else {
            $('#searchResults').show();
            $('#search').css({'border-bottom-right-radius': '0', 'border-bottom-left-radius': '0'});
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
                click: function() {

                    let that = this;
                    let pickedName = $(that).find($('.resultName')).html();

                    $.each($(div), function (key, value) {
                        if (pickedName == $(this).attr('name')) {
                            $('body').css('pointer-events', 'none');
                            selectedDiv = this;
                            goToResult($(selectedDiv).parent());

                            $('#movieDetails').addClass('animated');

                            $(selectedDiv).css({border: '0 solid black'}).animate({
                                borderWidth: 6
                            }, 500);

                            setTimeout(function(){
                                $(selectedDiv).css({border: '0 solid black'}).animate({
                                    borderWidth: 0
                                }, 500);
                                $('#movieDetails').removeClass('animated');
                            }, 3000)
                        
                            $('#searchResults').hide();
                            $('#search').val('');
                            setTimeout(function() {
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

            let resultName = $('<p>', {
                class: 'resultName',
                text: cap
            }).appendTo(result);
        }
    }
}

function capitalize(str) {
    str = str.split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
}

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
    if ($(window).width() > 765) {
        $('html, body').animate({ scrollTop: $(div).position().top -210 }, 'slow');
    } else {
        $('html, body').animate({ scrollTop: $(div).position().top -190}, 'slow');
    }
}

function goToResult(div) {

    if ($(window).width() < 765) {
        $('html, body').animate({ scrollTop: $(div).position().top -200 }, 1500); 
    } else {
        $('html, body').animate({ scrollTop: $(div).position().top -240 }, 1500);
    }
}

function buildMovies(div, wrapper, arr, type) {
    $('#trailerVideo').attr('src', '');

    let movies = arr[0].movies;
    let headerText;
    let btnClass;
    let cinematicUBtnId;
    let cinematicUBtnText;
    let nonCinematicUBtnText;
    let allTypeBtnId;
    let allTypeBtnText;
    let typeSortClick;
    let typeShowClick;
    let typeU;

    switch (type) {
        case 1:
            headerText = 'Marvel';
            btnClass = 'marvelBtn';
            cinematicUBtnId = 'btnMCU';
            cinematicUBtnText = 'MCU Only';
            nonCinematicUBtnText = 'Non MCU';
            allTypeBtnId = 'btnAllMarvel';
            allTypeBtnText = 'All Marvel';
            typeSortClick = $('#marvelContainer');
            typeShowClick = '.marvelMovie';
            typeU = 'mcu';
            break;
        case 2:
            headerText = 'DC';
            btnClass = 'dcBtn';
            cinematicUBtnId = 'btnDCEU';
            cinematicUBtnText = 'DCEU Only';
            nonCinematicUBtnText = 'Non DCEU';
            allTypeBtnId = 'btnAllDC';
            allTypeBtnText = 'All DC';
            typeSortClick = $('#dcContainer');
            typeShowClick = '.dcMovie';
            typeU = 'dceu';

            break;
        case 3:
            headerText = 'Others';
            btnClass = 'othersBtn';
            typeSortClick = $('#othersContainer');
            break;
        case 4:
            headerText = 'Animations';
            btnClass = 'animationBtn';
            typeSortClick = $('#animationContainer');
            break;
    }

    let typeheader = $('<h2>', {
        class: 'typeheader',
        text: headerText
    }).appendTo(wrapper);

    let btnWrapper = $('<div>', {
        class: 'btnWrapper',
    }).appendTo(wrapper);

    let sortContainer = $('<div>', {
        class: 'sortContainer',
    }).appendTo(btnWrapper);

    let sortContent = $('<div>', {
        class: 'sortContent',
    }).appendTo(sortContainer);

    let sortBtn = $('<button>', {
        class: btnClass,
        text: 'Sort',
        click: function () {
            sort($(this).parent().parent(), type);
        }
    }).appendTo(btnWrapper);

    let dateSortBtn = $('<button>', {
        class: btnClass,
        text: 'By Date',
        click: function () {
            sortMovies(typeSortClick, 'date', 1);
        }
    }).appendTo(sortContent);

    let nameSortBtn = $('<button>', {
        class: btnClass,
        text: 'By Name',
        click: function () {
            sortMovies(typeSortClick, 'name', 2);
        }
    }).appendTo(sortContent);

    let runtimeSortBtn = $('<button>', {
        class: btnClass,
        text: 'By Runtime',
        click: function () {
            sortMovies(typeSortClick, 'runtime', 4);
        }
    }).appendTo(sortContent);

    let groupSortBtn = $('<button>', {
        class: btnClass,
        text: 'By Group',
        click: function () {
            sortMovies(typeSortClick, 'group', 3);
        }
    }).appendTo(sortContent);

    if (type == 1 || type == 2) {
        let cinematicUBtn = $('<button>', {
            class: btnClass,
            id: cinematicUBtnId,
            text: cinematicUBtnText,
            click: function () {
                if (type == 1) {
                    cinematicType = 1;
                    if (marvelCinematicCounter == 1) {
                        showCinematicUniverse(typeShowClick, typeU);
                        marvelCinematicCounter = 2;
                        $(this).html(nonCinematicUBtnText);
                    } else {
                        hideCinematicUniverse(typeShowClick, typeU);
                        marvelCinematicCounter = 1;
                        $(this).html(cinematicUBtnText);
                    }
                } else if (type == 2) {
                    cinematicType = 2;
                    if (dcCinematicCounter == 1) {
                        showCinematicUniverse(typeShowClick, typeU);
                        dcCinematicCounter = 2;
                        $(this).html(nonCinematicUBtnText);
                    } else {
                        hideCinematicUniverse(typeShowClick, typeU);
                        dcCinematicCounter = 1;
                        $(this).html(cinematicUBtnText);
                    }
                }
                $('.sortContainer').fadeOut('fast');
                marvelCounter = 1;
                DCCounter = 1;
                OthersCounter = 1;
                animationCounter = 1;
            }

        }).appendTo(btnWrapper);

        let allTypeBtn = $('<button>', {
            class: btnClass,
            id: allTypeBtnId,
            text: allTypeBtnText,
            click: function () {
                allOfKind(typeShowClick);
            }
        }).appendTo(btnWrapper);
    }

    for (let i = 0; i < movies.length; i++) {

        let date = new Date(movies[i].date);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let yearToShow = date.getFullYear();

        if (day < 10) {
            day = '0' + day
        } else {
            day = day;
        }

        if (month < 10) {
            month = '0' + month
        } else {
            month = month;
        }

        let dateForShow = day + '/' + month + '/' + yearToShow;

        let groupStr = JSON.stringify(movies[i].group);

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

        let movieType = movies[i].group;

        let movieWrapper = $('<div>', {
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
                $('#movieDetails').fadeIn(150);

                switch (type) {

                    case 1:
                        $('.popupBtn').css('background-color', '#e62429');
                        break;
                    case 2:
                        $('.popupBtn').css('background-color', '#0282f9');
                        break;
                    case 3:
                        $('.popupBtn').css('background-color', 'rgba(100, 100, 255, .9)');
                        break;
                    case 4:
                        $('.popupBtn').css('background-color', 'rgba(100, 200, 100, .9)');
                        break;
                }

                $('#movieYoutubeImage').click(function () {
                    $('#movieDetails').hide();
                    $('#trailer').fadeIn(150);
                    setTimeout(function () {
                        $('#trailerVideo').attr('src', $('#trailerVideo').attr('src').replace('?autoplay=1&amp;rel=0&enablejsapi=1', ''));
                        $('#trailerVideo').attr('src', $('#trailerVideo').attr('src') + '?autoplay=1&amp;rel=0&enablejsapi=1');
                    }, 500)
                })
            }
        }).appendTo(groupWrapper);

        let newDate = new Date(movies[i].date);

        let star = $('<img>', {
            class: 'star',
            src: '../images/emptyStar.png',
            click: function(e) {
                let thisMovieName = $(this).parent().find($('.name')).html();
                let thisMovieImg = $(this).parent().find($('.movieImg')).attr('src');
                e.stopPropagation();
                if ($(this).attr('src') == '../images/emptyStar.png') {
                    $(this).attr('src', '../images/Star.png');
                    localStorage.setItem(thisMovieName, thisMovieName);

                    let favoriteWrapper = $('<div>', {
                        class: 'favoriteWrapper',
                        click: function() {
                            goToFavoriteMovie(thisMovieName);
                        }
                    }).appendTo($('#favorites #favoritesGallery'));

                    let favoriteNamePop = $('<p>', {
                        text: thisMovieName,
                        class: 'favoritesGalleryImgName'
                    }).appendTo(favoriteWrapper);

                    let favoriteiImgPop = $('<img>', {
                        src: thisMovieImg,
                        class: 'favoritesGalleryImg',
                        alt: 'movie img'
                    }).appendTo(favoriteWrapper);

                } else {
                    $(this).attr('src', '../images/emptyStar.png');
                    localStorage.removeItem(thisMovieName, thisMovieName);
                }             
            }
        }).appendTo(movieWrapper);

        let movieName = $('<p>', {
            class: 'name',
            text: movies[i].name
        }).appendTo(movieWrapper);

        let movieYear = $('<p>', {
            class: 'year',
            text: 'Year: ' + newDate.getFullYear()
        }).appendTo(movieWrapper);

        let movieDate = $('<p>', {
            class: 'date',
            text: 'Release Date: ' + dateForShow
        }).appendTo(movieWrapper);

        let movieImgWrapper = $('<div>', {
            class: 'movieImgWrapper',
        }).appendTo(movieWrapper);

        let movieImg = $('<img>', {
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

function sort(div, num) {

    $.each($('.sortContainer'), function (key, value) {
        $(this).fadeOut('fast');
    });

    switch (num) {
        case 1:
            if (marvelCounter == 1) {
                $(div).find($('.sortContainer')).fadeIn('fast');
                marvelCounter = 2;
                DCCounter = 1;
                OthersCounter = 1;
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
                OthersCounter = 1;
                animationCounter = 1;
            } else {
                $(div).find($('.sortContainer')).fadeOut('fast');
                DCCounter = 1;
            }
            break;
        case 3:
            if (OthersCounter == 1) {
                $(div).find($('.sortContainer')).fadeIn('fast');
                OthersCounter = 2;
                marvelCounter = 1;
                DCCounter = 1;
                animationCounter = 1;
            } else {
                $(div).find($('.sortContainer')).fadeOut('fast');
                OthersCounter = 1;
            }
            break;
        case 4:
            if (animationCounter == 1) {
                $(div).find($('.sortContainer')).fadeIn('fast');
                animationCounter = 2;
                marvelCounter = 1;
                DCCounter = 1;
                OthersCounter = 1;
            } else {
                $(div).find($('.sortContainer')).fadeOut('fast');
                animationCounter = 1;
            }
            break;
    }
}

function buildTvShow(div, wrapper, arr) {
    $('#trailerVideo').attr('src', '');

    let tvShows = arr[0].tvShows;

    let typeheader = $('<h2>', {
        class: 'typeheader',
        text: 'TV Shows'
    }).appendTo(wrapper);

    for (let i = 0; i < tvShows.length; i++) {
        let tvShowType = tvShows[i].group;

        let tvShowWrapper = $('<div>', {
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
                $('#tvShowDetails').fadeIn(150);
                $('.popupBtn').css('background-color', '#D67B6E');

                $('#tvShowYoutubeImage').click(function () {
                    $('#tvShowDetails').hide();
                    $('#trailer').fadeIn(150);
                    setTimeout(function () {
                        $('#trailerVideo').attr('src', $('#trailerVideo').attr('src').replace('?autoplay=1&amp;rel=0&enablejsapi=1', ''));
                        $('#trailerVideo').attr('src', $('#trailerVideo').attr('src') + '?autoplay=1&amp;rel=0&enablejsapi=1');
                    }, 500)
                })
            }
        }).appendTo(wrapper);

        let tvShowName = $('<p>', {
            class: 'name',
            text: tvShows[i].name
        }).appendTo(tvShowWrapper);

        let tvShowYear = $('<p>', {
            class: 'year',
            text: 'Year: ' + tvShows[i].year
        }).appendTo(tvShowWrapper);

        let tvShowImgWrapper = $('<div>', {
            class: 'tvShowImgWrapper',
        }).appendTo(tvShowWrapper);

        let tvShowImg = $('<img>', {
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
    for (let i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
        if ($($(div)[i]).attr(elem) == 'false') {
            $($(div)[i]).hide();
        }
    }
}

function hideCinematicUniverse(div, elem) {
    for (let i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
        if ($($(div)[i]).attr(elem) == 'true') {
            $($(div)[i]).hide();
        }
    }
}

function allOfKind(div) {
    for (let i = 0; i < $(div).length; i++) {
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
    OthersCounter = 1;
    animationCounter = 1;
}

function goToTop() {
    $('html,body').animate({ scrollTop: 0 }, 2000);
    if ($(window).width() > 765) {
        $('.goToTopBtn').animate({ bottom: '47rem' }, 1800);

        setTimeout(function () {
            $('.goToTopBtn').fadeOut('fast');
        }, 2000)

        setTimeout(function () {
            $('.goToTopBtn').css('bottom', '4rem');
        }, 2300)
    }
}


function goToFavorites() {
    $('#favorites').show();
}

function scrollBtn() {

    if ($(window).width() > 765) {
        if ($(this).scrollTop() > 550) {
            $('.goToTopBtn').fadeIn();
        }
        else {
            $('.goToTopBtn').fadeOut();
        }
    } else {
        if ($(this).scrollTop() > 550) {
            $('.goToTopBtn2').fadeIn();
        }
        else {
            $('.goToTopBtn2').fadeOut();
        }
    }
}

function sortMovies(container, elem1, kind) {

    $('.groupWrapper').removeClass('oddGroup');
    $('.groupWrapper').removeClass('evenGroup');

    let btnWrapper = $(container).find($('.btnWrapper'));

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
                case 4:
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
            case 4:
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
        }

        for (i = 0; i < ids.length; i++) {
            $(this).append(ids[i].element);
        }
    });
    $('.sortContainer').fadeOut('fast');
    marvelCounter = 1;
    DCCounter = 1;
    OthersCounter = 1;
    animationCounter = 1;
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
    if ($($(that)[0].parentElement.parentElement.parentElement).hasClass('animated')) {
        $(selectedDiv).css({border: '0 solid black'}).animate({
            borderWidth: 0
        }, 200);
    }

    $($(that)[0].parentElement.parentElement.parentElement).fadeOut(150);
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
