/**
 * @file Diese Datei erweitert die KnuddelsServer Klasse
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */


if(typeof KnuddelsServer == "undefined") {
    KnuddelsServer = {};
}

if(!(typeof KnuddelsServer.getUserByNickname === 'function')) {
    /**
     * Gibt das Userobject von Nickname wieder. Ist null, wenn Nutzer nicht existiert oder nicht zugegriffen werden darf
     * @param {string} nickname
     * @returns {User}
     */
    KnuddelsServer.getUserByNickname = function (nickname) {
        if (!KnuddelsServer.userExists(nickname))
            return null;
        var userid = KnuddelsServer.getUserId(nickname);
        if (!KnuddelsServer.canAccessUser(userid))
            return null;
        return KnuddelsServer.getUser(userid);
    };
}

if(typeof KnuddelsServer.getAppManagers != "function") {
    KnuddelsServer.getAppManagers = function() {
        return KnuddelsServer.getAppInfo().getAppManagers();
    };
}

if(typeof KnuddelsServer.getAppDeveloper != "function") {
    KnuddelsServer.getAppDeveloper = function() {
        return KnuddelsServer.getAppInfo().getAppDeveloper();
    };
}

if(typeof KnuddelsServer.getAppName != "function") {
    KnuddelsServer.getAppName = function() {
        return KnuddelsServer.getAppInfo().getAppName();
    };
}

if(typeof KnuddelsServer.getAppVersion != "function") {
    KnuddelsServer.getAppVersion = function() {
        return KnuddelsServer.getAppInfo().getAppVersion();
    };
}
