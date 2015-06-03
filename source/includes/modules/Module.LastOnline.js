/**
 * @file Diese Datei definiert das LastOnline Module
 * @author KnuddelsTools
 * @author DdvOiD
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class LastOnline
 * @extends Module
 * @constructor
 */
function LastOnline() {
    App.registerModule(this);
};
LastOnline.prototype = new Module;
LastOnline.prototype.constructor = LastOnline;

LastOnline.prototype.onActivated = function() {
    this.registerCommand("lastonline", this.cmdLastOnline);
};

LastOnline.prototype.onDeactivated = function() {
    this.unregisterCommand("lastonline");
};

/**
 *
 * @param {User} user
 */

LastOnline.prototype.onUserJoined = function(user) {
    var persis = user.getPersistence();
    persis.setNumber("mLastOnline_join", -1);
};

/**
 *
 * @param {User} user
 */
LastOnline.prototype.onUserLeft = function (user) {
  var persis = user.getPersistence();
    persis.setNumber("mLastOnline_join", Date.now());
};
/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
LastOnline.prototype.cmdLastOnline = function(user, params, func) {
    var message = "°#°°BB18°_Folgende User waren zuletzt hier im Channel:§";
    var entries = UserPersistenceNumbers.getSortedEntries("mLastOnline_join", { ascending: false, count: 30 });
    for(var key in entries){
        var entry = entries[key];
        if (entry.getValue() <= 0)
        continue;
        message += "°#°"+ entry.getRank() +" - "+ entry.getUser().getProfileLink() + " ("+ new Date (entry.getValue()).toGermanString() + ")";
    }
    user.sendPrivateMessage(message);
};

LastOnline.self = new LastOnline;
