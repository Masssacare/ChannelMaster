/**
 * @file Mainfile executed by Appserver
 * @author KnuddelsTools
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */

/**
 * Standard APP Object
 * @type {{}}
 */
var App = {};

/**
 *
 * @type {boolean}
 */
App.isStarting = false;

App.projectURL = "https://github.com/KnuddelsTools/ChannelMaster";

/**
 * In diesem Objekt werden Chatbefehle registriert
 * @type {{}}
 */
App.chatCommands = {};

/**
 * Hier werden die Hooks für die unterschiedlichen Module geladen.
 * @type {{registered: Array, onAppStart: Array, onUserJoined: Array, onUserLeft: Array, onShutdown: Array, onPublicMessage: Array, onPrivateMessage: Array, onEventReceived: Array, onKnuddelReceived: Array, timerHandler: Array}}
 */
App.modules = {
    registered: [],
    onAppStart: [],
    onUserJoined: [],
    onUserLeft: [],
    onShutdown: [],
    onPublicMessage: [],
    onPrivateMessage: [],
    onEventReceived: [],
    onKnuddelReceived: [],
    timerHandler: []
};

/**
 * Gibt die Instanz vom Modul zurück. Wenn die Instanz nicht gefunden wird, wird NULL returned.
 * @param {String} modulename
 * @returns {Module}
 */
App.getModule = function(modulename) {
    for(var i = 0; i < App.modules.registered.length; i++) {
        var module = App.modules.registered[i];
        if(module.toString() == modulename)
            return module;
    }
    return null;
};

App.refreshTimeout = null;

App.refreshCommands = function() {
    KnuddelsServer.refreshHooks();
    App.refreshTimeout = null;
};

App.registerCommand = function (command, func) {
    if(typeof App.chatCommands[command] === 'function') {
        return false;
    }
    App.chatCommands[command] = func;


    if(!this.isStarting) {
        if(App.refreshTimeout!=null) {
            clearTimeout(App.refreshTimeout);
        }
        App.refreshTimeout = setTimeout(App.refreshCommands, 500);
    }

    return true;
};

App.unregisterCommand = function (command) {
    if(typeof App.chatCommands[command] !== 'function') {
        return false;
    }
    delete App.chatCommands[command];
    if(!this.isStarting) {
        if(App.refreshTimeout!=null) {
            clearTimeout(App.refreshTimeout);
        }
        App.refreshTimeout = setTimeout(App.refreshCommands, 500);
    }

    return true;
};

/**
 * Diese Funktion wird beim Start der App aufgerufen.
 */
App.onAppStart = function() {
    App.isStarting = true;
    //start Interval for timerHandler
    setInterval(App.timerHandler, 1000);

    App.refreshHooks();

    var modules = App.modules.onAppStart;
    for(var i = 0; i < modules; i++) {
        var module = modules[i];
        if(typeof module.onAppStart === 'function')
            module.onAppStart();
    }
    App.isStarting = false;
};

/**
 * Diese Funktion wird beim Beenden der App aufgerufen.
 */
App.onShutdown = function() {
    var modules = App.modules.onShutdown;
    for(var i = 0; i < modules; i++) {
        var module = modules[i];
        if(typeof module.onShutdown === 'function')
            module.onShutdown();
    }
};

/**
 * Diese Funktion wird aufgerufen, wenn ein User den Channel betritt.
 * @param {User} user
 */
App.onUserJoined = function(user) {
    var modules = App.modules.onUserJoined;
    for(var i = 0; i < modules; i++) {
        var module = modules[i];
        if(typeof module.onUserJoined === 'function')
            module.onUserJoined(user);
    }
};


/**
 * Diese Funktion wird aufgerufen, wenn ein User den Channel verlässt.
 * @param {User} user
 */
App.onUserLeft = function(user) {
    var modules = App.modules.onUserJoined;
    for(var i = 0; i < modules; i++) {
        var module = modules[i];
        if(typeof module.onUserLeft === 'function')
            module.onUserLeft(user);
    }
};

