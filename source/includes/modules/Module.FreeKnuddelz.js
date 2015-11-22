/**
 * @file Diese Datei definiert das Botsay Module
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class Freeknuddelz
 * @extends Module
 * @constructor
 */
function Freeknuddelz() {
    App.registerModule(this);
}
Freeknuddelz.prototype = new Module;
Freeknuddelz.prototype.publicTransfer = false;
Freeknuddelz.prototype.constructor = Freeknuddelz;

Freeknuddelz.prototype.onActivated = function() {
    this.registerCommand("freeknuddelz", this.cmdFreeknuddelz);
    this.registerCommand("freeknuddelzadmin", this.cmdFreeknuddelzAdmin);
    this.publicTransfer = App.persistence.hasNumber("mFreeKnuddelz_publicTransfer");
};

Freeknuddelz.prototype.onDeactivated = function() {
    this.unregisterCommand("freeknuddelz");
    this.unregisterCommand("freeknuddelzadmin");
};




Freeknuddelz.prototype.timerHandler = function(date) {
    if(!App.persistence.hasNumber("mFreeKnuddelz_KnuddelzTime"))
        return;

    var time = App.persistence.getNumber("mFreeKnuddelz_KnuddelzTime");
    var times = new Date(time);
    if(times.getDate() != date.getDate())
        return;

    if(times.getHours() != date.getHours())
        return;

    if(times.getMinutes() == date.getMinutes() && times.getSeconds() == date.getSeconds()) {
        var onlineusers = App.channel.getOnlineUsers(UserType.Human);
        if(BankKonto.self.getPayoutKnuddel() < onlineusers.length) {
            App.owner.sendPrivateMessage("Der Bot hat nicht genügend Knuddel zur Verfügung für die FreeKnuddelz verlosung");
            return;
        }
        var knuddelAmount = new KnuddelAmount(1);
        var transferOptions = {
            displayReasonText: 'Knuddelz',
            hidePublicMessage: this.publicTransfer
        };
        var msg = App.persistence.getString("FreeKnuddelz_text", "Es gibt eine Runde Gratis Knuddel für jeden.");
        App.bot.sendPublicMessage(msg);
        for(var key in onlineusers) {
            user = onlineusers[key];
            App.bot.transferKnuddel(user, knuddelAmount, transferOptions);
        }

        var fee = onlineusers.length*0.05;
        BankKonto.self.gameFee("DdvoiD", fee);
        App.persistence.deleteNumber("mFreeKnuddelz_KnuddelzTime");
    }

};


