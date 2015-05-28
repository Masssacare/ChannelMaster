/**
 * @file Mit diesem Modul kann man sich Knuddels auf dem Bot auszahlen lassen.
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class Botsay
 * @extends Module
 * @constructor
 */
function KnuPayout() {
    App.registerModule(this);
}
KnuPayout.prototype = new Module;
KnuPayout.prototype.constructor = KnuPayout;



KnuPayout.prototype.onActivated = function() {
    this.registerCommand("knupayout", this.cmdKnuPayout);
};

KnuPayout.prototype.onDeactivated = function() {
    this.unregisterCommand("knupayout");
};

/**
 *
 * @param {User} user
 * @param {string} params
 * @param func
 * @returns {*}
 */
KnuPayout.prototype.cmdKnuPayout = function (user, params, func) {
    if(!user.isChannelOwner())
        return;
    if(params == "") {
        var amount = KnuddelsServer.getDefaultBotUser().getKnuddelAmount();
        if(amount.asNumber()>0) {
            KnuddelsServer.getDefaultBotUser().transferKnuddel(user, amount);
        }
    }
};

KnuPayout.self = new KnuPayout();