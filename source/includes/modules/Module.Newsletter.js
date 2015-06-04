/**
 * @file Diese Datei definiert das Newsletter Module
 * @author KnuddelsTools
 * @author DdvOiD
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class Newsletter
 * @extends Module
 * @constructor
 */

function Newsletter() {
    App.registerModule(this);
};
Newsletter.prototype = new Module;
Newsletter.prototype.constructor = Newsletter;

Newsletter.prototype.onActivated = function() {
    this.registerCommand("appnewsletter", this.cmdNewsletter);
    this.registerCommand("activatenewsletter", this.cmdActivateNewsletter);
    this.registerCommand("deactivatenewsletter", this.cmdDeactivateNewsletter);
    this.registerCommand("newsletteradmin", this.cmdNewsletterAdmin);
    this.registerCommand("newslettersend", this.cmdsendNewsletter);
};

Newsletter.prototype.onDeactivated = function() {
    this.unregisterCommand("appnewsletter");
    this.unregisterCommand("activatenewsletter");
    this.unregisterCommand("deactivatenewsletter");
    this.unregisterCommand("newsletteradmin");
    this.unregisterCommand("newslettersend");
};

/**
 * @param {User} user
 */
// Prüft beim betreten des Channels ob der User für den Newsletter angemeldet ist - und schickt entsprechend einen Link zum Anmelden/Abmelden
Newsletter.prototype.onUserJoined = function(user) {
    var channame = KnuddelsServer.getChannel().getChannelName();
    var persis = user.getPersistence();
    var news = persis.getNumber("mNewsletter_news", 0);
    if (news == 0) {
        user.sendPrivateMessage("Falls du über alle Neuigkeiten in diesem Channel informiert werden möchtest, so aktiviere unseren °BB°_°>Newsletter|/sfc " + channame + ":/activatenewsletter<°§.");
    }
    else {
        user.sendPrivateMessage("Falls du den Newsletter abbestellen möchtest, so kannst du das °BB°_°>hier|/sfc " + channame + ":/deactivatenewsletter<°§ tun.");
    }
};

/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
//Funktion um den Newsletter zu verschicken
Newsletter.prototype.cmdsendNewsletter = function(user, params, func) {
    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }
    var count = UserPersistenceNumbers.getCount("mNewsletter_news");
    var channame = KnuddelsServer.getChannel().getChannelName();
    var AppPersistence = KnuddelsServer.getPersistence();
    var message = AppPersistence.getString("mNewsletter_newstext", "Es gibt Neuigkeiten!");
    var messageadd = "Diese Nachricht ist der Newsletter aus dem Channel " + channame +".";
    var deactivate = "Du willst keine weiteren Benachrichtigungen?°#°Einfach °BB°_°>/deactivatenewsletter|/sfc "+channame+":/deactivatenewsletter<°_°[102,102,102]° im Channel "+ channame +" eingeben";

    message += "°r°°#°°#°°#°°RR°_" + messageadd;
    message += "°#°°[102,102,102]°_" + deactivate;
    UserPersistenceNumbers.each("mNewsletter_news", function(user)
    {
        user.sendPostMessage("°R°Newsletter aus dem Channel: "+ channame + "°r°", message);

        }, { ascending: false, maximumCount: count });
};

/**
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
// Funktion um den Text für die Rundmail zu definieren
Newsletter.prototype.cmdNewsletter = function(user, params, func) {
    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }
    var AppPersistence = KnuddelsServer.getPersistence();
    var msg = params.limitKCode();
    if(msg == "") {

        var message = AppPersistence.getString("mNewsletter_newstext", "Es gibt Neuigkeiten!");
        user.sendPrivateMessage(message);
    }
    else {
        AppPersistence.setString("mNewsletter_newstext", msg);
        var newmessage = AppPersistence.getString("mNewsletter_newstext", "Es gibt Neuigkeiten!");
            user.sendPrivateMessage(newmessage);
         }
};

/**
 * @param {User}user
 * @param {string}params
 * @param {string} func
 */
//Funktion zum Aktivieren des Newsletters
Newsletter.prototype.cmdActivateNewsletter = function(user, params, func) {
    var persis = user.getPersistence();
    var news = persis.getNumber("mNewsletter_news", 0);
    if (news == 0) {
    persis.setNumber("mNewsletter_news", 1);
    user.sendPrivateMessage("Du hast sich soeben für den Newsletter eingetragen und wirst künftig bei Änderungen im Channel informiert.");
    } else {
        user.sendPrivateMessage("Du bist bereits für den Newsletter angemeldet.")
    }
};

