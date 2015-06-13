/**
 * @file Diese Datei definiert das Functions Module
 * @author KnuddelsTools
 * @author DdvOiD
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class Functions
 * @extends Module
 * @constructor
 */
function Functions() {
    App.registerModule(this);
};

Functions.prototype = new Module;
Functions.prototype.constructor = Functions;


Functions.prototype.setText = function(arr) {
    App.persistence.setString("mFunctions_text", JSON.stringify(arr));
};

Functions.prototype.getText = function() {
    if(!App.persistence.hasString("mFunctions_text"))
        return [];

    return JSON.parse(App.persistence.getString("mFunctions_text"));
};

Functions.prototype.onActivated = function() {
    this.registerCommand("functions", this.cmdFunctions);
    this.registerCommand("functionsadmin", this.cmdFunctionsAdmin);
    this.registerCommand("deletefunctions", this.cmdDeleteFunction);
};

Functions.prototype.onDeactivated = function() {
    this.unregisterCommand("functions");
    this.unregisterCommand("functionsadmin");
    this.unregisterCommand("deletefunctions");
};

Functions.prototype.onAppStart = function() {
    if(this.getText().length == 0) {
        this.setText(["°>/functions /help::Beschreibung|/tf-overridesb /functions [/help::Beschreibung]<° - Fügt die /help Funktion mit Beschreibung der Funktionsübersicht hinzu."]);
    }
};

/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Functions.prototype.cmdFunctions = function(user, params, func) {
    var texte = this.getText();
    if(!user.isChannelModerator() && !this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;

    }
    if (params == ""){
        var message = "°BB18°_Die Folgenden Funktionen sind derzeit gespeichert§";
        for(var key in texte) {

            var text = texte[key];
            if(typeof text != "string")
                continue;
            message += "°#r°"+ text + " °>Entfernen|/deletefunctions "+ key +"<°" ;
        }
        user.sendPrivateMessage(message);
        return;
    }
    if (!this.userAllowed(user))
        return;

    var ind = params.indexOf("::");
    if (ind == -1) {
        user.sendPrivateMessage("Bitte die Funktion richtig nutzen! Beispiel: °RR°_/functions /functions::Beschreibung°r°_.");
        return;
    }
    var befehl = params.substring(0, ind).trim();
    var text = params.substr(ind+2).trim();

    if(!befehl.startsWith("/")) {
        user.sendPrivateMessage("Den Befehl bitte per °RR°_/Befehl°r°_ eingeben.");
        return;
    }
    var newfunctions = "°BB°_°>"+ befehl.replace("\\:",":").escapeKCode() +"|/tf-overridesb "+befehl.escapeKCode()+"<°°r°_ - "+ text;


    texte.push(newfunctions.limitKCode());
    this.setText(texte);
    this.cmdFunctions(user, "");
};


/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Functions.prototype.cmdFunctionsAdmin = function(user, params, func) {
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
                "_/functions_ -> Übersicht der Funktionsliste.°#r°" +
                "_/functions Funktion::Beschreibung_ -> Fügt eine Funktion der Liste hinzu.°#r°" +
                "_/" + func + " allow:NICK_ -> um einen User freizuschalten.°#r°" +
                "_/" + func + " disallow:NICK_ -> um einen User zu sperren.°#r°");
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
        tUser.getPersistence().setNumber("mFunctions_allowed",1);
        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun freigeschaltet.");


    } else if(action.toLowerCase() == "disallow") {
        if (tUser.isAppManager())
            tUser.getPersistence().setNumber("mFunctions_allowed", 0); //bei Appmanagers müssen wir speichern
        else
            tUser.getPersistence().deleteNumber("mFunctions_allowed"); //bei anderen nicht, da sie Standardmäßig nicht dürfen

        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun gesperrt.");
    }
};

/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Functions.prototype.cmdDeleteFunction = function(user, params, func) {
    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }
    var texte = this.getText();
    if(typeof texte[params] == "undefined") {
        user.sendPrivateMessage("Der von dir eingegebene Paramater existiert nicht.");
        return;
    }
    texte = Array.remove(texte,params);
    this.setText(texte);
    this.cmdFunctions(user, "");

};



/**
 * Prüft ob der Nutzer freigegeben ist um Daten zu ändern
 * @param {User} user
 * @returns {boolean}
 */
Functions.prototype.userAllowed = function(user) {

    if(user.getPersistence().getNumber("mFunctions_allowed", 1) == 0)
        return false;

    if(user.isAppManager() == true)
        return true;

    if(user.isCoDeveloper() == true)
        return true;

    if(user.getPersistence().getNumber("mFunctions_allowed", 0) == 1)
        return true;

    return false;
};


/**
 * Gibt eine Liste aller erlaubten Nutzer zurück
 * @returns {User[]}
 */
Functions.prototype.allowedUsers = function() {
    var users = [];
    var appManager = KnuddelsServer.getAppManagers();
    for(var i = 0; i < appManager.length; i++) {
        if(this.userAllowed(appManager[i]))
            users.push(appManager[i]);
    }
    var managedUsers = UserPersistenceNumbers.getSortedEntries("mFunctions_allowed");
    for(var i = 0; i < managedUsers.length; i++) {
        if(managedUsers[i].getValue() == 1)
            users.push(managedUsers[i].getUser());

    }

    return users;
};


Functions.self = new Functions;
