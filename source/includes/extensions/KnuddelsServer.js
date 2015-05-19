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