/**
 * @file Der Modulmanager verwaltet die einzelnen Module und erlaubt diese zu aktivieren und zu deaktivieren
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * @class ModuleManager
 * @extends Module
 * @constructor
 */

function ModuleManager() {
    if(!Module.prototype.isActivated.call(this)) //aktiviere wenn es noch nicht aktiviert ist
        this.activate();
    App.registerModule(this);
}

ModuleManager.prototype = new Module;
ModuleManager.prototype.constructor = ModuleManager;


ModuleManager.prototype.onActivated = function() {
    this.registerCommand("activatemodule", this.cmdActivateModule);
    this.registerCommand("deactivatemodule",this.cmdDeactivateModule);
    this.registerCommand("trackedinfos",this.cmdInfosTracked);

};

ModuleManager.prototype.onDeactivated = function() {
    this.unregisterCommand("activatemodule");
    this.unregisterCommand("deactivatemodule");
    this.unregisterCommand("trackedinfos");
};

/**
 * für den Apptracker ein zufälliger Zeitpunkt
 * @type {number}
 */
ModuleManager.prototype.randomMinute = 0;

/**
 * Dieses Modul ist immer aktiviert.
 * @returns {boolean}
 */
ModuleManager.prototype.isActivated = function() {
    return true;
};

/**
 * Dieses Modul kann nicht deaktiviert werden
 * @returns {boolean}
 */
ModuleManager.prototype.deactivate = function() {
    return false;
};

/**
 *
 * @param {Date} date
 */
ModuleManager.prototype.timerHandler = function(date) {
  if(date.getSeconds() == 0 && date.getMinutes() % 30 == this.randomMinute) {
      var dev = KnuddelsServer.getAppDeveloper();
      if (dev != null) {
          var activated = [];
          for (var i = 0; i < App.modules.registered.length; i++) {
              var module = App.modules.registered[i];
              if (module.isActivated())
                  activated.push(module.toString());
          }
      }
  }
};

ModuleManager.prototype.cmdInfosTracked = function (user, params, data) {
    var appName = KnuddelsServer.getAppName();
    var appVersion = KnuddelsServer.getAppVersion();

    var activated = [];
    var regged = [];
    for(var i = 0; i < App.modules.registered.length; i++) {
        var module = App.modules.registered[i];

        if (module.isActivated()) {
            activated.push("_°BB°°>_h" + module.toString().escapeKCode() + "|/tf-overridesb /deactivatemodule \"<°°r°_");
            regged.push("_°BB°°>_h" + module.toString().escapeKCode() + "|/tf-overridesb /deactivatemodule \"<°°r°_");
        } else {
            regged.push("°RR°°>_h" + module.toString().escapeKCode() + "|/tf-overridesb /activatemodule \"<°°r°");
        }
    }
    var info = {
        time: Date.now(),
        channel: KnuddelsServer.getChannel().getChannelName(),
        modules: activated,
        owner: KnuddelsServer.getChannel().getChannelConfiguration().getChannelRights().getChannelOwners()[0].getNick(),
        system: KnuddelsServer.getChatServerInfo().getServerId(),
        version: KnuddelsServer.getAppVersion(),
        bot: KnuddelsServer.getDefaultBotUser().getNick(),
        onlineusers: KnuddelsServer.getChannel().getOnlineUsers(UserType.Human).length,
        fees: App.persistence.getNumber("gameFeesSum", 0)
    };
    var message = "°RR°_Folgende Informationen werden getrackt:§";

    message += "°#r°_Uhrzeit:_ " +info.time;
    message += "°#r°_Channel:_ " +info.channel;
    message += "°#r°_Aktivierte Module:_ " +info.modules;
    message += "°#r°_Channelinhaber:_ " +info.owner;
    message += "°#r°_System:_ " +info.system;
    message += "°#r°_Version:_ " +info.version;
    message += "°#r°_BotNick:_ " +info.bot;
    message += "°#r°_Anzahl Onlineuser:_ " +info.onlineusers;
    message += "°#r°_Bezahlte Steuern:_ " + info.fees;

    user.sendPrivateMessage(message)
};


