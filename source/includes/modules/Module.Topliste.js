/**
 * @file Diese Datei definiert das Toplist Module
 * @author KnuddelsTools
 * @author DdvOiD
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class Toplist
 * @extends Module
 * @constructor
 */
function Toplist() {
    App.registerModule(this);
}

Toplist.prototype = new Module;
Toplist.prototype.constructor = Toplist;

Toplist.prototype.onActivated = function() {
    this.registerCommand("findtoplists", this.cmdToplistSearch);
    this.registerCommand("settoplist", this.cmdSetToplist);
};

Toplist.prototype.onDeactivated = function() {
    this.unregisterCommand("findtoplists");
    this.unregisterCommand("settoplist");
};



Toplist.prototype.cmdToplistSearch = function (user, params, func) {
    if(!user.isChannelOwner())
    return;
    if(!ChannelTop.self.isActivated()) {
    user.sendPrivateMessage("Um diese Funktion zu nutzen, muss das ChannelTop Modul aktiviert sein.");
    return;
    }

    var msg = "Folgende Toplisten Möglichkeiten gibt es:°#r°";
    for(var key in ChannelTop.PKEYS) {
        msg += "°>"+key.escapeKCode() + "|/tf-overridesb /settoplist " + key + ":[WunschText]<° °#r°";
    }
    user.sendPrivateMessage(msg);

};


Toplist.prototype.cmdSetToplist = function (user, param, func) {
    var appProfileEntryAccess = KnuddelsServer.getAppProfileEntryAccess();
    var toplistAccess = KnuddelsServer.getToplistAccess();

    var lists = appProfileEntryAccess.getAllProfileEntries();
    var alltops = toplistAccess.getAllToplists();
    if(!user.isChannelOwner())
    return;



    if(lists.length > 0) {
        for(var i = 0; i < lists.length; i++) {
            appProfileEntryAccess.removeEntry(lists[i]);

        }
    }
    if(alltops.length > 0) {
        for(var i = 0; i < alltops.length; i++) {
            toplistAccess.removeToplist(alltops[i]);
        }
    }

    var index = param.indexOf(":");
    if(index >= 0) {
        var action = param.substring(0, index).trim().toUpperCase();
        var param = param.substr(index + 1);
    } else {
        action = param;
        param = "";
    }
    if(action == "") {
        user.sendPrivateMessage("Du musst auch einen Text angeben.");
        return;
    }
       if(param.trim()=="") {
        user.sendPrivateMessage("Keinen Namen für die Topliste angegeben.");
        return;
    }

    if(typeof ChannelTop.PKEYS[action] != "undefined") {
        var toplist = toplistAccess.createOrUpdateToplist(ChannelTop.PKEYS[action], param);

        appProfileEntryAccess.createOrUpdateEntry(toplist, ToplistDisplayType.ValueAndRank);

        user.sendPrivateMessage("Topliste erstellt.");
        return;

    } else {
        user.sendPrivateMessage("Diesen Eintrag gibt es nicht");
        return;
    }

};


Toplist.self = new Toplist;