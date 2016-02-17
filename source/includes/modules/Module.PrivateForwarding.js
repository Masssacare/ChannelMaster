/**
 * @file Diese Datei definiert das Privateforwarding Module
 * @author KnuddelsTools
 * @author DdvOiD
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class PrivateForwarding
 * @extends Module
 * @constructor
 */

function PrivateForwarding() {
    App.registerModule(this);
};

PrivateForwarding.prototype = new Module;
PrivateForwarding.prototype.constructor = PrivateForwarding;


PrivateForwarding.prototype.onActivated = function() {
    this.registerCommand("forwardingadmin", this.cmdForwardAdmin);
    this.registerCommand("activateofflinemessage", this.cmdActivateOfflineMessage);
    this.registerCommand("deactivateofflinemessage", this.cmdDeactivateOfflineMessage);
};


PrivateForwarding.prototype.onDeactivated = function() {
    this.unregisterCommand("forwardingadmin");
    this.unregisterCommand("activateofflinemessage");
    this.unregisterCommand("deactivateofflinemessage");
};


/**
 *
 * @param {String} privateMessage
 */
PrivateForwarding.prototype.onPrivateMessage = function (privateMessage) {
    var users = this.allowedUsers();

    var msg = privateMessage.getText().escapeKCode();
    var author = privateMessage.getAuthor();
    var date = privateMessage.getCreationDate();

    for(var i = 0; i < users.length; i++) {
        var tUser = users[i];
        if(tUser.isOnline()){
        tUser.sendPrivateMessage("Der User " + author.getProfileLink() + " hat dem Bot soeben eine Nachricht geschrieben." +
            " Inhalt der Nachricht: °#r°°#r° °RR°_"+ author.getProfileLink() + " (privat):°r°_ " + msg);
        }
        else {
            if(tUser.getPersistence().getNumber("mPrivateForwarding_offlineMessage", 1) == 1) {
            tUser.sendPostMessage("Nachricht an deinen App-Bot", "Der User " + author.getProfileLink() + " hat dem Bot um " + date.toGermanString() + " eine Nachricht geschrieben." +
                                  " Inhalt der Nachricht: °#r°°#r° °RR°_"+ author.getProfileLink() + " (privat):°r°_ " + msg);
            }
        }
    }
};

/**
 * Gibt eine Liste aller erlaubten Nutzer zurück
 * @returns {User[]}
 */
PrivateForwarding.prototype.allowedUsers = function() {
    var users = [];
    var owner = KnuddelsServer.getChannel().getChannelConfiguration().getChannelRights().getChannelOwners();
    for(var i = 0; i < owner.length; i++) {
       users.push(owner[i]);
    }
    var managedUsers = UserPersistenceNumbers.getSortedEntries("mPrivateForwarding_allowed");
    for(var i = 0; i < managedUsers.length; i++) {
        if(managedUsers[i].getValue() == 1 && !managedUsers[i].getUser().isChannelOwner())
            users.push(managedUsers[i].getUser());

    }

    return users;
};

/**
 * Prüft ob der Nutzer freigegeben ist um /forwardingadmin zu nutzen
 * @param {User} user
 * @returns {boolean}
 */
PrivateForwarding.prototype.userAllowed = function(user) {

    if(user.isChannelOwner())
        return true;

    if(user.getPersistence().getNumber("mPrivateForwarding_allowed", 1) == 0)
        return false;

    if(user.isAppManager() == true)
        return true;

    if(user.getPersistence().getNumber("mPrivateForwarding_allowed",0) == 1)
        return true;

    return false;
};


/**
 * Mit diesem Befehl können User für OfflineMessage eintragen
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
PrivateForwarding.prototype.cmdActivateOfflineMessage = function(user, params, func) {
    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }
    user.getPersistence().setNumber("mPrivateForwarding_offlineMessage", 1);
    user.sendPrivateMessage("Du hast dich soeben wieder in den Verteiler eingetragen.");
};


/**
 * Mit diesem Befehl können User für die OfflineMessage austragen
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
PrivateForwarding.prototype.cmdDeactivateOfflineMessage = function(user, params, func) {
    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }
    var allowed = user.getPersistence().getNumber("mPrivateForwarding_offlineMessage", 1)-1;
    user.getPersistence().setNumber("mPrivateForwarding_offlineMessage", allowed);
    user.sendPrivateMessage("Du hast dich soeben aus dem Verteiler entfernt.");
};


/**
 * Mit diesem Befehl können User für PrivateForwarding freigegeben und entfernt werden
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
PrivateForwarding.prototype.cmdForwardAdmin = function(user, params, func) {
    if(!this.userAllowed(user))
        return;

    if(params == "") {
        var users = this.allowedUsers();
        user.sendPrivateMessage("Folgende User sind freigeschaltet: " + users.join(", "));
    }

    var ind = params.indexOf(":");
    if(ind == -1) {
        user.sendPrivateMessage("Bitte nutze den Befehl wie folgt: °#°" +
            "_/" + func + " allow:NICK_ um einen User für das Aktivieren/Deaktivieren der OfflineMessage freizuschalten.°#r°" +
            "_/" + func + " disallow:NICK_ um einen User für Aktivieren/Deaktivieren der OfflineMessage zu sperren.");
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
        tUser.getPersistence().setNumber("mPrivateForwarding_allowed",1);
        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun freigeschaltet.");
    } else if(action.toLowerCase() == "disallow") {
        if(tUser.isAppManager())
            tUser.getPersistence().setNumber("mPrivateForwarding_allowed",0); //bei Appmanagers müssen wir speichern
        else
            tUser.getPersistence().deleteNumber("mPrivateForwarding_allowed"); //bei anderen nicht, da sie default forbidden sind

        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun gesperrt.");
    }
};

PrivateForwarding.self = new PrivateForwarding;
