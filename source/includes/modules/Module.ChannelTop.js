/**
 * @file Diese Datei definiert das ChannelTop Module
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class ChannelTop
 * @extends Module
 * @constructor
 */
function ChannelTop() {
    App.registerModule(this);
};
ChannelTop.prototype = new Module;
ChannelTop.prototype.constructor = ChannelTop;


ChannelTop.PKEYS = Object.freeze({
    MESSAGE_COUNT:      "mChannelTop_messagecount",
    MESSAGE_CHARS:      "mChannelTop_charcount",
    MESSAGE_CHARAVG:    "mChannelTop_avgchars",
    JOIN_TIME:          "mChannelTop_jointime",
    JOIN_MESSAGE:       "mChannelTop_joinmessage",
    ONLINE_TIME:        "mChannelTop_onlinetime",
    ONLINE_TIME_DAY:    "mChannelTop_onlinetime_day",
    ONLINE_TIME_WEEK:   "mChannelTop_onlinetime_week",
    ONLINE_TIME_MONTH:  "mChannelTop_onlinetime_month",
    ONLINE_TIME_YEAR:   "mChannelTop_onlinetime_year",
    ONLINE_TIME_LASTDAY:    "mChannelTop_onlinetime_lastday",
    ONLINE_TIME_LASTWEEK:   "mChannelTop_onlinetime_lastweek",
    ONLINE_TIME_LASTMONTH:  "mChannelTop_onlinetime_lastmonth",
    ONLINE_TIME_LASTYEAR:   "mChannelTop_onlinetime_lastyear"


});



/**
 *
 * @param {PublicMessage} publicMessage
 */
ChannelTop.prototype.onPublicMessage = function(publicMessage) {
    var user = publicMessage.getAuthor();
    var mcount = user.getPersistence().addNumber(ChannelTop.PKEYS.MESSAGE_COUNT,1);
    var ccount = user.getPersistence().addNumber(ChannelTop.PKEYS.MESSAGE_CHARS, publicMessage.getText().length);
    var avg = parseFloat((1.0*ccount/mcount).toFixed(2));
    user.getPersistence().setNumber(ChannelTop.PKEYS.MESSAGE_CHARAVG,avg);
};

ChannelTop.prototype.onActivated = function() {
    this.registerCommand("channeltop", this.cmdChanneltop);

    //löschen wir erstmal alle jointimes < wir wissen nicht wielange die app aus war
    UserPersistenceNumbers.deleteAll(ChannelTop.PKEYS.JOIN_TIME);

    //gebe allen Usern einen jointime
    var users = KnuddelsServer.getChannel().getOnlineUsers(UserType.Human);
    for(var i = 0; i < users.length; i++) {
        users[i].getPersistence().setNumber(ChannelTop.PKEYS.JOIN_TIME, Date.now());
    }
};


/**
 * Timerhandler, wird jede Sekunde aufgerufen
 * @param {Date} date
 */
ChannelTop.prototype.timerHandler = function(date) {
    if(date.getSeconds() != 0)
        return; //wir brauchen nur jede Minute




    if((date.getSeconds() == 0 && date.getMinutes() == 0 && date.getHours() == 0)) { //jede nacht um 0
        if(date.getDay() == 1) { //jeden Montag
            UserPersistenceNumbers.deleteAll(ChannelTop.PKEYS.ONLINE_TIME_LASTWEEK);
            UserPersistenceNumbers.updateKey(ChannelTop.PKEYS.ONLINE_TIME_WEEK, ChannelTop.PKEYS.ONLINE_TIME_LASTWEEK);
        }
        if(date.getDate() == 1) { //jeden Monatsersten
            UserPersistenceNumbers.deleteAll(ChannelTop.PKEYS.ONLINE_TIME_LASTMONTH);
            UserPersistenceNumbers.updateKey(ChannelTop.PKEYS.ONLINE_TIME_MONTH, ChannelTop.PKEYS.ONLINE_TIME_LASTMONTH);
        }
        if(date.getDate() == 1 && date.getMonth() == 0) { //jeden ersten Tag im Jahr
            UserPersistenceNumbers.deleteAll(ChannelTop.PKEYS.ONLINE_TIME_LASTYEAR);
            UserPersistenceNumbers.updateKey(ChannelTop.PKEYS.ONLINE_TIME_YEAR, ChannelTop.PKEYS.ONLINE_TIME_LASTYEAR);
        }
        UserPersistenceNumbers.deleteAll(ChannelTop.PKEYS.ONLINE_TIME_LASTDAY);
        UserPersistenceNumbers.updateKey(ChannelTop.PKEYS.ONLINE_TIME_DAY, ChannelTop.PKEYS.ONLINE_TIME_LASTDAY);
    }
    this.updateAllUsers();
};

