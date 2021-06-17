
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