
const scrollIndicator = () => {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
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
        var today = new Date();
        var birthDate = new Date(dateString);

        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age; 
    } else {
        var today = new Date(dateString);
        var birthDate = new Date(deadBirthDate);

        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
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
}

const checkAudio = (value, type) => {

    let audioFile;

    if (type == 1) {
        switch(value) {
            case 1726:
                audioFile = 'ironMan.mp3';
                break;

            default:
                audioFile = null;
                break;
        }
    } else {
        switch(value) {
            case 1405:
                audioFile = 'dexter.mp3';
                break;
            case 1668:
                audioFile = 'friends.mp3';
                break;
            case 1100:
                audioFile = 'howIMetYourMother.mp3';
                break;
            case 1399:
                audioFile = 'gameOfThrones.mp3';
                break;
            case 85271:
                audioFile = 'wandavision.mp3';
                break;
            case 88396:
                audioFile = 'theFalconAndTheWinterSoldier.mp3';
                break;
            case 84958:
                audioFile = 'loki.mp3';
                break;
            case 1396:
                audioFile = 'breakingBad.mp3';
                break;
            default:
                audioFile = null;
                break;
        }
    }

    if (audioFile !== null) {
            
        let audio = $('<audio>', {
            controls: true,
            id: 'audio',
        }).appendTo('#chosenMovie')

        let source = $('<source>', {
            src: './audio/' + audioFile,
        }).appendTo(audio)

        setTimeout(() => {
            $('#audio').trigger('play');
        }, 1500)
    }
}