/**
 * Eine Liste aller Toplists
 * @type {Array}
 */
ChannelTop.prototype.lists = [

    //user liste
    '_°BB>_hmessages|/channeltop "<°_',
    '_°BB>_hmosttext|/channeltop "<°_',

    '_°BB>_honline|/channeltop "<°_',
    '_°BB>_honline day|/channeltop "<°_',
    '_°BB>_honline week|/channeltop "<°_',
    '_°BB>_honline month|/channeltop "<°_',
    '_°BB>_honline year|/channeltop "<°_',
    '_°BB>_honline lastday|/channeltop "<°_',
    '_°BB>_honline lastweek|/channeltop "<°_',
    '_°BB>_honline lastmonth|/channeltop "<°_',
    '_°BB>_honline lastyear|/channeltop "<°_',



    //cm liste
    '_°BB>_honline cm|/channeltop "<°_',
    '_°BB>_honline day cm|/channeltop "<°_',
    '_°BB>_honline week cm|/channeltop "<°_',
    '_°BB>_honline month cm|/channeltop "<°_',
    '_°BB>_honline year cm|/channeltop "<°_',

    //info
    '_°BB>_hstats|/channeltop "<°_'
];

/**
 * wird aufgerufen wenn die App herunterfahren wird
 */
ChannelTop.prototype.onShutdown = function() {
    //bevor wir herunterfahren aktualisieren wir erst alle user
    this.updateAllUsers();
};

ChannelTop.prototype.onDeactivated = function() {
    this.unregisterCommand("channeltop");

    //bevor wir herunterfahren aktualisieren wir erst alle user
    this.updateAllUsers();
};

/**
 * Aktualisiert die Onlinezeiten des Users
 * @param {User} user
 */
ChannelTop.prototype.updateOnlinetime = function(user) {
    if(!user.getPersistence().hasNumber(ChannelTop.PKEYS.JOIN_TIME))
        return;

    var jtime = user.getPersistence().getNumber(ChannelTop.PKEYS.JOIN_TIME);
    var now = Date.now();
    var elapsed = now - jtime;
    if(elapsed > 0) {
        user.getPersistence().addNumber(ChannelTop.PKEYS.ONLINE_TIME, elapsed);
        user.getPersistence().addNumber(ChannelTop.PKEYS.ONLINE_TIME_DAY, elapsed);
        user.getPersistence().addNumber(ChannelTop.PKEYS.ONLINE_TIME_WEEK, elapsed);
        user.getPersistence().addNumber(ChannelTop.PKEYS.ONLINE_TIME_MONTH, elapsed);
        user.getPersistence().addNumber(ChannelTop.PKEYS.ONLINE_TIME_YEAR, elapsed);
    }
    user.getPersistence().setNumber(ChannelTop.PKEYS.JOIN_TIME, now)
};


/**
 * Wird aufgerufen wenn ein User den Channel betritt.
 * @param {User} user
 */
ChannelTop.prototype.onUserJoined = function(user) {
    user.getPersistence().setNumber(ChannelTop.PKEYS.JOIN_TIME, Date.now());

    //Willkommensnachricht
    if(user.getPersistence().getNumber(ChannelTop.PKEYS.JOIN_MESSAGE,1)==1) {
        var onlinetime = user.getPersistence().getNumber(ChannelTop.PKEYS.ONLINE_TIME,0);
        if(onlinetime>0) {
            user.sendPrivateMessage(App.defaultColor + "Hallo, du hast bereits " + this.timeToString(onlinetime) + " in diesem Channel verbracht.");
        } else {
            user.sendPrivateMessage(App.defaultColor + "Hallo, dies ist dein erster Besuch in diesem Channel.");
        }
    }
};


/**
 * Wird aufgerufen wenn ein User den Channel betritt.
 * @param {User} user
 */
ChannelTop.prototype.onUserLeft = function(user) {
    this.updateOnlinetime(user);
    user.getPersistence().deleteNumber(ChannelTop.PKEYS.JOIN_TIME);
};



/**
 * Aktualisiert alle User
 */
