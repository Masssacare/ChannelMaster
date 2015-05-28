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
    // Starte einen neuen Temprorären String für den Entmute Link
    var tmpStr = "°>{button}Alle Entmuten||textborder|1|height|20|call|/doubleaction ";
    // Setze eine Variable um zu überprüfen ob überhaupt ein User gemutet ist
    var mutedUser = 0;
    // Eine Schleife um für jeden gemuteten User einen eigenen Entmute Link zu generieren
    for(var i = 0; i <  muted.length; i++) {
        var nickname = muted[i].getNick();
        mutedUser++
        tmpStr = tmpStr + "/mute !" + nickname.escapeKCode() +"\\|";
    }
    // Schließt den temporären String wodurch der Entmute Link alle gemuteten user enthält
    tmpStr = tmpStr + "<°";
    // Wenn es mindestens 1 gemutetet User gibt erfolgt die Ausgabe
    if (mutedUser >= 1) {
        // Splitte die Liste aller cms auf und prüfe ob der Cm im Channel ist
        for(var i = 0; i < cms.length; i++) {
            var cm = cms[i];
            // prüfe ob Cms im Channel sind und schicke jedem einzelnen einen Entmute Link
            if(cm.isOnlineInChannel()) {
                cm.sendPrivateMessage("Klicke bitte hier, um alle User zu entmuten: "+tmpStr);
            }
            // Falls kein Cm im Channel online ist prüfe ob ein Cm online ist & informiere sie über den /mute
            else {
                if(cm.isOnline()) {
                    cm.sendPrivateMessage("Im Channel "+channame +" ist jemand gemutet, schau doch mal bitte nach!");
                }
            }
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

Unmute.self = new Unmute();