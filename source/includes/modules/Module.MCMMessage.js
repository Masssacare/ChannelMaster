/**
 * @file Mit diesem Modul kann man als MCM Rundmails an das eigene MCM Team schicken.
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class MCMMessage
 * @extends Module
 * @constructor
 */
function MCMMessage() {
    App.registerModule(this);
};
MCMMessage.prototype = new Module;
MCMMessage.prototype.constructor = MCMMessage;


MCMMessage.prototype.onActivated = function() {
    this.registerCommand("mcmmessage", this.cmdMCMMessage);

};

MCMMessage.prototype.onDeactivated = function() {
    this.unregisterCommand("mcmmessage", this.cmdMCMMessage);
};

/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
MCMMessage.prototype.cmdMCMMessage = function(user, params, func) {
    if(!user.isChannelOwner() && !user.isChannelModerator()) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht nutzen.");
        return;
    }
    var topic = "Rundmail von " + user.getProfileLink() + " aus dem Channel " + KnuddelsServer.getChannel().getChannelName().escapeKCode();
    var messageadd = "Diese Nachricht ist eine Rundmail von " + user.getProfileLink() + " aus dem Channel " + KnuddelsServer.getChannel().getChannelName().escapeKCode();
    var text = "";

    var ind = params.indexOf("§");
    if(ind == -1) {
        text = params.limitKCode().trim();
    } else {
        topic = params.substring(0, ind).limitKCode().trim();
        text = params.substring(ind+1).limitKCode().trim();
    }
    if(topic.length == 0) {
        user.sendPrivateMessage("Du hast keinen Betreff angegeben.");
        return;
    }
    if(topic.length > 500) {
        user.sendPrivateMessage("Der Betreff ist zu lang.");
        return;
    }
    if(text.length == 0) {
        user.sendPrivateMessage("Du hast keine Nachricht angegeben.");
        return;
    }
    if(text.length >= 9000) {
        user.sendPrivateMessage("Deine Nachricht ist zu lang.");
        return;
    }

    text += "°r°°#°°#°°#°°RR°_" + messageadd;
    var cms = KnuddelsServer.getChannel().getChannelConfiguration().getChannelRights().getChannelModerators();
    for(var i = 0; i < cms.length; i++) {
        var cm = cms[i];
        if(cm.getUserType() != UserType.Human)
            continue;
        cm.sendPostMessage(topic, text);
    }

};


MCMMessage.self = new MCMMessage;