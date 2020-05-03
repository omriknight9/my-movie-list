
let marvelMovies = [];
let dcMovies = [];
let valiantMovies = [];
let otherMovies = [];
let animationMovies = [];
let tvShows = [];
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

let buildCounter = 0;

$(document).ready(function (event) {

    loadJson();

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
        $('#valiantContainer').css('display', 'flex');
        $('#othersContainer').css('display', 'flex');
        $('#animationContainer').css('display', 'flex');
        $('#tvShowContainer').css('display', 'flex');
    }, 500);

    $('#search').on('input', function () {
        let resultType;

        searchVal = $('#search').val();
        lastChar = searchVal.substr(searchVal.length - 1);
    
        if (lastChar == ' ') {
            return; 
        } else {
            $('#searchResults').empty();
        }

        $.each($('.tvShowWrapper'), function (key, value) {
            let tvShowNumId = $(value).attr('numId');
            showResult($('.tvShowWrapper'),$('.tvShowImg'), $(this), tvShowNumId);
        });

        $.each($('.movieWrapper'), function (key, value) {
            let movieNumId = $(value).attr('numId');
            
        if ($(value).hasClass('marvelMovie')) {
            resultType = 1;
        } else if ($(value).hasClass('dcMovie')) {
            resultType = 2;
        }else if ($(value).hasClass('valiantMovie')) {
            resultType = 3;
        } else if ($(value).hasClass('otherMovie')) {
            resultType = 4;
        } else if ($(value).hasClass('animationMovie')) {
            resultType = 5;
        }
            showResult($('.movieWrapper'), $('.movieImg'), $(this), movieNumId, resultType);
        });
    })
});

function checkLocalStorage() {
    setTimeout(function() {
        let data;
        let parsedId;
        let type;
        $.each($('.movieWrapper'), function (key, value) {
            let testMovieid = $(value).attr('numId');
            let testMovieType;
            
            if ($(value).hasClass('marvelMovie')) {
                data = localStorage.getItem('marvelMovieId_' + testMovieid);
                testMovieType = 'marvelMovie';
            } else if ($(value).hasClass('dcMovie')) {
                data = localStorage.getItem('dcMovieId_' + testMovieid);
                testMovieType = 'dcMovieId_';
            }else if ($(value).hasClass('valiantMovie')) {
                data = localStorage.getItem('valiantMovieId_' + testMovieid);
                testMovieType = 'valiantMovieId_';
            } else if ($(value).hasClass('otherMovie')) {
                data = localStorage.getItem('otherMovieId_' + testMovieid);
                testMovieType = 'otherMovie';
            } else if ($(value).hasClass('animationMovie')) {
                data = localStorage.getItem('animationMovieId_' + testMovieid);
                testMovieType = 'animationMovie';
            }
    
            if (data) {
                parsedId = JSON.parse(data).id;
                type = JSON.parse(data).type;;
        
                let thisMovieName = $(value).find($('.name')).html();
                let thisMovieImg = $(value).find($('.movieImg')).attr('src');
                let that = $(this).find($('.star'));
    
                if (testMovieid === parsedId) {
                    $(that).attr('src', './images/star.png');
                    let favoriteWrapper = $('<div>', {
                        'numId': testMovieid,
                        'type': type,
                        class: 'favoriteWrapper',
                        click: function() {
                            goToFavoriteMovie(testMovieid, $(this).attr('type'));
                        }
                    }).appendTo($('#favorites #favoritesGallery'));
    
                    let favoriteNamePop = $('<p>', {
                        text: thisMovieName,
                        class: 'favoritesGalleryName'
                    }).appendTo(favoriteWrapper);
    
                    let favoriteiImgPop = $('<img>', {
                        src: thisMovieImg,
                        class: 'favoritesGalleryImg',
                        alt: 'movie img'
                    }).appendTo(favoriteWrapper);
    
                    let favoritesBtnWrapper = $('<div>', {
                        class: 'favoritesBtnWrapper',
                    }).appendTo(favoriteWrapper);
    
                    let removeFromFavoritesBtn = $('<button>', {
                        text: 'Remove',
                        class: 'removeFromFavoritesBtn',
                        click: function(e) {
                            e.stopPropagation();
                            $(this).parent().parent().remove();
                            localStorage.removeItem(testMovieType + 'Id_' + testMovieid);
                            $(that).attr('src', './images/emptyStar.png');
                        }
                    }).appendTo(favoritesBtnWrapper);
    
                } else {
                    $($(that).find($('.star')).attr('src', './images/emptyStar.png'));
                }
            }
        });
    }, 1000)
}

