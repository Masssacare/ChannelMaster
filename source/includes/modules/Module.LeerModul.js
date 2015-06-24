/**
 * @file Diese Datei definiert ein LeerModul zu Lernzwecken
 * @author KnuddelsTools
 * @author DdvOiD
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class LeerModul
 * @extends Module
 * @constructor
 */
function LeerModul() {
    App.registerModule(this);
}

LeerModul.prototype = new Module;
LeerModul.prototype.constructor = LeerModul;



/**
 * Führt alles aus, was beim aktivieren des Moduls getan werden muss
 * Im aktuellen Beispiel einen /Befehl registrieren
 */
LeerModul.prototype.onActivated = function() {
    this.registerCommand("Slash-Befehl", this.cmdFunktion);
};


/**
 * Führt alles aus, was beim deaktivieren des Moduls getan werden muss
 * Im aktuellen Beispiel einen /Befehl entfernen
 */
LeerModul.prototype.onDeactivated = function() {
    this.unregisterCommand("Slash-Befehl");
};

/**
 * Definiert die Funktion wie bei onActivated angegeben
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
LeerModul.prototype.cmdFunktion = function (user, params, func) {
    // hier den ganz normalen Funktionstext
    params = params.toLowerCase();
    if (params == "hello") {
        //Bot schreibt öffentlich
        App.bot.sendPublicMessage("Deine angegebener Parameter war " + params + ".");
    } else if (params == "world") {
        //der Bot schreibt dem User privat
        user.sendPrivateMessage("Dein angegebener Parameter war " + params + ".");
    } else if (paras == "!") {
        //der Bot schreibt dem User eine /m
        user.sendPostMessage("Betreff", "Dein angegebener Parameter war " + params + ".")
    }
};


/**
 * MUSS vorhanden bleiben, damit das Modul lauffähig ist
 * @type {LeerModul}
 */
LeerModul.self = new LeerModul;
