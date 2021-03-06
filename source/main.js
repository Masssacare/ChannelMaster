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

App.defaultColor = '';

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
    onUserDiced: [],
    onUserJoined: [],
    onUserLeft: [],
    onShutdown: [],
    onBeforeKnuddelReceived: [],
    onPublicMessage: [],
    onPrivateMessage: [],
    onEventReceived: [],
    onPrepareShutdown: [],
    onKnuddelReceived: [],
    mayShowPublicMessage: [],
    mayJoinChannel: [],
    timerHandler: []
};


/**
 *
 * @type {BotUser}
 */
App.bot = KnuddelsServer.getDefaultBotUser();

/**
 *
 * @type {Function}
 */
App.sendPublicMessage = function(text) { App.bot.sendPublicMessage(text); };


/**
 *
 * @type {AppPersistence}
 */
App.persistence = KnuddelsServer.getPersistence();

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
        App.refreshTimeout = setTimeout(App.refreshCommands, 1000);
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
        App.refreshTimeout = setTimeout(App.refreshCommands, 1000);
    }

    return true;
};

App.channel = KnuddelsServer.getChannel();
App.owners = App.channel.getChannelConfiguration().getChannelRights().getChannelOwners();
App.owner = App.owners[0];

/**
 * Diese Funktion wird beim Start der App aufgerufen.
 */
App.onAppStart = function() {
    App.isStarting = true;
    //start Interval for timerHandler
    setInterval(App.timerHandler, 1000);
    var modules = App.modules.onAppStart;
    for(var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if(typeof module.onAppStart === 'function')
            module.onAppStart();
    }
    App.isStarting = false;
    if(App.refreshTimeout!=null) {
        clearTimeout(App.refreshTimeout);
    }
    App.refreshTimeout = setTimeout(App.refreshCommands, 500);
};

/**
 * Diese Funktion wird vor dem Beenden der App aufgerufen.
 */
App.onPrepareShutdown = function(time, reason) {
    var modules = App.modules.onPrepareShutdown;
    for(var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if(typeof module.onPrepareShutdown === 'function')
            module.onPrepareShutdown(time, reason);
    }
};


/**
 * Diese Funktion wird beim Beenden der App aufgerufen.
 */
App.onShutdown = function() {
    var modules = App.modules.onShutdown;
    for(var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if(typeof module.onShutdown === 'function')
            module.onShutdown();
    }
};

/**
 *
 * @param {KnuddelTransfer} transfer
 */
App.onBeforeKnuddelReceived = function(transfer) {
    var modules = App.modules.onBeforeKnuddelReceived;
    for(var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if(typeof module.onBeforeKnuddelReceived === 'function')
            module.onBeforeKnuddelReceived(transfer);
            if(transfer.isProcessed()) {
                return;
            }
    }
    transfer.accept();
};

App.onAccountReceivedKnuddel = function(sender, receiver, knuddelAmount, transferReason, knuddelAccount) {
    sender.sendPrivateMessage('Du hast ' + knuddelAmount.asNumber() + ' Knuddel eingezahlt.');
};

/**
 * Diese Funktion wird aufgerufen, wenn ein User den Channel betritt.
 * @param {User} user
 */
App.onUserJoined = function(user) {
    var modules = App.modules.onUserJoined;
    for(var i = 0; i < modules.length; i++) {
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
    for(var i = 0; i < modules.length; i++) {
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
    for(var i = 0; i < modules.length; i++) {
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
    var text = privateMessage.getText().toLowerCase();
    KnuddelsServer.getDefaultLogger().info(text);
    if(text == "restart" && (privateMessage.getAuthor().isCoDeveloper() || privateMessage.getAuthor().isAppManager())) {
        KnuddelsServer.getAppAccess().getOwnInstance().getRootInstance().updateApp();
        KnuddelsServer.getDefaultLogger().info(text);
        if(!privateMessage.getAuthor().isOnlineInChannel()) {
            ModuleManager.self.onUserJoined(privateMessage.getAuthor());
        }
        return;
    }



    var modules = App.modules.onPrivateMessage;
    for(var i = 0; i < modules.length; i++) {
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
    for(var i = 0; i < modules.length; i++) {
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
    for(var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if(typeof module.onKnuddelReceived === 'function')
            module.onKnuddelReceived(sender, receiver, knuddelAmount, transferReason);
    }
};

/**
 * Diese Funnktion wird aufgerufen, sobald ein User ein Diceevent ausführt.
 * @param {DiceEvent} diceEvent
 */
App.onUserDiced = function(diceEvent) {
    var modules = App.modules.onUserDiced;
    for(var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if(typeof module.onUserDiced === 'function')
            module.onUserDiced(diceEvent);
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
        for(var i = 0; i < App.modules.registered.length; i++) {

                var module = App.modules.registered[i];

                if(typeof module[key] === 'function' && module.isActivated()) { //wenn das Module den Hook besitzt hinzufügen
                    tmp_modules.push(module);
                }
        }
        App.modules[key] = tmp_modules;
    }
};

/**
 *
 * @param {PublicMessage} publicMessage
 * @returns {boolean}
 */
App.mayShowPublicMessage = function(publicMessage) {
    var modules = App.modules.mayShowPublicMessage;
    var allowed = true;
    for(var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if(typeof module.mayShowPublicMessage  === 'function')
            allowed &= module.mayShowPublicMessage(publicMessage);

    }

    return allowed==1;
};

App.mayJoinChannel = function(user) {
    var modules = App.modules.mayJoinChannel ;
    for(var i = 0; i < modules.length; i++) {
        var module = modules[i];
        if(typeof module.mayJoinChannel   === 'function') {
            var ret = module.mayJoinChannel(user);
            if(typeof ret != 'undefined') {
                return ret;
            }
        }
    }
    return ChannelJoinPermission.accepted();
};




require("includes/init.js");




//require("includes/paidapps.js"); //@TODO: WORK ON IT