function goToFavoriteMovie(movieId, type) {

    let typeToSearch;

    switch(type) {
        case '1': 
            typeToSearch = '#marvelContainer .movieWrapper';
        break;
        case '2': 
            typeToSearch = '#dcContainer .movieWrapper';
        break;
        case '3': 
            typeToSearch = '#valiantContainer .movieWrapper';
        break;
        case '4': 
            typeToSearch = '#othersContainer .movieWrapper';
        break;
        case '5': 
            typeToSearch = '#animationContainer .movieWrapper';
        break;
    }

    $.each($(typeToSearch), function (key, value) {
        if (movieId == $(value).attr('numId')) {
            let finalDivToGoTo = Number($(value).parent().parent().position().top) + Number($(value).parent().position().top);

            goToResult(finalDivToGoTo);
            $(value).css({border: '0 solid black'}).animate({
                borderWidth: 6
            }, 500);

            setTimeout(function() {
                $(value).css({border: '0 solid black'}).animate({
                    borderWidth: 0
                }, 500);
            }, 3000)

            $('#favorites').hide();
            $('body').css('pointer-events', 'none');
            setTimeout(function() {
                $(value).click();
                $('body').css('pointer-events', 'all');
            }, 1500)
        }
    });
}

function showResult(div, img, that, resultNum, resultType) {

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
                    }

                    let that = this;
                    $.each($(div), function (key, value) {
                        if ($(that).attr('movieNum') == $(this).attr('numId')) {
                            $('body').css('pointer-events', 'none');
                            selectedDiv = this;
                            let finalDivToGoTo = Number($(selectedDiv).parent().parent().position().top) + Number($(selectedDiv).parent().position().top);
                
                            goToResult(finalDivToGoTo);

                            $('#movieDetails').addClass('animated');

                            $(selectedDiv).css({border: '0 solid black'}).animate({
                                borderWidth: 6
                            }, 500);

                            setTimeout(function() {
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

    var promise1 = new Promise(function (resolve) {
        resolve(getInfo('marvel', marvelMovies, 'marvelMovie', $('#marvelContainer'), 1));
    });

    promise1.then(function () {
        getInfo('dc', dcMovies, 'dcMovie', $('#dcContainer'), 2);
    });

    promise1.then(function () {
        getInfo('valiant', valiantMovies, 'valiantMovie', $('#valiantContainer'), 3);
    });

    promise1.then(function () {
        getInfo('others', otherMovies, 'otherMovie', $('#othersContainer'), 4);
    });

    promise1.then(function () {
        getInfo('animation', animationMovies, 'animationMovie', $('#animationContainer'), 5);
    });

    promise1.then(function () {
        $.get('./lists/tvShows.txt', function (data) {
            tvShows.push(JSON.parse(data));
            buildTvShow('tvShow', $('#tvShowContainer'), tvShows);
        });
    });

    promise1.then(function () {
        checkLocalStorage();
    });
}

function getInfo(textFile, arr, div, container, type) {
    $.get('./lists/' + textFile + '.txt', function (data) {
        arr.push(JSON.parse(data));
        buildMovies(div, container, arr, type);
    });
}

function goToDiv(div) {
    document.querySelector(div).scrollIntoView({ behavior: 'smooth' });
}

function goToResult(div) {
    if ($(window).width() < 765) {
        $('html, body').animate({ scrollTop: div -150 }, 1500); 
    } else {
        $('html, body').animate({ scrollTop: div -120 }, 1500);
    }

    setTimeout(function() {
        $("html, body").animate({scrollTop: $(window).scrollTop() + 10});
    }, 2000);
}

function buildMovies(div, wrapper, arr, type) {

    buildCounter++;

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
    let headerLineClass;

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
            headerLineClass = 'lineMarvel';
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
            headerLineClass = 'lineDc';
            break;
        case 3:
            headerText = 'Valiant';
            btnClass = 'valiantBtn';
            typeSortClick = $('#valiantContainer');
            headerLineClass = 'lineValiant';
            break;
        case 4:
            headerText = 'Others';
            btnClass = 'othersBtn';
            typeSortClick = $('#othersContainer');
            headerLineClass = 'lineOthers';
            break;
        case 5:
            headerText = 'Animations';
            btnClass = 'animationBtn';
            typeSortClick = $('#animationContainer');
            headerLineClass = 'lineAnimation';
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
                        showCinematicUniverse(typeShowClick, typeU, mcuWasSorted);
                        marvelCinematicCounter = 2;
                        $(this).html(nonCinematicUBtnText);
                    } else {
                        hideCinematicUniverse(typeShowClick, typeU, mcuWasSorted);
                        marvelCinematicCounter = 1;
                        $(this).html(cinematicUBtnText);
                    }
                } else if (type == 2) {
                    cinematicType = 2;
                    if (dcCinematicCounter == 1) {
                        showCinematicUniverse(typeShowClick, typeU, dceuWasSorted);
                        dcCinematicCounter = 2;
                        $(this).html(nonCinematicUBtnText);
                    } else {
                        hideCinematicUniverse(typeShowClick, typeU, dceuWasSorted);
                        dcCinematicCounter = 1;
                        $(this).html(cinematicUBtnText);
                    }
                }
                $('.sortContainer').fadeOut('fast');
                marvelCounter = 1;
                DCCounter = 1;
                valiantCounter = 1;
                othersCounter = 1;
                animationCounter = 1;
            }

        }).appendTo(btnWrapper);

        let allTypeBtn = $('<button>', {
            class: btnClass,
            id: allTypeBtnId,
            text: allTypeBtnText,
            click: function () {
                if (type == 1) {
                    allOfKind(typeShowClick, mcuWasSorted);
                } else if (type == 2) {
                    allOfKind(typeShowClick, dceuWasSorted);
                }
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
            'numId': movies[i].id,
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
            'value': movies[i].value,
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
                $('#moviePopcornLink').attr('href', 'https://omriknight9.github.io/omris-movies/?title=' + $(this).attr('name') + '&value=' + $(this).attr('value'));
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
            src: './images/emptyStar.png',
            alt: 'star img',
            click: function(e) {

                let thisMovieId = $(this).parent().attr('numId');
                let thisMovieName = $(this).parent().find($('.name')).html();
                let thisMovieImg = $(this).parent().find($('.movieImg')).attr('src');
                let that = $(this);

                e.stopPropagation();
                if ($(this).attr('src') == './images/emptyStar.png') {
                    $(this).attr('src', './images/star.png');

                    $('body').css('pointer-events', 'none');

                    $('#favoritesAddedMsg').fadeTo('fast', 0, function() {
                        $(this).css('display', 'flex');
                    }).fadeTo('fast', 1);

                    setTimeout(function() {
                        $('#favoritesAddedMsg').fadeTo('fast', 0, function() {
                            $(this).css('display', 'none');
                        }).fadeTo('fast', 1);
                        $('body').css('pointer-events', 'all');
                    }, 1000);

                    let obj = {'id': thisMovieId, 'name': thisMovieName, 'type': type};
                    localStorage.setItem(div + 'Id_' + thisMovieId, JSON.stringify(obj));

                    let favoriteWrapper = $('<div>', {
                        'numId': thisMovieId,
                        'type': type,
                        class: 'favoriteWrapper',
                        click: function() {
                            goToFavoriteMovie(thisMovieId, $(this).attr('type'));
                        }
                    }).appendTo($('#favorites #favoritesGallery'));

                    let favoriteNamePop = $('<p>', {
                        text: thisMovieName,
                        class: 'favoritesGalleryName'
                    }).appendTo(favoriteWrapper);

                    let favoriteiImgPop = $('<img>', {
                        src: thisMovieImg,
                        class: 'favoritesGalleryImg',
                        alt: 'movie img'
                    }).appendTo(favoriteWrapper);

                    let favoritesBtnWrapper = $('<div>', {
                        class: 'favoritesBtnWrapper',
                    }).appendTo(favoriteWrapper);
    
                    let removeFromFavoritesBtn = $('<button>', {
                        text: 'Remove',
                        class: 'removeFromFavoritesBtn',
                        click: function(e) {
                            e.stopPropagation();
                            $(this).parent().parent().remove();
                            localStorage.removeItem(div + 'Id_' + thisMovieId);
                            $(that).attr('src', './images/emptyStar.png');
                        }
                    }).appendTo(favoritesBtnWrapper);

                } else {
                    $(this).attr('src', './images/emptyStar.png');
                    localStorage.removeItem(div + 'Id_' + thisMovieId);

                    $.each($('.favoriteWrapper'), function (key, value) {
                        
                        if (thisMovieId == $(value).attr('numId') && type == $(value).attr('type')) {
                            $(value).remove();
                        }
                    });

                    $('#favoritesRemovedMsg').fadeTo('fast', 0, function() {
                        $(this).css('display', 'flex');
                    }).fadeTo('fast', 1);

                    $('body').css('pointer-events', 'none');

                    setTimeout(function() {

                        $('#favoritesRemovedMsg').fadeTo('fast', 0, function() {
                            $(this).css('display', 'none');
                        }).fadeTo('fast', 1);
                        $('body').css('pointer-events', 'all');
                    }, 1000);
                }             
            }
        }).appendTo(movieWrapper);

        let finalName;

        if (movies[i].name.length > 40) {
            finalName = movies[i].name.substring(40, 0) + '...';
            $(movieWrapper).addClass('longNameWrapper');
        } else {
            finalName = movies[i].name;
        }

        let movieName = $('<p>', {
            class: 'name',
            text: finalName
        }).appendTo(movieWrapper);

        if ($(movieWrapper).hasClass('longNameWrapper')) {
            $(movieName).addClass('longName');

            let movieFullNameWrapper = $('<div>', {
                class: 'movieFullNameWrapper',
            }).appendTo(movieWrapper);

            let movieFullName = $('<p>', {
                class: 'movieFullName',
                text: movies[i].name
            }).appendTo(movieFullNameWrapper);

            if ($(window).width() > 765) {
                $(movieName).hover(
                    function() {
                        $(movieName).css('opacity', '.5');
                        $(movieWrapper).find('.movieFullNameWrapper').fadeIn();
                    }
                  );

                  $(movieWrapper).hover(
                    function() {

                    }, function() {
                        $(movieName).css('opacity', '1');
                        $(movieWrapper).find('.movieFullNameWrapper').fadeOut();
                    }
                  );
            }    
        }

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
                    $(movieWrapper).css('background-color', '#FCF6F5FF');
                    break;
                case 'movieWrapper dcMovie':
                    $(movieWrapper).css({'background-color': '#DFDCE5FF'});
                    break;
                case 'movieWrapper otherMovie':
                    $(movieWrapper).css({ 'background-color': '#FCF6F5FF'});
                    break;
                case 'movieWrapper animationMovie':
                    $(movieWrapper).css('background-color', '#DFDCE5FF');
                    break;
            }
        } else {
            switch (movieWrapper.attr('class')) {
                case 'movieWrapper marvelMovie':
                    $(movieWrapper).css('background-color', '#DFDCE5FF');
                    break;
                case 'movieWrapper dcMovie':
                    $(movieWrapper).css('background-color', '#FCF6F5FF');
                    break;
                case 'movieWrapper otherMovie':
                    $(movieWrapper).css('background-color', '#DFDCE5FF');
                    break;
                case 'movieWrapper animationMovie':
                    $(movieWrapper).css({'background-color': '#FCF6F5FF'});
                    break;
            }
        }
    }

    if (buildCounter == 4) {
        addHr();
    }
}

