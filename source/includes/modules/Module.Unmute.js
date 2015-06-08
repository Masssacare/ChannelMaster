/**
 * @file Diese Datei definiert das Unmute Modul
 * @author KnuddelsTools
 * @author DdvOiD
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class Unmute
 * @extends Module
 * @constructor
 */
function Unmute() {
    App.registerModule(this);
};
Unmute.prototype = new Module;
Unmute.prototype.constructor = Unmute;


Unmute.prototype.onActivated = function() {
    this.registerCommand("muted", this.cmdMuted);

};

Unmute.prototype.onDeactivated = function() {
    this.unregisterCommand("muted");

};

Unmute.prototype.keepMute = {};

/**
 *  Diese Funktion prüft ob im Channel User gemutet sind und schreibt die Cms, die sich im Channel befinden an und schickt einen entmute Link
 */
Unmute.prototype.unmuten = function () {

    // Bekomme den Channelnamen
    var channame = KnuddelsServer.getChannel().getChannelName();
    // Bekomme Rechte für den Channel
    var channel = KnuddelsServer.getChannel();
    // Bekomme die gemuteten User
    var muted = channel.getChannelRestrictions().getMutedUsers();
    // Beginne den Ausgegebenen Text
    var mute = "Die Folgenden Nicks sind gemutet:";
    // Bekomme eine Liste der Cm's des Channels
    var channelRights = channel.getChannelConfiguration().getChannelRights();
    var cms = channelRights.getChannelModerators();
    var unmuteUsers = [];
    for(var j = 0; j < muted.length; j++) {
        if(typeof this.keepMute[muted[j].getUserId()] == 'undefined')
            unmuteUsers.push(muted[j]);
    }
    if(unmuteUsers > 0) {
        var tmpStr = "°>{button}Alle Entmuten||textborder|1|height|20|call|/doubleaction ";
        var tmpUsers = [];
        for (var j = 0; j < unmuteUsers.length; j++) {
            var nickname = unmuteUsers[j].getNick();
            tmpStr = tmpStr + "/mute !" + nickname.escapeKCode() + "\\|";
            tmpUsers.push(nickname.escapeKCode());
        }
        tmpStr = tmpStr + "<°";

        tmpStr += "°#°°BB°_Folgender User werden entmutet:_°r° " + tmpUsers.join(", ");
        for (var i = 0; i < cms.length; i++) {
            var cm = cms[i];

            if (cm.isOnlineInChannel() && cm.getClientType() != ClientType.Android && cm.getClientType() != ClientType.IOS && !cm.isAway() )
                cm.sendPrivateMessage("Klicke bitte hier, um alle User zu entmuten: " + tmpStr);
        }
    }

};

/**
 *
 * @param {Date} date
 */
Unmute.prototype.timerHandler = function (date) {
    if(date.getSeconds()%20 == 0) {
        this.unmuten();
    }
};

/**
 *
 * @param {User} user
 */
Unmute.prototype.onUserJoined = function (user) {
    user.sendPrivateMessage("Sofern du hier im Channel gemutet wirst, werden die anwesenden Cms hier im Channel automatisch darüber informiert.");
};

Unmute.prototype.cmdMuted = function(user, params, func) {
    if(!user.isChannelModerator())
        return;
    if (params.toLowerCase() == "list") {
        var list = [];
        for(var key in this.keepMute) {
            var mUser = KnuddelsServer.getUser(key);
            var cm = KnuddelsServer.getUser(this.keepMute[key]);
            list.push(mUser.getProfileLink() + " ("+cm.getProfileLink()+")");
        }
        user.sendPrivateMessage("Folgende User stehen auf der nicht entmuten Liste:°#°"+list.join(", "));
        return;
    }
    var setzen = true;
    if(params.startsWith("!")) {
        setzen = false;
        params = params.substr(1);
    }
    var muted = KnuddelsServer.getUserByNickname(params);
    if (muted == null) {
        user.sendPrivateMessage("Dieser User existiert nicht.");
        return;
    } else {
        if(setzen) {
            this.keepMute[muted.getUserId()] = user.getUserId();
            user.sendPrivateMessage("Der User " + muted + " wurde soeben auf die _nicht_ entmuten Liste gesetzt.");
        } else {
            delete this.keepMute[muted.getUserId()];
            user.sendPrivateMessage("Der User " + muted + " wurde soeben von der _nicht_ entmuten Liste entfernt.");
        }
    }
};

Unmute.self = new Unmute();