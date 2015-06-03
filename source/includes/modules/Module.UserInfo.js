/**
 * @file Mit der UserInfo kannst du hilfreiche Infos über ein User erfahren
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class UserInfo
 * @extends Module
 * @constructor
 */

function UserInfo() {
    this.__proto__ = new Module;
    this.__proto__.constructor = UserInfo;


    /**
     *
     * @param {User} user
     * @param params
     * @param func
     */
    this.cmdUserInfo = function (user, params, func) {
        if(!this.isAllowed(user)) {
            user.sendPrivateMessage("Die Funktion /" + func + " gibt's hier leider nicht.");
            return;
        }

        var tUser = KnuddelsServer.getUserByNickname(params.trim());
        if(tUser == null) {
            user.sendPrivateMessage("Auf den Nutzer " + params.trim().escapeKCode() + " kann nicht zugegriffen werden.");
            return;
        }

        var message = "°RR°_Info von °BB°" + tUser.getProfileLink() + "°r°_";

        //Default Infos
        message += "°#°_ClientType:_ " + tUser.getClientType().toString();
        message += "°#°_Status:_ " + tUser.getUserStatus().getNumericStatus() + (tUser.isAppManager()?" (Appmanager)":"");
        if(user.isInTeam("Apps") || user.getUserStatus().isAtLeast(UserStatus.HonoryMember))
            message += "°#°_UID:_ " +  tUser.getUserId().number_format(0,",",".");

        message += "°#°_Teams:_ " + tUser.getTeams().join(", ");

        var htmlFile = new HTMLFile('JavaFXCheck/test.html');
        var overlayContent = AppContent.overlayContent(htmlFile, 50, 50);
        message += "°#°_HTML-UI:_ " + (tUser.canSendAppContent(overlayContent)?"Unterstützt":"Nicht unterstützt");



        if(LastOnline.self.isActivated()) {
            var lastOnline = tUser.getPersistence().getNumber("mLastOnline_join",0);
            message += "°#°_Zuletzt im Channel:_ " + (lastOnline==0?"Noch nie": new Date(lastOnline).toGermanString());
        }
        if(Newsletter.self.isActivated()) {
            message += "°#°_Newsletter:_ " + (tUser.getPersistence().hasNumber("mNewsletter_news")?"Angemeldet":"Abgemeldet");
        }
        if(ChannelTop.self.isActivated()) {
            var timeDay = tUser.getPersistence().getNumber("mChannelTop_onlinetime_day",0);
            var timeWeek = tUser.getPersistence().getNumber("mChannelTop_onlinetime_week",0);
            var timeMonth = tUser.getPersistence().getNumber("mChannelTop_onlinetime_month",0);
            var timeYear = tUser.getPersistence().getNumber("mChannelTop_onlinetime_year",0);
            var timeAlltime = tUser.getPersistence().getNumber("mChannelTop_onlinetime",0);

            message += "°#°_Onlinezeit:_ " + ChannelTop.self.timeToString(timeAlltime);
            message += "°#°_Onlinezeit (Tag):_ " + ChannelTop.self.timeToString(timeDay);
            message += "°#°_Onlinezeit (Woche):_ " + ChannelTop.self.timeToString(timeWeek);
            message += "°#°_Onlinezeit (Monat):_ " + ChannelTop.self.timeToString(timeMonth);
            message += "°#°_Onlinezeit (Jahr):_ " + ChannelTop.self.timeToString(timeYear);
        }



        user.sendPrivateMessage(message);


    };

    this.onActivated = function() {
        this.registerCommand("userinfo", this.cmdUserInfo);
    };

    this.onDeactivated = function() {
        this.unregisterCommand("userinfo");
    };

    /**
     *
     * @param {User} user
     */
    this.isAllowed = function(user) {
        if(user.isChannelModerator())
            return true;
        if(user.isAppManager())
            return true;
        if(user.isAppDeveloper())
            return true;




        return false;
    };




    App.registerModule(this);
}

UserInfo.self = new UserInfo();




