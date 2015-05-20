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
    if(this != TopicChanger.self) {
        return TopicChanger.self.cmdPreviewTopic(user, params, func);
    }

    if(!this.isAllowed(user)) {
        return;
    }

    var topic = params.limitKCode();

    user.sendPrivateMessage("_°BB°Dieser Channel hat folgendes Thema:°r°°#°" + topic);
};



/**
 * mit diesen Befehl kann ein Topic gesetzt werden für den Channel
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
TopicChanger.prototype.cmdSetTopic = function (user, params, func) {
    if(this != TopicChanger.self) {
        return TopicChanger.self.cmdSetTopic(user, params, func);
    }

    if(!this.isAllowed(user)) {
        return;
    }

    var topic = params.limitKCode();

    KnuddelsServer.getChannel().getChannelConfiguration().getChannelInformation().setTopic(topic);
};

/**
 * prüft ob ein User die Funktion nutzen darf
 * @param {User} user
 */
TopicChanger.prototype.isAllowed = function(user) {
    if(user.isChannelOwner())
        return true;


    return false;
};


TopicChanger.prototype.onActivated = function() {
    App.chatCommands.settopic = this.cmdSetTopic;
    App.chatCommands.previewtopic = this.cmdPreviewTopic;
    KnuddelsServer.refreshHooks();
};

TopicChanger.prototype.onDeactivated = function() {
    delete App.chatCommands.settopic;
    delete App.chatCommands.previewtopic;
    KnuddelsServer.refreshHooks();
};


TopicChanger.self = new TopicChanger();