ChannelTop.prototype.updateAllUsers = function() {
    UserPersistenceNumbers.each(ChannelTop.PKEYS.JOIN_TIME,function(user, value, index, totalCount, key) {
        ChannelTop.self.updateOnlinetime(user);
    });
};



/**
 * Zeigt die bestenliste für die Liste an
 * @param {User} user
 * @param {string} list
 */
ChannelTop.prototype.bestlistOnlineCM = function(user, list) {
    var date = new Date();
    var avgMulti = 1;
    var keyname = "";
    var listheader = App.defaultColor + "";
    switch(list) {
        case "online cm":
            keyname = ChannelTop.PKEYS.ONLINE_TIME;
            listheader += "Folgende CMs waren am längsten in diesem Channel online:";
            break;
        case "online day cm":
            keyname = ChannelTop.PKEYS.ONLINE_TIME_DAY;
            listheader += "Folgende CMs waren Heute am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfDay();
            break;
        case "online week cm":
            keyname = ChannelTop.PKEYS.ONLINE_TIME_WEEK;
            listheader += "Folgende CMs waren diese Woche am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfWeek();
            break;
        case "online month cm":
            keyname = ChannelTop.PKEYS.ONLINE_TIME_MONTH;
            listheader += "Folgende CMs waren diesen Monat am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfMonth();
            break;
        case "online year cm":
            keyname = ChannelTop.PKEYS.ONLINE_TIME_YEAR;
            listheader += "Folgende CMs waren dieses Jahr am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfYear();
            break;
    }
    if(listheader!="") {
        var cms = KnuddelsServer.getChannel().getChannelConfiguration().getChannelRights().getChannelModerators();
        cms = cms.sort(
            /**
             *
             * @param {User} a
             * @param {User} b
             * @returns {number}
             */
            function(a, b){
            return b.getPersistence().getNumber(keyname, 0) - a.getPersistence().getNumber(keyname, 0);
        });
        var sum = 0;
        var message = "°RR20°_" + listheader + "°r°_";
        for(var i = 0; i < cms.length; i++) {
            var tUser = cms[i];
            var tTime = tUser.getPersistence().getNumber(keyname,0);
            sum += tTime;
            var tPlace = i+1;
            message += "°#r°"+App.defaultColor+ "" + (tPlace<10?"  "+tPlace:tPlace) + ". "
            + (tUser.getUserId() == user.getUserId() ? "°BB°" + tUser.getProfileLink() +"°r°":tUser.getProfileLink()) +
            ""+App.defaultColor+ " mit " + this.timeToString(tTime) + ".";
        }
        if(avgMulti != 1) {
            var avg = sum * avgMulti;
            message += "°#r°°#r°"+App.defaultColor+ "Im Durschnitt waren " + avg.toFixed(2) + " CMs anwesend.";
        }

        user.sendPrivateMessage(message);
    }
};



/**
 * Zeigt die bestenliste für die Liste an
 * @param {User} user
 * @param {string} list
 */
ChannelTop.prototype.bestlistText = function(user, list) {
    var keyname = "";
    var listheader = App.defaultColor + "";
    var message = "";
    if(list == "messages") {
        keyname += ChannelTop.PKEYS.MESSAGE_COUNT;
        listheader += "Folgende User haben die meisten Nachrichten verfasst:";
        var entries = UserPersistenceNumbers.getSortedEntries(keyname, { ascending: false, count: 30 });
        var message = "°RR20°_" + listheader + "°r°_";
        for(var i = 0; i < entries.length; i++) {
            var tUser = entries[i].getUser();
            var tMessages = entries[i].getValue();
            var tPlace = i+1;
            message += "°#r°"+App.defaultColor+ "" + (tPlace<10?"  "+tPlace:tPlace) + ". "
            + (tUser.getUserId() == user.getUserId() ? "°BB°" + tUser.getProfileLink() +"°r°":tUser.getProfileLink()) +
            ""+App.defaultColor+ " mit " + tMessages + " Nachrichten.";
        }

    } else if(list == "mosttext") {
        keyname += ChannelTop.PKEYS.MESSAGE_CHARS;
        listheader += "Folgende User haben den meisten Text geschrieben";
        var entries = UserPersistenceNumbers.getSortedEntries(keyname, { ascending: false, count: 30 });
        var message = "°RR20°_" + listheader + "°r°_";
        for(var i = 0; i < entries.length; i++) {
            var tUser = entries[i].getUser();
            var tMessages = entries[i].getValue();
            var tPlace = i+1;
            var avg = tUser.getPersistence().getNumber(ChannelTop.PKEYS.MESSAGE_CHARAVG);
            message += "°#r°"+App.defaultColor+ "" + (tPlace<10?"  "+tPlace:tPlace) + ". "
            + (tUser.getUserId() == user.getUserId() ? "°BB°" + tUser.getProfileLink() +"°r°":tUser.getProfileLink()) +
            ""+App.defaultColor+ " mit " + tMessages + " Zeichen (\u00D8"+avg+").";
        }

    }
    if(listheader == "")
        return;




    user.sendPrivateMessage(message);
};