function addHr() {
    setTimeout(function() {
        $('hr').remove();
        $('.groupWrapper:not(:last-child)').each(function() {
            let line = $('<hr>', {
                class: 'hrLine'
            }).appendTo($(this));
        });
    }, 500)
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
            'numId': tvShows[i].id,
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

            $(tvShowWrapper).css('background-color', '#DFDCE5FF');
        } else {
            $(tvShowWrapper).css('background-color', '#FCF6F5FF');
        }
    }
}

function showCinematicUniverse(div, elem, sorted) {

    if (sorted) {
        $('#marvelContainer').find('.groupWrapper').hide();
    }

    $(div).parent().find($('.hrLine')).hide();

    for (let i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
        if ($($(div)[i]).attr(elem) == 'false') {
            $($(div)[i]).hide();
        }
    }

    for (let j = 0; j < $(div).length; j++) {
        let testDiv2 = $($($(div)[j]).parent())[0];
        if ($(testDiv2).children(':visible').length == 0) {
            $($(testDiv2).find($('.hrLine')).hide());
            $(testDiv2).css('padding-bottom', 0);
        } else {
            $($(testDiv2).find($('.hrLine')).show());
            $(testDiv2).css('padding-bottom', '2rem');
        }
    }
}

function hideCinematicUniverse(div, elem, sorted) {

    $(div).parent().find($('.hrLine')).hide();

    for (let i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
        if ($($(div)[i]).attr(elem) == 'true') {
            $($(div)[i]).hide();
        }
    }

    for (let j = 0; j < $(div).length; j++) {
        let testDiv2 = $($($(div)[j]).parent())[0];
        if ($(testDiv2).children(':visible').length == 0) {
            $($(testDiv2).find($('.hrLine')).hide());
            $(testDiv2).css('padding-bottom', 0);
        } else {
            $($(testDiv2).find($('.hrLine')).show());
            $(testDiv2).css('padding-bottom', '2rem');
        }
    }
}

