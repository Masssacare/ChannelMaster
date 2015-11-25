/**
 * @file Mit dem TopicChanger kann man das Topic seines Channels ändern
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class TopicChanger
 * @extends Module
 * @constructor
 */

function TopicChanger() {
    App.registerModule(this);
}
TopicChanger.prototype = new Module;
TopicChanger.prototype.constructor = TopicChanger;



/**
 * mit diesen Befehl kann man sich ein Topic vorher anschauen
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
TopicChanger.prototype.cmdPreviewTopic = function (user, params, func) {


    if(!this.isAllowed(user)) {
        return;
    }

    var topic = params.limitKCode({replaceToBotDefaultColor: false});

    user.sendPrivateMessage("_°BB°Dieser Channel hat folgendes Thema:°r°°#°" + topic);
};

/**
 * mit diesen Befehl kann man sich das aktuelle Topic inkl. genutztem KCode anschauen
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
TopicChanger.prototype.cmdGetTopic = function (user, params, func) {
    if(!this.isAllowed(user)) {
        return;
    }

    var topic = App.channel.getChannelConfiguration().getChannelInformation().getTopic();

    user.sendPrivateMessage("_°BB°Dieser Channel hat folgendes Thema:°r°°#°" + topic.escapeKCode());
};

/**
 * mit diesen Befehl kann ein Topic gesetzt werden für den Channel
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
TopicChanger.prototype.cmdSetTopic = function (user, params, func) {


    if(!this.isAllowed(user)) {
        return;
    }

    var topic = params;

    App.channel.getChannelConfiguration().getChannelInformation().setTopic(topic.limitKCode());
};

TopicChanger.prototype.cmdTopicChangerAdmin = function(user, params, func) {

    if(!user.isChannelOwner() && !user.isCoDeveloper()) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }

    if(params == "") {
        var entries = UserPersistenceNumbers.getSortedEntries("mTopicChanger_changetopic");
        var users = [];
        for(var key in entries) {
            users.push(entries[key].getUser());
        }
        user.sendPrivateMessage("Folgende User sind freigeschaltet: " + users.join(", "));
    }

    var ind = params.indexOf(":");
    if(ind == -1) {
        user.sendPrivateMessage("Bitte nutze den Befehl wie folgt: °#r°" +
        "_/" + func + " allow:NICK_ um einen User für /changetopic freizuschalten.°#r°" +
        "_/" + func + " disallow:NICK_ um einen User für /changetopic zu sperren.");
        return;
    }

    var action = params.substring(0, ind).trim();
    var nick = params.substr(ind+1).trim();

    var tUser = KnuddelsServer.getUserByNickname(nick);
    if(tUser == null) {
        user.sendPrivateMessage("Der User _" + nick.escapeKCode() + "_ existiert nicht.");
        return;
    }

    if(action.toLowerCase() == "allow") {
        tUser.getPersistence().setNumber("mTopicChanger_changetopic",1);
        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun freigeschaltet.");
    } else if(action.toLowerCase() == "disallow") {
        tUser.getPersistence().deleteNumber("mTopicChanger_changetopic");
        user.sendPrivateMessage("°RR°" + tUser.getProfileLink() + "°r° ist nun gesperrt.");
    }



};

/**
 * prüft ob ein User die Funktion nutzen darf
 * @param {User} user
 */
TopicChanger.prototype.isAllowed = function(user) {
    if(user.isChannelOwner())
        return true;
    if(user.getPersistence().hasNumber("mTopicChanger_changetopic"))
        return true;


    return false;
};




TopicChanger.prototype.onActivated = function() {
    this.registerCommand("gettopic",this.cmdGetTopic);
    this.registerCommand("settopic", this.cmdSetTopic);
    this.registerCommand("previewtopic", this.cmdPreviewTopic);
    this.registerCommand("topicchangeradmin",this.cmdTopicChangerAdmin);
};

TopicChanger.prototype.onDeactivated = function() {
    this.unregisterCommand("gettopic");
    this.unregisterCommand("settopic");
    this.unregisterCommand("previewtopic");
    this.unregisterCommand("topicchangeradmin");
};


TopicChanger.self = new TopicChanger();