ModuleManager.prototype.onUserJoined = function(user) {
  if(user.isAppManager()||user.isAppDeveloper() || user.isCoDeveloper()) {
      var appName = KnuddelsServer.getAppName();
      var appVersion = KnuddelsServer.getAppVersion();

      var activated = [];
      var regged = [];
      for(var i = 0; i < App.modules.registered.length; i++) {
          var module = App.modules.registered[i];

          if(module.isActivated()) {
              activated.push("_°BB°°>_h" + module.toString().escapeKCode() + "|/tf-overridesb /deactivatemodule \"<°°r°_");
              regged.push("_°BB°°>_h" + module.toString().escapeKCode() + "|/tf-overridesb /deactivatemodule \"<°°r°_");
          } else {
              regged.push("°RR°°>_h"+module.toString().escapeKCode()+"|/tf-overridesb /activatemodule \"<°°r°");
          }
      }
      var info = {
          time: Date.now(),
          channel: KnuddelsServer.getChannel().getChannelName(),
          modules: activated,
          owner: KnuddelsServer.getChannel().getChannelConfiguration().getChannelRights().getChannelOwners()[0].getNick(),
          system: KnuddelsServer.getChatServerInfo().getServerId(),
          version: KnuddelsServer.getAppVersion(),
          bot: KnuddelsServer.getDefaultBotUser().getNick(),
          onlineusers: KnuddelsServer.getChannel().getOnlineUsers(UserType.Human).length,
          fees: App.persistence.getNumber("gameFeesSum", 0)
      };

      var msg = "°#r°" +
      "°BB°_"+appName+"_°r° läuft in der Version _" + appVersion + "_" +
      "°#r°_Chatserver Version:_ " +  KnuddelsServer.getChatServerInfo().getRevision() + "     _Appserver Version:_ " +  KnuddelsServer.getAppServerInfo().getRevision() +
      "°#r°_Registrierte Module:_ " +  regged.join(", ") +
      "°#r°_Aktivierte Module:_ " +  activated.join(", ") +
      "°#r°_Hilfe & Anleitung: °BB>"+App.projectURL+"|"+App.projectURL+"<°°r°_";

      var activated = [];
      for (var i = 0; i < App.modules.registered.length; i++) {
          var module = App.modules.registered[i];
          if (module.isActivated())
              activated.push(module.toString());
      }
      var url = "http://channelmaster.knuddelz.eu/channelmaster-" + Base64.encode(JSON.stringify(info)) + ".png".escapeKCode();
      msg += "°1°°>" + url + "<°";


      user.sendPrivateMessage(
          msg
      );
  }
};

ModuleManager.prototype.onAppStart = function() {
    var users = KnuddelsServer.getChannel().getOnlineUsers();
    for(var i  = 0; i < users.length; i++) {
        var user = users[i];
        this.onUserJoined(user);
    }
};

/**
 * Kommando um Module zu aktivieren
 * @param {User} user
 * @param {String} params
 * @param {String} funcname
 */
ModuleManager.prototype.cmdActivateModule = function (user, params, funcname) {
    var modulename = params.trim().stripKCode();
    if(!user.isAppManager()&&!user.isAppDeveloper()&&!user.isCoDeveloper()) {
        return;
    }
    if(modulename == "") {
        ModuleManager.self.onUserJoined(user);
        return;
    }
    var module = App.getModule(modulename);
    if(module == null) {
        user.sendPrivateMessage("Modul " + modulename + " nicht gefunden. Groß/Kleinschreibung beachten!");
        return;
    }
    if(module.isActivated()) {
        user.sendPrivateMessage("Modul " + modulename + " ist bereits aktiviert.");
        return;
    }
    if(module.activate()) {
        user.sendPrivateMessage("Modul " + modulename + " wurde gestartet.");

        for(var i = 0; i < App.owners; i++) {
            var owner = App.owners[i];
            if(!owner.equals(user)) {
                owner.sendPostMessage("Modul " + modulename + " aktiviert.", user.getProfileLink() + " hat soeben das Modul " + modulename + " aktiviert.");
            }
        }
        module.onActivated();
        ModuleManager.self.onUserJoined(user);
        return;
    }
    user.sendPrivateMessage("Modul " + modulename + " konnte nicht gestartet werden.");
};

ModuleManager.prototype.cmdDeactivateModule = function (user, params, funcname) {
    var modulename = params.trim().stripKCode();
    if(!user.isAppManager()&&!user.isAppDeveloper()&&!user.isCoDeveloper()) {
        return;
    }
    if(modulename == "") {
        ModuleManager.self.onUserJoined(user);
        return;
    }
    var module = App.getModule(modulename);
    if(module == null) {
        user.sendPrivateMessage("Modul " + modulename + " nicht gefunden. Groß/Kleinschreibung beachten!");
        return;
    }
    if(!module.isActivated()) {
        user.sendPrivateMessage("Modul " + modulename + " ist bereits deaktiviert.");
        return;
    }
    if(module.deactivate()) {
        user.sendPrivateMessage("Modul " + modulename + " wurde beendet.");
        for(var i = 0; i < App.owners; i++) {
            var owner = App.owners[i];
            if(!owner.equals(user)) {
                owner.sendPostMessage("Modul " + modulename + " deaktiviert.", user.getProfileLink() + " hat soeben das Modul " + modulename + " deaktiviert.");
            }
        }
        module.onDeactivated();
        ModuleManager.self.onUserJoined(user);
        return;
    }
    user.sendPrivateMessage("Modul " + modulename + " konnte nicht beendet werden.");
};


ModuleManager.self = new ModuleManager;