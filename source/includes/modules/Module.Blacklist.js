/**
 * @file Diese Datei definiert das PaidModule für den Channel Spot It
 * @author KnuddelsTools
 * @author DdvOiD
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class Blacklist
 * @extends Module
 * @constructor
 */
function Blacklist() {
    App.registerModule(this);
};

Blacklist.prototype = new Module;
Blacklist.prototype.constructor = Blacklist;

Blacklist.prototype.onActivated = function() {
    this.registerCommand("blacklist", this.cmdBlacklist);
    this.registerCommand("blacklistdelete", this.cmdBlacklistDelete);
    this.registerCommand("blacklistadmin", this.cmdBlacklistAdmin)
};

Blacklist.prototype.onDeactivated = function() {
    this.unregisterCommand("blacklist");
    this.unregisterCommand("blacklistdelete");
    this.unregisterCommand("blacklistadmin");
};


Blacklist.prototype.setUsers = function(arr) {
    App.persistence.setString("mBlacklist_disallowed", JSON.stringify(arr));
};

Blacklist.prototype.getUsers = function() {
    if(!App.persistence.hasString("mBlacklist_disallowed"))
        return {};

    return JSON.parse(App.persistence.getString("mBlacklist_disallowed"));
};


/**
 *
 * @param {User} user
 */
Blacklist.prototype.onUserJoined = function(user) {
    var cms = KnuddelsServer.getChannel().getChannelConfiguration().getChannelRights().getChannelModerators();
    var key = "u-"+user.getUserId();
    var disallowed = this.getUsers();
    var nick = user.getNick().escapeKCode();
    if(typeof disallowed[key] != "undefined") {
        for (var i = 0; i < cms.length; i++) {
            var cm = cms[i];
            if (cm.isOnlineInChannel() && cm.getClientType() != ClientType.Android && cm.getClientType() != ClientType.IOS && !cm.isAway() )
            if (CMComment.self.isActivated()) {
                var link = "°>" + nick +" kicken|/doubleaction " +
                    "/cl "+ nick +": Aufgrund diverser Probleme stehst du auf der Channelinternen Blacklist.\\|" +
                    "/cmcomment "+ nick +":Blacklist Kick<°";
            }
            else {
                var link = "°>" + nick +" kicken|" +
                "/cl "+ nick +":Aufgrund diverser Probleme stehst du auf der Channelinternen Blacklist.<°";
            }

            cm.sendPrivateMessage("Der User " + user.getProfileLink() + " steht auf der Blacklist. Klicke bitte hier um Ihn zu sperren: " +link);

        }
    }
};

/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Blacklist.prototype.cmdBlacklist = function(user, params, func) {
    if(!user.isChannelModerator() || !this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }

    if(params.toLowerCase() == "") {
        var message = "°BB18°_Die Folgenden User stehen auf der Blacklist:§";
        var disallowed = this.getUsers();
        for (var key in disallowed) {

            var bUser = disallowed[key];
          message += "°#r°°>_h" + bUser.escapeKCode() +"|/w " + bUser.escapeKCode() + "|/serverpp  "+ bUser.escapeKCode() + "<° °>Entfernen|/blacklistdelete " + key + "<°";
        }
        user.sendPrivateMessage(message);
        return;
    }
    if (!this.userAllowed(user))
        return;

    if(params.toLowerCase() == "reset") {
        this.setUsers({});
        return;

    }

    var ind = params.indexOf(":");
    var action = params.substring(0, ind).trim();
    var nick = params.substr(ind+1).trim();

    if(!KnuddelsServer.userExists(nick)) {
        user.sendPrivateMessage("Der User _" + nick.escapeKCode() + " _existiert nicht.");
        return;
    }
    if (action.toLowerCase() == "add") {

        var disallowed = this.getUsers();
        disallowed["u-"+KnuddelsServer.getUserId(nick)] = nick;
        this.setUsers(disallowed);
        user.sendPrivateMessage("Der User " + nick + " wurde auf die Blacklist gesetzt.");
    }
};

/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Blacklist.prototype.cmdBlacklistDelete = function(user, params, func) {
    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }
    var disallowed = this.getUsers();
    if(typeof disallowed[params] == "undefined") {
        user.sendPrivateMessage("Der von dir eingegebene Paramater existiert nicht.");
        return;
    }
    delete disallowed[params];
    this.setUsers(disallowed);
    this.cmdBlacklist(user, "");

};



/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Blacklist.prototype.cmdBlacklistAdmin = function(user, params, func) {
    if(!user.isAppManager())
        return;

    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }

    if (params == "") {
        var users = this.allowedUsers();
        user.sendPrivateMessage("Folgende User sind freigeschaltet: " + users.join(", "));
    }
    var ind = params.indexOf(":");
    if (ind == -1) {
        user.sendPrivateMessage("Bitte nutze den Befehl wie folgt: °#r°" +
            "_/blacklist_ -> Übersicht der User auf der Blacklist.°#r°" +
            "_/blacklist add:NICK_ -> Fügt einen User der Blacklist hinzu.°#r°" +
            "_/" + func + " allow:NICK_ -> um einen User freizuschalten.°#r°" +
            "_/" + func + " disallow:NICK_ -> um einen User zu sperren.°#r°");
        return;
    }
    var action = params.substring(0, ind).trim();
    var nick = params.substr(ind+1).trim();

    var tUser = KnuddelsServer.getUserByNickname(nick);
    if(tUser == null) {
        user.sendPrivateMessage("Der User _" + nick.escapeKCode() + " _ existiert nicht.");
        return;
    }
    if(tUser.isAppManager() && !user.isChannelOwner()) {
        user.sendPrivateMessage("Nur der Channelbesitzer darf die Rechte eines Appmanagers ändern.");
        return;
    }

    if(action.toLowerCase() == "allow") {
        tUser.getPersistence().setNumber("mBlacklist_allowed",1);
        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun freigeschaltet.");


    } else if(action.toLowerCase() == "disallow") {
        if (tUser.isAppManager())
            tUser.getPersistence().setNumber("mBlacklist_allowed", 0); //bei Appmanagers müssen wir speichern
        else
            tUser.getPersistence().deleteNumber("mBlacklist_allowed"); //bei anderen nicht, da sie Standardmäßig nicht dürfen

        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun gesperrt.");
    }
};







/**
 * Prüft ob der Nutzer freigegeben ist Nicks zur Blackliste hinzuzufügen
 * @param {User} user
 * @returns {boolean}
 */
Blacklist.prototype.userAllowed = function(user) {

    if(user.getPersistence().getNumber("mBlacklist_allowed", 1) == 0)
        return false;

    if(user.isAppManager() == true)
        return true;

    if(user.isCoDeveloper() == true)
        return true;

    if(user.getPersistence().getNumber("mBlacklist_allowed", 0) == 1)
        return true;

    return false;
};

/**
 * Gibt eine Liste aller Nicks zurück, die User hinzufügen dürfen
 * @returns {User[]}
 */
Blacklist.prototype.allowedUsers = function() {
    var users = [];
    var appManager = KnuddelsServer.getAppManagers();
    for(var i = 0; i < appManager.length; i++) {
        if(this.userAllowed(appManager[i]))
            users.push(appManager[i]);
    }
    var managedUsers = UserPersistenceNumbers.getSortedEntries("mBlacklist_allowed");
    for(var i = 0; i < managedUsers.length; i++) {
        if(managedUsers[i].getValue() == 1)
            users.push(managedUsers[i].getUser());

    }

    return users;
};


Blacklist.self = new Blacklist;