/**
 * Zeigt die bestenliste für die Liste an
 * @param {User} user
 * @param {string} list
 */
ChannelTop.prototype.bestlistOnline = function(user, list) {
    var keyname = "";
    var listheader = App.defaultColor + "";
    var avgMulti = 1;
    var date = new Date();
    switch(list) {
        case "online":
            keyname += ChannelTop.PKEYS.ONLINE_TIME;
            listheader += "Folgende User waren am längsten in diesem Channel online:";
            break;
        case "online day":
            keyname += ChannelTop.PKEYS.ONLINE_TIME_DAY;
            listheader += "Folgende User waren Heute am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfDay();
            break;
        case "online week":
            keyname += ChannelTop.PKEYS.ONLINE_TIME_WEEK;
            listheader += "Folgende User waren diese Woche am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfWeek();
            break;
        case "online month":
            keyname += ChannelTop.PKEYS.ONLINE_TIME_MONTH;
            listheader += "Folgende User waren diesen Monat am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfMonth();
            break;
        case "online year":
            keyname += ChannelTop.PKEYS.ONLINE_TIME_YEAR;
            listheader += "Folgende User waren dieses Jahr am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfYear();
            break;
        case "online lastday":
            keyname += ChannelTop.PKEYS.ONLINE_TIME_LASTDAY;
            listheader += "Folgende User waren Gestern am längsten in diesem Channel online:";
            avgMulti = 1.0/(86400*1000);
            break;
        case "online lastweek":
            keyname += ChannelTop.PKEYS.ONLINE_TIME_LASTWEEK;
            listheader += "Folgende User waren letzte Woche am längsten in diesem Channel online:";
            avgMulti = 1.0/(86400*1000*7);
            break;
        case "online lastmonth":
            keyname += ChannelTop.PKEYS.ONLINE_TIME_LASTMONTH;
            listheader += "Folgende User waren letzten Monat am längsten in diesem Channel online:";
            avgMulti = 1.0/(86400*1000*30);
            break;
        case "online lastyear":
            keyname += ChannelTop.PKEYS.ONLINE_TIME_LASTYEAR;
            listheader += "Folgende User waren letztes Jahr am längsten in diesem Channel online:";
            avgMulti = 1.0/(86400*1000*365)
            break;


    }
    if(listheader == "")
        return;

    var entries = UserPersistenceNumbers.getSortedEntries(keyname, { ascending: false, count: 30 });
    var message = "°RR20°_" + listheader + "°r°_";
    for(var i = 0; i < entries.length; i++) {
        var tUser = entries[i].getUser();
        var tTime = entries[i].getValue();
        var tPlace = i+1;
        message += "°#r°"+App.defaultColor+ "" + (tPlace<10?"  "+tPlace:tPlace) + ". "
        + (tUser.getUserId() == user.getUserId() ? "°BB°" + tUser.getProfileLink() +"°r°":tUser.getProfileLink()) +
        ""+App.defaultColor+ " mit " + this.timeToString(tTime) + ".";
    }
    if(avgMulti != 1) {
        var avg = UserPersistenceNumbers.getSum(keyname) * avgMulti;
        message += "°#r°°#r°"+App.defaultColor+ "Im Durschnitt waren " + avg.toFixed(2) + " User anwesend.";
    }

    user.sendPrivateMessage(message);
};


/**
 * Wandelt die Zeit in Millisekunden in einen lesbaren Text um.
 * @param {number} time
 * @returns {string}
 */
