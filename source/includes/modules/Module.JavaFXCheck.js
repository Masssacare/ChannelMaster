/**
 * @file Mit diesem Modul wird dem User beim betreten des Channels benachrichtigt, ob er JavaFX nutzen kann oder nicht
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class JavaFXCheck
 * @extends Module
 * @constructor
 */
function JavaFXCheck() {
    App.registerModule(this);
};
JavaFXCheck.prototype = new Module;
JavaFXCheck.prototype.constructor = JavaFXCheck;

/**
 * Gibt dem User eine Anleitung, wie er JavaFX installiert
 * @param {User} user
 */
JavaFXCheck.prototype.helpJavaFXPC = function(user) {
    var message =   "°#°°RR°_ACHTUNG:_°r° Dein PC hat _JavaFX_ nicht installiert, welches benötigt wird um einige Funktionen von Apps zu nutzen." +
                    "°#°Um dieses Problem zu beheben bestehen 2 Möglichkeiten:" +
                    "°#°_1._ Java auf eine aktuelle Version updaten: _°BB>Java updaten|https://www.java.com/de/download/<°_°r° (empfohlen)" +
                    "°#°_2._ Den Mini-Chat nutzen: _°BB>Zum Mini-Chat|http://www.knuddels.de/htmlchat<°_°r°";
    user.sendPrivateMessage(message);
};

/**
 *
 * @param {User} user
 */
JavaFXCheck.prototype.onUserJoined = function (user) {
    if(user.getClientType() == ClientType.Applet) {
        var htmlFile = new HTMLFile('JavaFXCheck/test.html');
        var overlayContent = AppContent.overlayContent(htmlFile, 50, 50);
        if(!user.canSendAppContent(overlayContent)) {
            this.helpJavaFXPC(user);
        }

    }
};

JavaFXCheck.self = new JavaFXCheck();