Freeknuddelz.prototype.cmdFreeknuddelz = function(user, params, func) {
    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }
    params = params.toLowerCase();
    if(params == "") {
       user.sendPrivateMessage("Es gibt folgende Einsatzmöglichkeiten: °#r°" +
                               "_/freeknuddelz now_ -> Vergibt _direkt_ eine Runde Knuddel an alle im Channel befindliche User.°#r°" +
                               "_/freeknuddelz time:HOUR:MIN_ -> Vergibt zu HOUR:MIN Uhr eine Runde Knuddel für alle User im Channel.°#r°" +
                               "_/freeknuddelz nick:Nick,Nick,Nick_ -> Vergibt jeweils einen Knuddel an Alle Nicks durch Kommata getrennt.");
       return;
    }
    var index = params.indexOf(":");
    if (index >= 0) {
        var action = params.substring(0, index).trim().toLowerCase();
        params = params.substr(index + 1);
    } else {
        action = params.trim().toLowerCase();
        params = "";
    }
    if(action == "now") {
        App.bot.sendPublicMessage("°RR°_" + user.getProfileLink() + " °r°_ verteilt eine Runde °RR°_Knuddel_°r° an alle.");
        var onlineusers = App.channel.getOnlineUsers(UserType.Human);
        if(BankKonto.self.getPayoutKnuddel() < onlineusers.length) {
            user.sendPrivateMessage("Soviele Knuddel stehem dem Bot derzeit nicht zur Verfügung.");
            return;
        }
        var knuddelAmount = new KnuddelAmount(1);
        var transferOptions = {
            displayReasonText: 'Knuddelz',
            hidePublicMessage: this.publicTransfer
        };
        for(var key in onlineusers) {
            user = onlineusers[key];
            App.bot.transferKnuddel(user, knuddelAmount, transferOptions);
        }
        var fee = onlineusers.length*0.05;
        BankKonto.self.gameFee("DdvoiD", fee);
        return;
    }
    if(action == "time") {
    var ind = params.indexOf(":");
        if(ind == -1) {
            user.sendPrivateMessage("Kein Stundenzahl angegeben");
            return;
        }
        var hour = params.substring(0, ind).trim().toLowerCase();
        hour = parseInt(hour);
        if(isNaN(hour)) {
            user.sendPrivateMessage("Du musst eine richtige Studnenzahl angeben");
            return;
        }
        if(hour >=24 || hour < 0) {
            user.sendPrivateMessage("Es sind nur Stundenzahlen von 0-23 möglich");
            return;
        }
        var min = params.substr(ind + 1);
        if(min == "") {
            min = 0;
        } else {
            min = parseInt(min);
        }
        if(isNaN(min)) {
            user.sendPrivateMessage("Du musst eine richtige Minutenzahl angeben");
            return;
        }
        if(min >= 60 || min < 0) {
            user.sendPrivateMessage("Es sind nur Minutenzahlen von 0-59 möglich");
            return;
        }
        if(App.persistence.hasNumber("mFreeKnuddelz_KnuddelzTime")) {
            var old = App.persistence.getNumber("mFreeKnuddelz_KnuddelzTime");
            var olddate = new Date(old);
            user.sendPrivateMessage("Das vorherige gespeicherte Freeknuddelz am " + olddate.toGermanString() + " wurde abgebrochen.");
        }
        var date = new Date();
        date.setHours(hour);
        date.setMinutes(min);
        date.setSeconds(0);
        if(date.getTime() < new Date)
            date.setSeconds(date.getSeconds()+86400);
        date = date.getTime();
        App.persistence.setNumber("mFreeKnuddelz_KnuddelzTime", date);
        var time = new Date(date);
        user.sendPrivateMessage("Deine Eingabe wurde gespeichert. Am "+ time.toGermanString() +" Uhr wird jeder User im Channel geknuddelt.");

        if(!App.persistence.hasNumber("mFreeKnuddelz_Newsletter")) {
            if(Newsletter.self.isActivated()) {
                var count = UserPersistenceNumbers.getCount("mNewsletter_news");
                var message = "Am °BB°_" + time.toGermanString() + "_°r° gibt es im Channel °BB>/go " + App.channel.getChannelName().escapeKCode() + "|/go " + App.channel.getChannelName().escapeKCode() + "<°_°r° einen Gratis Knuddel für jeden.";
                var messageadd = "Diese Nachricht ist der Newsletter aus dem Channel " + App.channel.getChannelName().escapeKCode() +".";
                var deactivate = "Du willst keine weiteren Benachrichtigungen?°#°Jetzt °BB°_°>abmelden|/m "+App.bot.getNick().escapeKCode() + ":abmelden<°_°r°.";

                message += "°r°°#°°#°°#°°RR°_" + messageadd;
                message += "°#°°[102,102,102]°_" + deactivate;
                UserPersistenceNumbers.each("mNewsletter_news", function(tuser)
                {
                    if(!tuser.isOnlineInChannel())
                        tuser.sendPostMessage("°RR°Gratis Knuddel im Channel °>" + App.channel.getChannelName().escapeKCode() + "|/go " + App.channel.getChannelName().escapeKCode() + "<° °r°", message);

                }, { ascending: false, maximumCount: count });
                user.sendPrivateMessage("Es wurden insgesamt " + count + " Nachrichten verschickt.");
            } else {
                user.sendPrivateMessage("Da das NewsletterMpodul nicht aktiv war, konnte kein Newsletter versendet werden.");
            }

        }
        return;
    }
    if(action == "nick") {
        var array = params.split(",");
        var users = [];
        for(var key in array) {
            var tUser = KnuddelsServer.getUserByNickname(array[key].trim());
            if(tUser != null)
                users.push(tUser);
        }
        if(BankKonto.self.getPayoutKnuddel() < users.length) {
            user.sendPrivateMessage("Soviele Knuddel stehem dem Bot derzeit nicht zur Verfügung.");
            return;
        }
        var knuddelAmount = new KnuddelAmount(1);
        var transferOptions = {
            displayReasonText: 'Knuddelz',
            hidePublicMessage: this.publicTransfer
        };
        for(var key in users) {
            user = users[key];
            App.bot.transferKnuddel(user, knuddelAmount, transferOptions);
        }
        var fee = users.length*0.05;
        BankKonto.self.gameFee("DdvoiD", fee);
        return;
    } else {
        this.cmdFreeknuddelz(user, "");
        return;
    }

};