ChannelTop.prototype.timeToString = function(time) {
    var t_milli = time%1000;
    time = Math.floor(time/1000);

    var t_sec = time%60;
    time = Math.floor(time/60);

    var t_min = time%60;
    time = Math.floor(time/60);

    var t_hour = time%24;
    var t_day = Math.floor(time/24);

    var str = "";
    if(t_day > 0) {
        str += (t_day==1?"1 Tag":t_day + " Tage") + ", ";
    }
    if(t_hour > 0) {
        str += (t_hour==1?"1 Stunde":t_hour + " Stunden") + ", ";
    }
    if(t_min > 0) {
        str += (t_min==1?"1 Minute":t_min + " Minuten") + ", ";
    }
    str += (t_sec==1?"1 Sekunde":t_sec + " Sekunden");


    return str
};


/**
 *
 * @param {User} user
 */
ChannelTop.prototype.showStats = function (user) {
    var date = new Date();
    var message = "°RR°_ChannelTop Statistik zu " + KnuddelsServer.getChannel().getChannelName().escapeKCode() + "_";
    message += "°#r°"+App.defaultColor+ "_Anzahl Besucher:_ " + UserPersistenceNumbers.getCount(ChannelTop.PKEYS.ONLINE_TIME);
    message += "°#r°"+App.defaultColor+ "_Anzahl Besucher (TAG):_ " + UserPersistenceNumbers.getCount(ChannelTop.PKEYS.ONLINE_TIME_DAY).number_format(0,"",".") + " (\u00D8" + (UserPersistenceNumbers.getSum(ChannelTop.PKEYS.ONLINE_TIME_DAY)*(1/date.getMillisecondsOfDay())).toFixed(2)+")";
    message += "°#r°"+App.defaultColor+ "_Anzahl Besucher (WOCHE):_ " + UserPersistenceNumbers.getCount(ChannelTop.PKEYS.ONLINE_TIME_WEEK).number_format(0,"",".") + " (\u00D8" + (UserPersistenceNumbers.getSum(ChannelTop.PKEYS.ONLINE_TIME_WEEK)*(1/date.getMillisecondsOfWeek())).toFixed(2)+")";
    message += "°#r°"+App.defaultColor+ "_Anzahl Besucher (MONAT):_ " + UserPersistenceNumbers.getCount(ChannelTop.PKEYS.ONLINE_TIME_MONTH).number_format(0,"",".") + " (\u00D8" + (UserPersistenceNumbers.getSum(ChannelTop.PKEYS.ONLINE_TIME_MONTH)*(1/date.getMillisecondsOfMonth())).toFixed(2)+")";
    message += "°#r°"+App.defaultColor+ "_Anzahl Besucher (JAHR):_ " + UserPersistenceNumbers.getCount(ChannelTop.PKEYS.ONLINE_TIME_YEAR).number_format(0,"",".") + " (\u00D8" + (UserPersistenceNumbers.getSum(ChannelTop.PKEYS.ONLINE_TIME_YEAR)*(1/date.getMillisecondsOfYear())).toFixed(2)+")";



    user.sendPrivateMessage(message);
};
/**
 * Unsere /channeltop Funktion
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
ChannelTop.prototype.cmdChanneltop = function(user, params, func) {
    var action = params.trim().toLowerCase();

    if(action == "stats") {
        this.showStats(user);
        return;
    }
    if(action == "welcomemessage") {
        var status = 1 - user.getPersistence().getNumber(ChannelTop.PKEYS.JOIN_MESSAGE,1); //toggle der joinmessage
        user.getPersistence().setNumber(ChannelTop.PKEYS.JOIN_MESSAGE, status);
        user.sendPrivateMessage(App.defaultColor + "Du hast die Willkommensnachricht " + (status==0?"deaktiviert":"aktiviert") + ".");
        return;
    }
    if(action == "online"   || action == "online day" || action == "online week" || action == "online month" || action == "online year"
                            ||  action == "online lastday" || action == "online lastweek" || action == "online lastmonth" || action == "online lastyear") {
        return this.bestlistOnline(user, action);
    }
    if(action == "online cm" || action == "online day cm" || action == "online week cm" || action == "online month cm" || action == "online year cm") {
        return this.bestlistOnlineCM(user, action);
    }
    if(action == "messages" || action == "mosttext") {
        return this.bestlistText(user, action);
    }


    user.sendPrivateMessage("°RR°_Folgende Listen existieren:°r°_°#r°" + this.lists.join("°r°, "));
};









/**
 * Speichere die eigene Instanz
 * @type {ChannelTop}
 */
ChannelTop.self = new ChannelTop;