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






ChannelTop.prototype.onActivated = function() {
    App.chatCommands.channeltop = this.cmdChanneltop;
    KnuddelsServer.refreshHooks();

    //löschen wir erstmal alle jointimes < wir wissen nicht wielange die app aus war
    UserPersistenceNumbers.deleteAll("mChannelTop_jointime");

    //gebe allen Usern einen jointime
    var users = KnuddelsServer.getChannel().getOnlineUsers(UserType.Human);
    for(var i = 0; i < users.length; i++) {
        users[i].getPersistence().setNumber("mChannelTop_jointime", Date.now());
    }
};


/**
 * Timerhandler, wird jede Sekunde aufgerufen
 * @param {Date} date
 */
ChannelTop.prototype.timerHandler = function(date) {
    if(date.getSeconds() != 0)
        return; //wir brauchen nur jede Minute




    if(date.getSeconds() == 0 && date.getMinutes() == 0 && date.getHours() == 0) { //jede nacht um 0
        if(date.getDay() == 1) { //jeden Montag
            UserPersistenceNumbers.deleteAll("mChannelTop_onlinetime_week");
        }
        if(date.getDate() == 1) { //jeden Monatsersten
            UserPersistenceNumbers.deleteAll("mChannelTop_onlinetime_month");
        }
        if(date.getDate() == 1 && date.getMonth() == 0) { //jeden ersten Tag im Jahr
            UserPersistenceNumbers.deleteAll("mChannelTop_onlinetime_year");
        }
        UserPersistenceNumbers.deleteAll("mChannelTop_onlinetime_day");
    }
    this.updateAllUsers();
};

/**
 * Eine Liste aller Toplists
 * @type {Array}
 */
ChannelTop.prototype.lists = [
    '_°BB>_honline|/channeltop "<°_',
    '_°BB>_honline day|/channeltop "<°_',
    '_°BB>_honline week|/channeltop "<°_',
    '_°BB>_honline month|/channeltop "<°_',
    '_°BB>_honline year|/channeltop "<°_'
];

/**
 * wird aufgerufen wenn die App herunterfahren wird
 */
ChannelTop.prototype.onShutdown = function() {
    //bevor wir herunterfahren aktualisieren wir erst alle user
    this.updateAllUsers();
};

ChannelTop.prototype.onDeactivated = function() {
    delete App.chatCommands.channeltop;
    KnuddelsServer.refreshHooks();

    //bevor wir herunterfahren aktualisieren wir erst alle user
    this.updateAllUsers();
};

/**
 * Aktualisiert die Onlinezeiten des Users
 * @param {User} user
 */
ChannelTop.prototype.updateOnlinetime = function(user) {
    if(!user.getPersistence().hasNumber("mChannelTop_jointime"))
        return;

    var jtime = user.getPersistence().getNumber("mChannelTop_jointime");
    var now = Date.now();
    var elapsed = now - jtime;
    if(elapsed > 0) {
        user.getPersistence().addNumber("mChannelTop_onlinetime", elapsed);
        user.getPersistence().addNumber("mChannelTop_onlinetime_day", elapsed);
        user.getPersistence().addNumber("mChannelTop_onlinetime_week", elapsed);
        user.getPersistence().addNumber("mChannelTop_onlinetime_month", elapsed);
        user.getPersistence().addNumber("mChannelTop_onlinetime_year", elapsed);
    }
    user.getPersistence().setNumber("mChannelTop_jointime", now)
};


/**
 * Wird aufgerufen wenn ein User den Channel betritt.
 * @param {User} user
 */
ChannelTop.prototype.onUserJoined = function(user) {
    user.getPersistence().setNumber("mChannelTop_jointime", Date.now());

    //Willkommensnachricht
    if(user.getPersistence().getNumber("mChannelTop_joinmessage",1)==1) {
        var onlinetime = user.getPersistence().getNumber("mChannelTop_onlinetime",0);
        if(onlinetime>0) {
            user.sendPrivateMessage("Hallo, du hast bereits " + this.timeToString(onlinetime) + " in diesem Channel verbracht.");
        } else {
            user.sendPrivateMessage("Hallo, dies ist dein erster Besuch in diesem Channel.");
        }
    }
};


/**
 * Wird aufgerufen wenn ein User den Channel betritt.
 * @param {User} user
 */
ChannelTop.prototype.onUserLeft = function(user) {
    this.updateOnlinetime(user);
    user.getPersistence().deleteNumber("mChannelTop_jointime");
};



/**
 * Aktualisiert alle User
 */
ChannelTop.prototype.updateAllUsers = function() {
    UserPersistenceNumbers.each("mChannelTop_jointime",function(user, value, index, totalCount, key) {
        ChannelTop.self.updateOnlinetime(user);
    });
};

/**
 * Zeigt die bestenliste für die Liste an
 * @param {User} user
 * @param {string} list
 */
ChannelTop.prototype.bestlistOnline = function(user, list) {
    var keyname = "mChannelTop_";
    var listheader = "";
    var avgMulti = 1;
    var date = new Date();
    switch(list) {
        case "online":
            keyname += "onlinetime";
            listheader += "Folgende User waren am längsten in diesem Channel online:";
            break;
        case "online day":
            keyname += "onlinetime_day";
            listheader += "Folgende User waren Heute am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfDay();
            break;
        case "online week":
            keyname += "onlinetime_week";
            listheader += "Folgende User waren diese Woche am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfWeek();
            break;
        case "online month":
            keyname += "onlinetime_month";
            listheader += "Folgende User waren diesen Monat am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfMonth();
            break;
        case "online year":
            keyname += "onlinetime_year";
            listheader += "Folgende User waren dieses Jahr am längsten in diesem Channel online:";
            avgMulti = 1.0/date.getMillisecondsOfYear();
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
        message += "°#°" + (tPlace<10?"  "+tPlace:tPlace) + ". "
        + (tUser == user ? "°BB°" + tUser.getProfileLink() +"°r°":tUser.getProfileLink()) +
        " mit " + this.timeToString(tTime) + ".";
    }
    if(avgMulti != 1) {
        var avg = UserPersistenceNumbers.getSum(keyname) * avgMulti;
        message += "°#°°#°Im Durschnitt waren " + avg.toFixed(2) + " User anwesend.";
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
 * Unsere /channeltop Funktion
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
ChannelTop.prototype.cmdChanneltop = function(user, params, func) {
    if(this != ChannelTop.self)
        return ChannelTop.self.cmdChanneltop(user, params, func); // /befehle haben als this das App Objekt, also rufen wir die Funktion intern nochmal auf.

    var action = params.trim().toLowerCase();
    if(action == "welcomemessage") {
        var status = 1 - user.getPersistence().getNumber("mChannelTop_joinmessage",1); //toggle der joinmessage
        user.getPersistence().setNumber("mChannelTop_joinmessage", status);
        user.sendPrivateMessage("Du hast die Willkommensnachricht " + (status==0?"deaktiviert":"aktiviert") + ".");
        return;
    }
    if(action == "online" || action == "online day" || action == "online week" || action == "online month" || action == "online year") {
        return this.bestlistOnline(user, action);
    }


    user.sendPrivateMessage("°RR°_Folgende Listen existieren:°r°_°#°" + this.lists.join("°r°, "));
};









/**
 * Speichere die eigene Instanz
 * @type {ChannelTop}
 */
ChannelTop.self = new ChannelTop;