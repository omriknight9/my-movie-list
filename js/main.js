
var marvelMovies = [];
var dcMovies = [];
var otherMovies = [];
var animationMovies = [];
var type;

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
    })

    setTimeout(function () {
        $('.spinnerWrapper').hide();
        $('.searchContainer').show();
        $('button').show();
        $('#marvelContainer').css('display', 'flex');
        $('#dcContainer').css('display', 'flex');
        $('#othersContainer').css('display', 'flex');
        $('#animationContainer').css('display', 'flex');
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
            buildMovies('marvelMovie', $('#marvelContainer'), marvelMovies);
        }, 500);

    });

    $.get('./lists/dc.txt', function (data) {
        dcMovies.push(JSON.parse(data));
        setTimeout(function () {
            buildMovies('dcMovie', $('#dcContainer'), dcMovies);
        }, 500);
    });

    $.get('./lists/others.txt', function (data) {
        otherMovies.push(JSON.parse(data));
        setTimeout(function () {
            buildMovies('otherMovie', $('#othersContainer'), otherMovies);
        }, 500);
    });
    $.get('./lists/animation.txt', function (data) {
        animationMovies.push(JSON.parse(data));
        setTimeout(function () {
            buildMovies('animationMovie', $('#animationContainer'), animationMovies);
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
    }, 700)
}

function buildMovies(div, wrapper, arr) {
    var movies = arr[0].movies;
    
    for (var i = 0; i < movies.length; i++) {
        var movieType = movies[i].group;

        var movieWrapper = $('<div>', {
            class: 'movieWrapper ' + div,
            'year': movies[i].year,
            'name': movies[i].name,
            'movieId': movieType,
            'quality': movies[i].quality,
            'imdbId': movies[i].imdbId,
            'mcu': movies[i].mcu,
            'dceu': movies[i].dceu,
            click: function () {
                $('.movieNamePop').html($(this).attr('name'));
                $('.movieQualityPop').html('Quality: ' + $(this).attr('quality'));
                $('#imdbLink').attr('href', 'https://www.imdb.com/title/' + $(this).attr('imdbId'));
                $('#movieDetails').show();
                switch ($(this).parent().attr('id')) {
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
            }
        }).appendTo(wrapper);

        var movieName = $('<p>', {
            class: div + 'Name',
            text: movies[i].name
        }).appendTo(movieWrapper);

        var movieYear = $('<p>', {
            class: div + 'Year',
            text: 'Year: ' + movies[i].year
        }).appendTo(movieWrapper);

        var movieImgWrapper = $('<div>', {
            class: 'movieImgWrapper',
        }).appendTo(movieWrapper);

        var movieImg = $('<img>', {
            class: 'movieImg',
            alt: 'movieImg',
            src: './images/movies/' + movies[i].image
        }).appendTo(movieImgWrapper);
    }
}

function showCinematicUniverse(div, elem) {
    for (var i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
        if ($($(div)[i]).attr(elem) == 'false') {
            $($(div)[i]).hide();
        }
    }
    goToDiv($(div).parent());
}

function hideCinematicUniverse(div, elem) {
    for (var i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
        if ($($(div)[i]).attr(elem) == 'true') {
            $($(div)[i]).hide();
        }
    }
    goToDiv($(div).parent());
}

function allOfKind(div) {
    for (var i = 0; i < $(div).length; i++) {
        $($(div)[i]).show();
    }
    goToDiv($(div).parent());
}

function goToTop() {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
}

function scrollBtn() {

    if ($(this).scrollTop() > 550) {
        $('.goToTopBtn').fadeIn();
    }
    else {
        $('.goToTopBtn').fadeOut();
    }
}

function sortMovies(container, elem1) {
    $.each($(container), function (key, value) {
        var ids = [], obj, i, len;
        var children = $(this).find('.movieWrapper');
        for (i = 0, len = children.length; i < len; i++) {
            obj = {};
            obj.element = children[i];
            var elem2 = $(children[i]).attr(elem1);
            obj.idNum = parseInt(elem2.replace(/[^\d]/g, ""), 10);
            ids.push(obj);
        }
        ids.sort(function (a, b) { return (a.idNum - b.idNum); });
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
