/**
 * @file Diese Datei definiert das ChannelTop Module
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class ChannelTop
 * @extends Module
 * @constructor
 */

function ChannelTop() {
    App.registerModule(this);
};
ChannelTop.prototype = new Module;
ChannelTop.prototype.constructor = ChannelTop;

ChannelTop.prototype.onAppStart = function() {

};

new ChannelTop;