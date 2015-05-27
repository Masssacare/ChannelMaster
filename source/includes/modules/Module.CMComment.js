/**
 * @file Diese Datei definiert das CMComment Modul
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class CMComment
 * @extends Module
 * @constructor
 */

function CMComment() {
    App.registerModule(this);
};
CMComment.prototype = new Module;
CMComment.prototype.constructor = CMComment;


CMComment.prototype.onActivated = function () {
    App.chatCommands.cmcomment = this.cmdCMComment;
    KnuddelsServer.refreshHooks();
};
CMComment.prototype.onDeactivated = function () {
    delete  App.chatCommands.cmcomment;
    KnuddelsServer.refreshHooks();
};

CMComment.prototype.onUserJoined = function(user) {

  if(user.isChannelModerator() || user.getUserStatus().isAtLeast(UserStatus.HonoryMember)) {
      var userList = [];
      UserPersistenceNumbers.each("mCMComment_cmc_entry", function(tUser, value, index, totalCount, key) {
          userList.push("°BB>_h" + tUser.getNick().escapeKCode() + "|/cmcomment \"<°°r°");
      }, { onEnd: function() {
          if(userList.length > 0) {
              user.sendPrivateMessage("°RR°Für folgende Nutzer ist ein _/cmcomment_ eingetragen:_°r°°#°" + userList.join(", "));
          }
      }});
  }
};

/**
 *
 * @param {User} user
 * @param {string} params
 * @param {string} func
 */
CMComment.prototype.cmdCMComment = function(user, params, func) {
    if(this != CMComment.self)
        return CMComment.self.cmdCMComment(user, params, func);

    if(!user.isChannelModerator() && !user.isAtLeast(UserStatus.HonoryMember))
        return;
    if(params == "") {
        this.onUserJoined(user);
        return;
    }
    var ind = params.indexOf(":");
    if(ind == -1) {
        var tUser = KnuddelsServer.getUserByNickname(params);
        if(tUser == null) {
            user.sendPrivateMessage("Der Nutzer " + params.escapeKCode() + " existiert nicht.");
            return;
        }
        var cmcs = this.getCMC(tUser);
        if(cmcs.length == 0) {
            user.sendPrivateMessage(tUser.getProfileLink() + " hat keine CMComments.");
            return;
        } else {
            var message = tUser.getProfileLink() + " hat folgende CMComments:";
            for(var key in cmcs) {
                var cmc = cmcs[key];
                var time = new Date(cmc.time);
                var eintrager = KnuddelsServer.getUser(cmc.cm);
                message += "°#°°BB°_ " + eintrager.getProfileLink() + "_°r°: " + cmc.text + " (" + time.toGermanString() + ")";
            }
            user.sendPrivateMessage(message);
        }

        return;
    }
    var nick = params.substring(0, ind).trim();
    var comment = params.substring(ind+1).trim();
    var tUser = KnuddelsServer.getUserByNickname(nick);

    if(tUser == null) {
        user.sendPrivateMessage("Der Nutzer " + nick.escapeKCode() + " existiert nicht.");
        return;
    }
    if(comment.length < 10) {
        user.sendPrivateMessage("Deine Begründung muss mindestens 10 Zeichen lang sein.");
        return;
    }
    if(comment.length > 500) {
        user.sendPrivateMessage("Deine Begründung darf nicht länger als 500 Zeichen sein.");
        return;
    }
    var cmcs = this.getCMC(tUser);
    comment = comment.escapeKCode();
    cmcs.push({
        cm: user.getUserId(),
        text: comment,
        time: Date.now()
    });
    tUser.getPersistence().setObject("mCMComment_cmc", cmcs);
    tUser.getPersistence().addNumber("mCMComment_cmc_entry", 1);

    var users = KnuddelsServer.getChannel().getOnlineUsers(UserType.Human);
    var pmessage = "°BB°_" + user.getProfileLink() + "_°r° hat bei °BB°_" + tUser.getProfileLink() + "_°r° folgenden /cmcomment eingetragen: " + comment.escapeKCode();
    for(var i = 0; i < users.length; i++) {
        var cm = users[i];
        if(!cm.isChannelModerator() && !cm.getUserStatus().isAtLeast(UserStatus.HonoryMember))
        continue;
        cm.sendPrivateMessage(pmessage);
    }



};

/**
 *
 * @param {Date] date
 */
CMComment.prototype.timerHandler = function(date) {
  if(date.getMinutes() == 0 && date.getSeconds() == 0) { //jede stunde
      UserPersistenceNumbers.each("mCMComment_cmc_entry", function(user, value, index, totalCount, key) {
          CMComment.self.checkCMC(user);
      });
  }
};

/**
 *
 * @param {User} user
 */
CMComment.prototype.getCMC = function(user) {
    var cmc = user.getPersistence().getObject("mCMComment_cmc",[]);
    cmc = cmc.sort(function(a,b) {
        return b.time - a.time; //DESCENDING
    });
    return cmc;
};

CMComment.prototype.checkCMC = function(user) {
    //aktuellstes CMC nur
    var cmcs = this.getCMC(user);
    if(cmcs.length == 0)
        return;
    if(cmcs[0].time < (Date.now() -86400*1000)) { //neuster eintrag älter als 24 Stunden
        user.getPersistence().deleteObject("mCMComment_cmc");
        user.getPersistence().deleteNumber("mCMComment_cmc_entry");
    }
};


CMComment.self = new CMComment();