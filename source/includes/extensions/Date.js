/**
 * @file Diese Datei erweitert die Date Klasse
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */


if(!Date.prototype.hasOwnProperty("getMillisecondsOfDay")) {
    /**
     * Gibt die heutige vergangenen Millisekunden zurück
     * @returns {number}
     */
    Date.prototype.getMillisecondsOfDay = function () {
        var today_abs = new Date();
        today_abs.setHours(0);
        today_abs.setMinutes(0);
        today_abs.setSeconds(0);

        var ms = this.getTime() - today_abs.getTime();
        return ms;
    };
}

if(!Date.prototype.hasOwnProperty("getMillisecondsOfMonth")) {
    /**
     * Gibt die vergangenen Millisekunden dieses Monats zurück
     * @returns {number}
     */
    Date.prototype.getMillisecondsOfMonth = function () {
        var month_abs = new Date();
        month_abs.setDate(0);
        month_abs.setHours(0);
        month_abs.setMinutes(0);
        month_abs.setSeconds(0);

        var ms = this.getTime() - month_abs.getTime();
        return ms;
    };
}

if(!Date.prototype.hasOwnProperty("getMillisecondsOfYear")) {
    /**
     * Gibt die vergangenen Millisekunden dieses Jahres zurück
     * @returns {number}
     */
    Date.prototype.getMillisecondsOfYear = function () {
        var year_abs = new Date();
        year_abs.setMonth(0);
        year_abs.setDate(1);
        year_abs.setHours(0);
        year_abs.setMinutes(0);
        year_abs.setSeconds(0);

        var ms = this.getTime() - year_abs.getTime();
        return ms;
    };
}



if(typeof Date.getWeekStart !== 'function') {
    /**
     * Gibt ein Dateobjekt zurück, welches Montag 00:00:00 entspricht
     * @returns {Date}
     */
    Date.getWeekStart = function() {
        var now = new Date();
        var day = now.getDay() || 7; // Get current day number, converting Sun. to 7)
        if(day != 1) { //go back in time to monday
            now.setHours(-24 * (day-1));
        }
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0)

        return now;
    };

}

if(!Date.prototype.hasOwnProperty("getMillisecondsOfWeek")) {
    /**
     * Gibt die vergangenen Millisekunden dieser Woche zurück
     * @returns {number}
     */
    Date.prototype.getMillisecondsOfWeek = function () {
        var ms = this.getTime() - Date.getWeekStart();
        return ms;
    };
}


if(!Date.prototype.hasOwnProperty("toGermanString")) {
    /**
     * Wandelt die Zeit in einen Datestring um, der in Deutschland üblich ist
     * @returns {string}
     */
    Date.prototype.toGermanString = function () {

        var date = this.getDate();
        if(date < 10)
            date = "0" + date;

        var month = this.getMonth()+1;
        if(month < 10)
            month = "0" + month;

        var seconds = this.getSeconds();
        if(seconds < 10)
            seconds = "0" + seconds;

        var minutes = this.getMinutes();
        if(minutes < 10)
            minutes = "0" + minutes;

        var hours = this.getHours();
        if(hours < 10)
            hours = "0" + hours;


        return date + "." + month + "." + this.getFullYear() + " - " + hours + ":" + minutes + ":" + seconds;
    };
}