function allOfKind(div, sorted) {

    for (let i = 0; i < $(div).length; i++) {

        let testDiv2 = $($($(div)[i]).parent())[0];
        $(div).parent().find($('.hrLine')).show();
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
    let data;
    let parsedId;
    $.each($('.favoriteWrapper'), function (key, value) {
        let thisMovieId = $(value).attr('numId');
        switch($(value).attr('type')) {
            case 'marvelMovie': 
                data = localStorage.getItem('marvelMovieId_' + thisMovieId);
                
            break;
            case 'dcMovie': 
                data = localStorage.getItem('dcMovieId_' + thisMovieId);
            break;
            case 'otherMovie': 
                data = localStorage.getItem('otherMovieId_' + thisMovieId);
            break;
            case 'animationMovie': 
                data = localStorage.getItem('animationMovieId_' + thisMovieId);
            break;
        }

        if (data) {
            parsedId = JSON.parse(data).id;

            if (thisMovieId === parsedId) {
                
            } else {
                $(value).remove();
            }
        }
    });
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

    $('.groupWrapper').css('padding-bottom', 0);

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
        $('#favoritesGallery').empty();
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

        $(children).parent().find($('.hrLine')).hide();

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
                mcuWasSorted = true;
                dceuWasSorted = true;
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
                        mcuWasSorted = true;
                        dceuWasSorted = true;
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
                        }, 1200);
                        break;
                    case 'dcContainer':
                        setTimeout(function () {
                            $('#dc').click();
                        }, 1200);
                        break;
                    case 'valiantContainer':
                        setTimeout(function () {
                            $('#valiant').click();
                        }, 1200);
                        break;
                    case 'othersContainer':
                        setTimeout(function () {
                            $('#others').click();
                        }, 1200);

                        break;
                    case 'animationContainer':
                        setTimeout(function () {
                            $('#disney').click();
                        }, 1200);
                        break;
                }

                buildCounter = 0;
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
                        mcuWasSorted = true;
                        dceuWasSorted = true;
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
    valiantCounter = 1;
    othersCounter = 1;
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