/**
 * @param {User}user
 * @param {string}params
 * @param {string} func
 */
//Funktion zum Deaktivieren des Newsletters
Newsletter.prototype.cmdDeactivateNewsletter = function(user, params, func) {
    var persis = user.getPersistence();
    var news = persis.getNumber("mNewsletter_news", 0);
    if (news == 1) {
        persis.deleteNumber("mNewsletter_news");
        user.sendPrivateMessage("Du wurdest soeben aus dem Newsletterverteiler entfernt.")
    } else {
    user.sendPrivateMessage("Du bist bereits vom Newsletter abgemeldet.");
    }
};

/**
 * Prüft ob der Nutzer freigegeben ist um /newslettersend & /appnewsletter zu nutzen
 * @param {User} user
 * @returns {boolean}
 */
Newsletter.prototype.userAllowed = function(user) {

    if(user.getPersistence().getNumber("mNewsletter_allowed", 1) == 0)
        return false;

    if(user.isAppManager() == true)
        return true;

    if(user.getPersistence().getNumber("mNewsletter_allowed", 0) == 1)
        return true;

    return false;
};

/**
 * Gibt eine Liste aller erlaubten Nutzer zurück
 * @returns {User[]}
 */
Newsletter.prototype.allowedUsers = function() {
    var users = [];
    var appManager = KnuddelsServer.getAppManagers();
    for(var i = 0; i < appManager.length; i++) {
        if(this.userAllowed(appManager[i]))
            users.push(appManager[i]);
    }
    var managedUsers = UserPersistenceNumbers.getSortedEntries("mNewsletter_allowed");
    for(var i = 0; i < managedUsers.length; i++) {
        if(managedUsers[i].getValue() == 1)
            users.push(managedUsers[i].getUser());

    }

    return users;
};


/**
 * Mit diesem Befehl können User für das Newsletter verschicken freigegeben und entfernt werden
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
Newsletter.prototype.cmdNewsletterAdmin = function(user, params, func) {
    if(!user.isAppManager())
        return;

    if(!this.userAllowed(user)) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }
    if(params == "list") {
        var count = UserPersistenceNumbers.getCount("mNewsletter_news");
        user.sendPrivateMessage("Derzeit haben sich _°BB>" + count + "|/newsletteradmin userlist<°§ User für den Newsletter angemeldet");
        return;
    }

    if(params == "userlist") {
        var message = "°#°°RR°_Folgende Nutzer haben sich für den Newsletter angemeldet:§°#°";
        var users = [];
        UserPersistenceNumbers.each("mNewsletter_news", function(tUser) {
            users.push("°BB°_" + tUser.getProfileLink() + "§");
        }, { onEnd: function() {

            users.sort(
                function(a, b) {
                return a.localeCompare(b);
            });

            message += users.join(", ");
            user.sendPrivateMessage(message);
        } });
        return;
    }

    if(params == "") {
        var users = this.allowedUsers();
        user.sendPrivateMessage("Folgende User sind freigeschaltet: " + users.join(", "));
    }
    var ind = params.indexOf(":");
    if(ind == -1) {
        user.sendPrivateMessage("Bitte nutze den Befehl wie folgt: °#°" +
            "_/" + func + " allow:NICK_ -> um einen User für /newsletter freizuschalten.°#°" +
            "_/" + func + " disallow:NICK_ -> um einen User für /newsletter zu sperren.°#°" +
            "_/" + func + " list_ -> Anzahl der eingetragenen User bekommen.");
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
        tUser.getPersistence().setNumber("mNewsletter_allowed",1);
        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun freigeschaltet.");


    } else if(action.toLowerCase() == "disallow") {
        if(tUser.isAppManager())
            tUser.getPersistence().setNumber("mNewsletter_allowed",0); //bei Appmanagers müssen wir speichern
        else
            tUser.getPersistence().deleteNumber("mNewsletter_allowed"); //bei anderen nicht, da sie Standardmäßig nicht dürfen

        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun gesperrt.");
    }
};


Newsletter.self = new Newsletter;