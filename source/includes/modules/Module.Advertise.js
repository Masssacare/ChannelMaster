/**
 * @file Diese Datei definiert das Advertise Module
 * @author KnuddelsTools
 * @author DdvOiD
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class Advertise
 * @extends Module
 * @constructor
 */
function Advertise() {
    App.registerModule(this);
};

Advertise.prototype = new Module;
Advertise.prototype.constructor = Advertise;


Advertise.prototype.setText = function(arr) {
   App.persistence.setString("mAdvertise_text", JSON.stringify(arr));
};

Advertise.prototype.getText = function() {
   if(!App.persistence.hasString("mAdvertise_text"))
    return [];

    return JSON.parse(App.persistence.getString("mAdvertise_text"));
};

Advertise.prototype.onActivated = function() {
    this.registerCommand("advertise", this.cmdAdvertise);
    this.registerCommand("advertiseadmin", this.cmdAdvertiseAdmin);
    this.registerCommand("advertisetime", this.cmdAdvertiseTime);
    this.registerCommand("deadvertise", this.cmdDeadvertise);
};

Advertise.prototype.onDeactivated = function() {
    this.unregisterCommand("advertise");
    this.unregisterCommand("advertiseadmin");
    this.unregisterCommand("advertisetime");
    this.unregisterCommand("deadvertise");
};

/**
 *
 * @param {Date} date
 */
Advertise.prototype.timerHandler = function (date) {
    var tstamp = Math.floor(date.getTime()/1000);
    var modulo = 60*App.persistence.getNumber("mAdvertise_time", 10);
    if(tstamp % modulo == 0) {
        this.post();
    }
};


/**
 * Funktion für die Textausgabe
 */
Advertise.prototype.post = function() {
    var texte = this.getText();
    if(texte.length==0)
        return;
    var rndm = RandomOperations.getRandomObject(texte);
    App.sendPublicMessage(rndm);
};


/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Advertise.prototype.cmdAdvertise = function(user, params, func) {
    var texte = this.getText();
       if(!this.userAllowed(user)) {
            user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
            return;
        }
    if(params == "list") {
        var message = "°BB18°_Die Folgenden Texte sind derzeit gespeichert§";
        for(var key in texte) {

            var text = texte[key];
            if(typeof text != "string")
                continue;
            message += "°#°"+ text + " °>Entfernen|/deadvertise "+ key +"<°" ;
        }
        user.sendPrivateMessage(message);

        return;
    }

    texte.push(params.limitKCode());
    user.sendPrivateMessage(texte.toSource().escapeKCode());
    this.setText(texte);
    user.sendPrivateMessage("Der nachfolgende Text wurde gespeichert:°#°"+ params);
};


/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Advertise.prototype.cmdAdvertiseAdmin = function(user, params, func) {
        if(!user.isAppManager())
            return;

        if(!this.userAllowed(user)) {
            user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
            return;
        }
    if(params == "list") {
        var message = "BB18°_Folgende Funktionen gibt es:§";
        message += "°#°_/advertise TEXT_ -> Speichert TEXT für die Ausgabe.";
        message += "°#°_/advertisetime ZAHL_ -> Setzt die Zeitspanne zwischen den Nachrichten in Minuten fest.";
        message += "°#°_/deadvertise ZAHL -> Löscht den Eintrag ZAHL aus der Variable und rückt den rest ein. ";
        message += "°#°_/advertiseadmin allow:NICK_ -> um einen User freizuschalten.";
        message += "°#°_/advertiseadmin disallow:NICK_ -> um einen User zu sperren.";
        message += "°#°_/advertiseadmin list_ -> Funktionsübersicht anzeigen.";

        user.sendPrivateMessage(message);

        if (params == "") {
            var users = this.allowedUsers();
            user.sendPrivateMessage("Folgende User sind freigeschaltet: " + users.join(", "));
        }
        var ind = params.indexOf(":");
        if (ind == -1) {
            user.sendPrivateMessage("Bitte nutze den Befehl wie folgt: °#°" +
                "_/" + func + " allow:NICK_ -> um einen User freizuschalten.°#°" +
                "_/" + func + " disallow:NICK_ -> um einen User zu sperren.°#°" +
                "_/" + func + " list_ -> Funktionsübersicht anzeigen.");
            return;
        }
        var action = params.substring(0, ind).trim();
        var nick = params.substr(ind+1).trim();

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
            tUser.getPersistence().setNumber("mAdvertise_allow",1);
            user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun freigeschaltet.");


        } else if(action.toLowerCase() == "disallow") {
            if(tUser.isAppManager())
                tUser.getPersistence().setNumber("mAdvertise_allow",0); //bei Appmanagers müssen wir speichern
            else
                tUser.getPersistence().deleteNumber("mAdvertise_allow"); //bei anderen nicht, da sie Standardmäßig nicht dürfen

            user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun gesperrt.");
        }
    }
};

/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Advertise.prototype.cmdAdvertiseTime = function(user, params, func) {
    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }
        if (params == "") {
            user.sendPrivateMessage("Du musst auch eine Zahl angeben.");
        }

        try {
            if (!isNaN( parseFloat(params))) {
                var numbers = params;
            }
        } catch (e) {

        }
            var intn = parseInt(numbers) || 0;
            if(intn <= 0) {
                user.sendPrivateMessage("Die minimale Zeitspanne liegt bei 1 Minute.");
           }
            else {
                App.persistence.setNumber("mAdvertise_time", intn);
                user.sendPrivateMessage("Die Zeitspanne zwischen den Texten wurde auf " + intn + " "+ (intn==1?"Minute":"Minuten") + " gesetzt");
            }
};

/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Advertise.prototype.cmdDeadvertise = function(user, params, func) {
           if(!this.userAllowed(user)) {
                user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
                return;
            }
                var texte = this.getText();
                if(typeof texte[params] == "undefined") {
                    user.sendPrivateMessage("Der von dir eingegebene Paramater existiert nicht.");
                    return;
                }
                texte = texte.remove(params);
                this.setText(texte);
                this.cmdAdvertise(user, "list");

};


/**
 * Prüft ob der Nutzer freigegeben ist um Daten zu ändern
 * @param {User} user
 * @returns {boolean}
 */
Advertise.prototype.userAllowed = function(user) {

    if(user.getPersistence().getNumber("mAdvertise_allowed", 1) == 0)
        return false;

    if(user.isAppManager() == true)
        return true;

    if(user.getPersistence().getNumber("mAdvertise_allowed", 0) == 1)
        return true;

    return false;
};

/**
 * Gibt eine Liste aller erlaubten Nutzer zurück
 * @returns {User[]}
 */
Advertise.prototype.allowedUsers = function() {
    var users = [];
    var appManager = KnuddelsServer.getAppManagers();
    for(var i = 0; i < appManager.length; i++) {
        if(this.userAllowed(appManager[i]))
            users.push(appManager[i]);
    }
    var managedUsers = UserPersistenceNumbers.getSortedEntries("mAdvertise_allowed");
    for(var i = 0; i < managedUsers.length; i++) {
        if(managedUsers[i].getValue() == 1)
            users.push(managedUsers[i].getUser());

    }

    return users;
};


Advertise.self = new Advertise;