/**
 * Diese Funktion wird aufgerufen, wenn ein User eine öffentliche Nachricht schreibt.
 * @param {PublicMessage} publicMessage
 */
App.onPublicMessage = function(publicMessage) {
    var modules = App.modules.onPublicMessage;
    for(var i = 0; i < modules; i++) {
        var module = modules[i];
        if(typeof module.onPublicMessage === 'function')
            module.onPublicMessage(publicMessage);
    }
};

/**
 * Diese Funktion wird aufgerufen, wenn ein User privat zum Bot schreibt.
 * @param {PrivateMessage} privateMessage
 */
App.onPrivateMessage = function(privateMessage) {
    var modules = App.modules.onPrivateMessage;
    for(var i = 0; i < modules; i++) {
        var module = modules[i];
        if(typeof module.onPrivateMessage === 'function')
            module.onPrivateMessage(privateMessage);
    }
};

/**
 * Diese Funktion wird aufgerufen, wenn das HTMLUI ein Event an den Server schickt
 * @param {User} user
 * @param {String} key
 * @param {String} data
 */
App.onEventReceived = function(user, key, data) {
    var modules = App.modules.onEventReceived;
    for(var i = 0; i < modules; i++) {
        var module = modules[i];
        if(typeof module.onEventReceived === 'function')
            module.onEventReceived(user, key, data);
    }
};

/**
 * Diese Funnktion wird aufgerufen, sobald ein BotUser Knuddel von einem User erhalten hat.
 * @param {User} sender
 * @param {BotUser} receiver
 * @param {KnuddelAmount} knuddelAmount
 * @param {String} transferReason
 */
App.onKnuddelReceived = function(sender, receiver, knuddelAmount, transferReason) {
    var modules = App.modules.onKnuddelReceived;
    for(var i = 0; i < modules; i++) {
        var module = App.modules[i];
        if(typeof module.onKnuddelReceived === 'function')
            module.onKnuddelReceived(sender, receiver, knuddelAmount, transferReason);
    }
};

/**
 * Diese Funktion wird jede Sekunde aufgerufen
 */
App.timerHandler = function() {
    var date = new Date();
    var modules = App.modules.timerHandler;
    for(var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if(typeof module.timerHandler === 'function')
            module.timerHandler(date);
    }
};


/**
 * Registriert ein Modul
 * @param {Module} module
 * @returns {boolean}
 */
App.registerModule = function(module) {

    var pos = App.modules.registered.indexOf(module);
    if(pos == -1) {
        App.modules.registered.push(module);
        App.refreshHooks();
        if(module.isActivated()) {
            module.onActivated();
        }
        return true;
    } else {
        return false;
    }
};

/**
 * Entfernt ein Modul
 * @param {Module} module
 * @returns {boolean}
 */
App.unregisterModule = function(module) {
    var pos = App.modules.registered.indexOf(module);
    if(pos != -1) {
        App.modules.registered.splice(pos,1);
        App.refreshHooks();
        return true;
    } else {
        return false;
    }
};

/**
 * Diese Funktion aktualisiert alle Hooks
 */
App.refreshHooks = function() {
    var hookKeys =  [];
    for(var key in App.modules) {
        if(key == "registered") //registered benötigen wir nicht
            continue;
        hookKeys.push(key);
    }

    //gehe alle hookKeys durch
    for(var j = 0; j < hookKeys.length; j++) {
        var key = hookKeys[j];
        var tmp_modules = [];

        //gehe alle Module durch
        for(var i = 0; i < App.modules.registered; i++) {
                var module = App.modules.registered[i];
                if(typeof module[key] === 'function' && module.isActivated()) { //wenn das Module den Hook besitzt hinzufügen
                    tmp_modules.push(module);
                }
        }
        App.modules[key] = tmp_modules;
    }
};



require("includes/init.js");