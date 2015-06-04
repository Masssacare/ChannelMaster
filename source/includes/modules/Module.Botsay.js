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
 * @class Botsay
 * @extends Module
 * @constructor
 */
function Botsay() {
    App.registerModule(this);
};
Botsay.prototype = new Module;
Botsay.prototype.constructor = Botsay;

Botsay.prototype.onActivated = function() {
    this.registerCommand("botsay", this.cmdBotsay);
    this.registerCommand("botsayadmin", this.cmdBotsayAdmin);
};

Botsay.prototype.onDeactivated = function() {
    this.unregisterCommand("botsay");
    this.unregisterCommand("botsayadmin");
};

/**
 * Mit diesem Befehl kann man öffentlich als Bot schreiben
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Botsay.prototype.cmdBotsay = function(user, params, func) {
    var msg = params.limitKCode();
    if(msg.trim().length == 0)
        return;

    if(this.userAllowed(user)) {
        KnuddelsServer.getDefaultBotUser().sendPublicMessage(msg);
    }
};

/**
 * Prüft ob der Nutzer freigegeben ist um /botsay zu nutzen
 * @param {User} user
 * @returns {boolean}
 */
Botsay.prototype.userAllowed = function(user) {

    if(user.getPersistence().getNumber("mBotsay_allowed", 1) == 0)
        return false;

    if(user.isAppManager() == true)
        return true;

    if(user.isCoDeveloper() == true)
        return true;

    if(user.getPersistence().getNumber("mBotsay_allowed",0) == 1)
        return true;

    return false;
};

/**
 * Gibt eine Liste aller erlaubten Nutzer zurück
 * @returns {User[]}
 */
Botsay.prototype.allowedUsers = function() {
    var users = [];
    var appManager = KnuddelsServer.getAppManagers();
    for(var i = 0; i < appManager.length; i++) {
        if(this.userAllowed(appManager[i]))
            users.push(appManager[i]);
    }
    var managedUsers = UserPersistenceNumbers.getSortedEntries("mBotsay_allowed");
    for(var i = 0; i < managedUsers.length; i++) {
        if(managedUsers[i].getValue() == 1)
            users.push(managedUsers[i].getUser());

    }

    return users;
};

/**
 * Mit diesem Befehl können User für Botsay freigegeben und entfernt werden
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Botsay.prototype.cmdBotsayAdmin = function(user, params, func) {
    if(!user.isAppManager())
        return;

    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }


    if(params == "") {
        var users = this.allowedUsers();
        user.sendPrivateMessage("Folgende User sind freigeschaltet: " + users.join(", "));
    }

    var ind = params.indexOf(":");
    if(ind == -1) {
        user.sendPrivateMessage("Bitte nutze den Befehl wie folgt: °#°" +
        "_/" + func + " allow:NICK_ um einen User für /botsay freizuschalten.°#°" +
        "_/" + func + " disallow:NICK_ um einen User für /botsay zu sperren.");
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
       tUser.getPersistence().setNumber("mBotsay_allowed",1);
        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun freigeschaltet.");
    } else if(action.toLowerCase() == "disallow") {
        if(tUser.isAppManager())
            tUser.getPersistence().setNumber("mBotsay_allowed",0); //bei Appmanagers müssen wir speichern
        else
            tUser.getPersistence().deleteNumber("mBotsay_allowed"); //bei anderen nicht, da sie default forbidden sind

        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun gesperrt.");
    }


};

Botsay.self = new Botsay;