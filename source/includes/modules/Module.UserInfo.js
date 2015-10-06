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
     */
    this.onUserLeft = function(user) {
        if(user.isLikingChannel()) {
            user.getPersistence().setNumber("mUserInfo_likingChannel", 1);
        }
    };

    this.onAppStart = function() {
        var userAccess = KnuddelsServer.getUserAccess();
        userAccess.eachAccessibleUser(function(user, index, accessibleUserCount) {
            try {
                if (user.isLikingChannel()) {
                    user.getPersistence().setNumber("mUserInfo_likingChannel", 1);
                }
            }
            catch(e) {

            }
        },{});
    };

    this.cmdShowLMCs = function(user, params, func) {

        var users = App.channel.getOnlineUsers();
        for(var i in users) {
            var tUser = users[i];
            if(tUser.isLikingChannel()) {
                tUser.getPersistence().setNumber("mUserInfo_likingChannel", 1);
            }
        }


        var message = '°RR°_Folgende Nutzer haben diesen Channel als LMC gesetzt:°#°°r°';
        var arr = [];
        UserPersistenceNumbers.each("mUserInfo_likingChannel", function(user) {
            try {
                if (user.isLikingChannel()) {
                    arr.push("°BB°" + user.getProfileLink() + "°r°");
                } else {
                    user.getPersistence().deleteNumber("mUserInfo_likingChannel");
                }
            }
            catch(e) {

            }
        },
        {
            onEnd: function() {
                user.sendPrivateMessage(message + arr.join(", "));
            }
        });
    };

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
        message += "°#r°_LieblingsChannel:_ " + (tUser.isLikingChannel()?"°BB°Ja§":"°RR°Nein§");
        message += "°#r°_ClientType:_ "      + tUser.getClientType().toString();
        message += "°#r°_Status:_ "          + tUser.getUserStatus().getNumericStatus() + (tUser.isAppManager()?" (Appmanager)":"");
        if(user.isInTeam("Apps") || user.getUserStatus().isAtLeast(UserStatus.HonoryMember) || user.isCoDeveloper())
            message += "°#°_UID:_ "         +  tUser.getSystemUserId();

        message += "°#r°_Teams:_ " + tUser.getTeams().join(", ");

        var htmlFile = new HTMLFile('JavaFXCheck/test.html');
        var overlayContent = AppContent.overlayContent(htmlFile, 50, 50);
        message += "°#r°_HTML-UI:_ " + (tUser.canSendAppContent(overlayContent)?"°BB°Unterstützt§":"°RR°Nicht unterstützt§");

        message += "°#r°_Knuddelkonto:_ " + BankKonto.self.getKnuddelAmount(tUser) + " Knuddel";


        if(LastOnline.self.isActivated()) {
            var lastOnline = tUser.getPersistence().getNumber("mLastOnline_join",0);
            message += "°#r°_Zuletzt im Channel:_ " + (lastOnline==0?"Noch nie":lastOnline==-1?"Jetzt":new Date(lastOnline).toGermanString());
        }
        if(Newsletter.self.isActivated()) {
            message += "°#r°_Newsletter:_ " + (tUser.getPersistence().hasNumber("mNewsletter_news")?"°BB°Angemeldet§":"°RR°Abgemeldet§");
        }
        if(ChannelTop.self.isActivated()) {
            var timeDay         = tUser.getPersistence().getNumber("mChannelTop_onlinetime_day",    0);
            var timeWeek        = tUser.getPersistence().getNumber("mChannelTop_onlinetime_week",   0);
            var timeMonth       = tUser.getPersistence().getNumber("mChannelTop_onlinetime_month",  0);
            var timeYear        = tUser.getPersistence().getNumber("mChannelTop_onlinetime_year",   0);
            var timeAlltime     = tUser.getPersistence().getNumber("mChannelTop_onlinetime",        0);

            message += "°#r°_Onlinezeit:_ "          + ChannelTop.self.timeToString(timeAlltime);
            message += "°#r°_Onlinezeit (Tag):_ "    + ChannelTop.self.timeToString(timeDay);
            message += "°#r°_Onlinezeit (Woche):_ "  + ChannelTop.self.timeToString(timeWeek);
            message += "°#r°_Onlinezeit (Monat):_ "  + ChannelTop.self.timeToString(timeMonth);
            message += "°#r°_Onlinezeit (Jahr):_ "   + ChannelTop.self.timeToString(timeYear);
        }



        user.sendPrivateMessage(message);


    };

    this.onActivated = function() {
        this.registerCommand("userinfo", this.cmdUserInfo);
        this.registerCommand("getlmcs", this.cmdShowLMCs);
    };

    this.onDeactivated = function() {
        this.unregisterCommand("userinfo");
        this.unregisterCommand("getlmcs");
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
        if(user.isCoDeveloper())
            return true;



        return false;
    };




    App.registerModule(this);
}

UserInfo.self = new UserInfo();