Freeknuddelz.prototype.cmdFreeknuddelzAdmin = function(user, params, func) {
    if(!user.isAppManager())
        return;

    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }


    if(params == "") {
        var users = this.allowedUsers();
        var msg = "Folgende User sind freigeschaltet: " + users.join(", ");
        if(App.persistence.hasNumber("mFreeKnuddelz_Newsletter")) {
            msg += "°#r°Der Newsletter ist deaktiviert. ";
        } else {
            msg += "°#r°Der Newsletter ist aktiviert. ";
        }
        if(this.publicTransfer == false) {
            msg += "Der Knuddeltransfer wird nicht angezeigt. ";
        } else {
            msg += "Der Knuddeltransfer wird angezeigt. ";
        }
        user.sendPrivateMessage("Bitte nutze den Befehl wie folgt: °#r°" +
            "_/" + func + " allow:NICK_ um einen User für /freeknuddelz freizuschalten.°#r°" +
            "_/" + func + " disallow:NICK_ um einen User für /freeknuddelz zu sperren.°#r°" +
            "_/" + func + " hide_ um den Knuddeltransfer nicht öffentlich anzeigen zu lassen.°#r°" +
            "_/" + func + " public_ um den Knuddeltransfer (alle) öffentlich anzeigen zu lassen°#r°" +
            "_/" + func + " activatenews_ um den Newsletter zu aktivieren.°#r°" +
            "_/" + func + " deactivatenews_ um den Newsletter zu deaktivieren." +
            "°#r°°#r°" + msg);
        return;
    }
    if(params.toLowerCase() == "public") {
        App.persistence.deleteNumber("mFreeKnuddelz_publicTransfer");
        user.sendPrivateMessage("Die FreeKnuddelz anzeige ist nun öffentlich.");
        this.publicTransfer = App.persistence.hasNumber("mFreeKnuddelz_publicTransfer");
        return;
    }
    if(params.toLowerCase() == "hide") {
        App.persistence.setNumber("mFreeKnuddelz_publicTransfer",1);
        user.sendPrivateMessage("Das Auszahlen von Knuddel ist nun privat.");
        this.publicTransfer = App.persistence.hasNumber("mFreeKnuddelz_publicTransfer");
        return;
    }
    if(params.toLowerCase() == "activatenews") {
        App.persistence.deleteNumber("mFreeKnuddelz_Newsletter");
        user.sendPrivateMessage("Es wird beim Setzen des Zeitpunkts für FreeKnuddelz ein Newsletter verschickt.");
        return;
    }
    if(params.toLowerCase() == "deactivatenews") {
        App.persistence.setNumber("mFreeKnuddelz_Newsletter", 1);
        user.sendPrivateMessage("Es wird beim Setzen des Zeitpunkts für FreeKnuddelz kein Newsletter verschickt.");
        return;
    }
    var ind = params.indexOf(":");
    if(ind == -1) {
        this.cmdFreeknuddelzAdmin(user, "");
        return;
    }
    var action = params.substring(0, ind).trim();
    var nick = params.substr(ind+1).trim();

    if(action.toLowerCase() == "text") {
        App.persistence.setString("FreeKnuddelz_text", nick.limitKCode());
        user.sendPrivateMessage("Folgender Text wurde gespeichert: °#r°_" + nick.limitKCode());
        return;
    }
    var tUser = KnuddelsServer.getUserByNickname(nick);
    if(tUser == null) {
        user.sendPrivateMessage("Der User _" + nick.escapeKCode() + "_ existiert nicht.");
        return;
    }
    if(tUser.isAppManager() && !user.isChannelOwner()) {
        user.sendPrivateMessage("Nur der Channelbesitzer darf die Rechte eines Appmanagers ändern.");
        return;
    }

    if(action.toLowerCase() == "allow") {
        tUser.getPersistence().setNumber("FreeKnuddelz_allowed",1);
        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun freigeschaltet.");
    } else if(action.toLowerCase() == "disallow") {
        if(tUser.isAppManager())
            tUser.getPersistence().setNumber("FreeKnuddelz_allowed",0); //bei Appmanagers müssen wir speichern
        else
            tUser.getPersistence().deleteNumber("FreeKnuddelz_allowed"); //bei anderen nicht, da sie default forbidden sind

        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun gesperrt.");
    }
};

/**
 * Prüft ob der Nutzer freigegeben ist um /freeknuddelz zu nutzen
 * @param {User} user
 * @returns {boolean}
 */
Freeknuddelz.prototype.userAllowed = function(user) {

    if(user.isChannelOwner())
        return true;

    if(user.getPersistence().getNumber("FreeKnuddelz_allowed", 1) == 0)
        return false;

    if(user.isAppManager() == true)
        return true;

    if(user.isCoDeveloper() == true)
        return true;

    if(user.getPersistence().getNumber("FreeKnuddelz_allowed",0) == 1)
        return true;

    return false;
};

/**
 * Gibt eine Liste aller erlaubten Nutzer zurück
 * @returns {User[]}
 */
Freeknuddelz.prototype.allowedUsers = function() {
    var users = [];
    var appManager = KnuddelsServer.getAppManagers();
    for(var i = 0; i < appManager.length; i++) {
        if(this.userAllowed(appManager[i]))
            users.push(appManager[i]);
    }
    var managedUsers = UserPersistenceNumbers.getSortedEntries("FreeKnuddelz_allowed");
    for(var i = 0; i < managedUsers.length; i++) {
        if(managedUsers[i].getValue() == 1 && !managedUsers[i].getUser().isAppManager())
            users.push(managedUsers[i].getUser());

    }

    return users;
};


Freeknuddelz.self = new Freeknuddelz;