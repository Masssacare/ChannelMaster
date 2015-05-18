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
    App.chatCommands.activatemodule = this.cmdActivateModule;
    App.chatCommands.deactivatemodule = this.cmdDeactivateModule;
    KnuddelsServer.refreshHooks();
};

ModuleManager.prototype.onDeactivated = function() {
    delete App.chatCommands.activatemodule;
    delete App.chatCommands.deactivatemodule;
    KnuddelsServer.refreshHooks();
};

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


ModuleManager.prototype.onUserJoined = function(user) {
  if(user.isAppManager()||user.isAppDeveloper()) {
      var appName = KnuddelsServer.getAppName();
      var appVersion = KnuddelsServer.getAppVersion();

      var activated = [];
      for(var i = 0; i < App.modules.registered.length; i++) {
          var module = App.modules.registered[i];
          if(module.isActivated())
            activated.push(module);
      }

      user.sendPrivateMessage(
          "°#°" +
          "°BB°_"+appName+"_°r° läuft in der Version _" + appVersion + "_" +
          "°#°_Registrierte Module:_ " + App.modules.registered.join(", ") +
          "°#°_Aktivierte Module:_ " +  activated.join(", ")
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
    if(!user.isAppManager()&&!user.isAppDeveloper()) {
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
        module.onActivated();
        return;
    }
    user.sendPrivateMessage("Modul " + modulename + " konnte nicht gestartet werden.");
};

ModuleManager.prototype.cmdDeactivateModule = function (user, params, funcname) {
    var modulename = params.trim().stripKCode();
    if(!user.isAppManager()&&!user.isAppDeveloper()) {
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
        module.onDeactivated();
        return;
    }
    user.sendPrivateMessage("Modul " + modulename + " konnte nicht beendet werden.");
};


ModuleManager.self = new ModuleManager;