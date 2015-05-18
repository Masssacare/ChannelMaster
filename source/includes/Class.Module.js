/**
 * @file Diese Datei definiert die Modul Klasse
 * @author KnuddelsTools
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class Module
 * @constructor
 */
function Module() {

}

/**
 * Registriert sich selbst als Modul
 */
Module.prototype.register = function() {
  App.registerModule(this);
};

/**
 * Unregistriert sich selbst als Modul
 */
Module.prototype.unregister = function() {
  App.unregisterModule(this);
};

/**
 * Prüft ob das Module aktiviert ist
 * @returns {boolean}
 */
Module.prototype.isActivated = function() {
    var keyname = "module_" + this.constructor.name;
    var appPersis = KnuddelsServer.getPersistence();
    return (appPersis.getNumber(keyname,0)>0);
};

/**
 * Aktiviert das Module
 */
Module.prototype.activate = function() {
    var keyname = "module_" + this.constructor.name;
    var appPersis = KnuddelsServer.getPersistence();
    appPersis.setNumber(keyname,1);
    App.refreshHooks();
};

/**
 * Deaktiviert das Module
 */
Module.prototype.deactivate = function() {
    var keyname = "module_" + this.constructor.name;
    var appPersis = KnuddelsServer.getPersistence();
    appPersis.setNumber(keyname,0);
    App.refreshHooks();
};
