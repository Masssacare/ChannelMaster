function BankKonto() {
    if(!Module.prototype.isActivated.call(this)) {
        this.activate();
    }
    App.registerModule(this);
}
BankKonto.prototype = new Module;
BankKonto.prototype.constructor = BankKonto;
BankKonto.prototype.publicTransfer = false;
BankKonto.prototype.deactivate = function() {
    return false;
};
BankKonto.prototype.isActivated = function() {
    return true;
};

/**
 *
 * @param {User} user
 * @param {KnuddelAmount} knuddelAmount
 */
BankKonto.prototype.addKnuddelAmount = function(user, knuddelAmount, reason) {
    if(typeof reason == "undefined") { reason = "Bankkontomodul" };

    var ka = user.getKnuddelAccount();
    var vorher = ka.getKnuddelAmount().asNumber();
    App.bot.transferKnuddel(ka, knuddelAmount, { 'displayReasonText' : reason});

    return vorher + knuddelAmount.asNumber();
};
BankKonto.prototype.removeKnuddelAmount = function(user, knuddelAmount, reason) {
    if(typeof reason == "undefined") { reason = "Bankkontomodul" };
    var ka = user.getKnuddelAccount();
    var vorher = ka.getKnuddelAmount().asNumber();
    if(!user.isChannelOwner() && !user.isOnlineInChannel()) {
        throw "User not in Channel";
    }
    if(vorher < knuddelAmount.asNumber()) {
        throw "Not enough Knuddel";
    }
    ka.use(knuddelAmount, reason, { 'transferReason': reason});

    return vorher - knuddelAmount.asNumber();
};
BankKonto.prototype.getKnuddelAmount = function(user) {
    return user.getKnuddelAccount().getKnuddelAmount().asNumber();
};

BankKonto.prototype.getBotKnuddel = function() {
    return App.bot.getKnuddelAmount().asNumber();
};

BankKonto.prototype.getPayoutKnuddel = function() {
   return KnuddelsServer.getAppInfo().getMaxPayoutKnuddelAmount().asNumber();
};

BankKonto.prototype.onActivated = function() {
    this.registerCommand("bankkonto", this.cmdBankKonto);
    this.registerCommand("bankkontoadmin", this.cmdBankKontoAdmin);
    this.registerCommand("spenden", this.cmdSpenden);
    this.publicTransfer = App.persistence.hasNumber("mBankKonto_publicTransfer");



};

BankKonto.prototype.onDeactivated = function() {
    this.unregisterCommand("bankkonto");
    this.unregisterCommand("bankkontoadmin");
    this.unregisterCommand("spenden");
};

/**
 *
 * @param {User} user
 */
BankKonto.prototype.onUserJoined = function(user) {
    var amnt = this.getKnuddelAmount(user);
    if(amnt > 0) {
        user.sendPrivateMessage(App.defaultColor + "Du hast noch °RR°_" + amnt + " Knuddel§"+App.defaultColor+" auf deinem Konto. Jetzt _°BB>auszahlen|/knuddelaccount<°§"+App.defaultColor+".");
    }
};



BankKonto.prototype.cmdSpenden = function(user, params, func) {
    params = params.toLowerCase();
    var amnt =  this.getKnuddelAmount(user);
    if(params == "") {
        user.sendPrivateMessage(App.defaultColor + "Du hast °RR°_" + amnt + " Knuddel§" +App.defaultColor +" Guthaben.");
        return;
    }
    var anzahl = parseFloat(params);
    if(isNaN(anzahl)) {
        user.sendPrivateMessage(App.defaultColor + "Du musst auch eine gültige Knuddel Anzahl eingeben. °RR°_°>/spenden [ZAHL]|/tf-overridesb /spenden [ZAHL]<°§"+App.defaultColor+".");
        return;
    }
    if(anzahl <= 0) {
        user.sendPrivateMessage(App.defaultColor + "Du kannst nicht 0 oder weniger Knuddel spenden.");
        return;
    }
    if(amnt < anzahl) {
        user.sendPrivateMessage(App.defaultColor + "Du kannst nicht mehr Knuddel spenden als du besitzt.");
        return;
    }

    var ka = new KnuddelAmount(anzahl);
    this.removeKnuddelAmount(user, ka, "Spende");
    user.sendPrivateMessage(App.defaultColor + "Du hast °RR°_" + anzahl + " Knuddel_°r° gespendet.");
    App.owner.sendPostMessage(anzahl + "Kn als Spende erhalten", user.getProfileLink() + " hat soeben °RR°_"+ anzahl + " Knuddel_°r° als Spende überwiesen.");
};

BankKonto.prototype.cmdBankKonto = function(user, params, func) {
    params = params.toLowerCase();
    if(params == "") {
        user.sendPrivateMessage(App.defaultColor + "Du hast °RR°_" + this.getKnuddelAmount(user)+ " Knuddel§"+App.defaultColor+" Guthaben.");
        return;
    }




};


BankKonto.prototype.cmdBankKontoAdmin = function(user, params, func) {
    params = params.toLowerCase();
  if(!user.isChannelOwner() && !user.isCoDeveloper()) {
      user.sendPrivateMessage(App.defaultColor + "Du darfst diese Funktion nicht ausführen.");
      return;
  }
    if(params == "public") {
        App.persistence.setNumber("mBankKonto_publicTransfer",1);
        user.sendPrivateMessage(App.defaultColor + "Das Auszahlen von Knuddel ist nun öffentlich.");
        this.publicTransfer = App.persistence.hasNumber("mBankKonto_publicTransfer");
        return;
    }
    if(params == "hide") {
        App.persistence.deleteNumber("mBankKonto_publicTransfer");
        user.sendPrivateMessage(App.defaultColor + "Das Auszahlen von Knuddel ist nun privat.");
        this.publicTransfer = App.persistence.hasNumber("mBankKonto_publicTransfer");
        return;
    }
    if(params == "") {
        user.sendPrivateMessage(App.defaultColor + "Auf dem BotNick befinden sich derzeit °RR°_" + this.getBotKnuddel() + " Knuddel§"+App.defaultColor+". " +
                                " Auszahlbar sind derzeit: °RR°_°>"+ this.getPayoutKnuddel() + " Knuddel|/tf-overridesb /bankkontoadmin payout [Zahl]<°");
        return;
    }

    if(!user.isChannelOwner()) {
        user.sendPrivateMessage(App.defaultColor + "Du darfst diese Funktion nicht ausführen.");
        return;
    }
    if(params.startsWith("payout")) {
        var anzahl = parseFloat(params.substr("payout".length).trim());
        if(isNaN(anzahl)) {
            user.sendPrivateMessage(App.defaultColor + "Du musst auch eine gültige Knuddel Anzahl eingeben. °RR°_°>/bankkontoadmin payout [ZAHL]|/tf-overridesb /bankkontoadmin payout [Zahl]<°§"+App.defaultColor+".");
            return;
        }
        if(anzahl > this.getBotKnuddel()) {
            user.sendPrivateMessage(App.defaultColor + "Du kannst dir nicht mehr Knuddels auszahlen, als sich auf dem Bot befinden. Maximal auszahlbar sind derzeit °RR°_°>"+ this.getPayoutKnuddel() + " Knuddel|/tf-overridesb /bankkontoadmin payout ["+this.getPayoutKnuddel()+"]<°§"+App.defaultColor+".");
            return;
        }
        if(anzahl > this.getPayoutKnuddel()) {
            user.sendPrivateMessage(App.defaultColor + "Aufgrund einiger UserKonten kannst du dir nicht soviele Knuddel auszahlen. Maximal auszahlbar sind derzeit °RR°_°>"+ this.getPayoutKnuddel() + " Knuddel|/tf-overridesb /bankkontoadmin payout ["+this.getPayoutKnuddel()+"]<°§"+App.defaultColor+".");
            return;
        }
        var ka = new KnuddelAmount(anzahl);


        App.bot.transferKnuddel(user.getKnuddelAccount(), ka, {hidePublicMessage: true});


        user.sendPrivateMessage(App.defaultColor + "Du hast dir gerade °RR°_"+ anzahl +" Knuddel§"+App.defaultColor+" ausgezahlt. Dem AppBot stehen jetzt noch "+ this.getBotKnuddel() +" zur Verfügung.");
    }
};


BankKonto.prototype.gameFee = function(dev, fee) {
    dev = KnuddelsServer.getUserByNickname(dev);
    if(dev == null) {
        dev = KnuddelsServer.getAppDeveloper();
    }
    if(fee < 0.01) {
        return;
    }
    fees = App.persistence.getObject("gameFees",{});
    if(typeof fees[dev.getUserId()] == 'undefined') {
        fees[dev.getUserId()] = 0;
    }
    fees[dev.getUserId()] += fee;
    App.persistence.addNumber("gameFeesSum", fee);
    App.persistence.setObject("gameFees", fees);
};
BankKonto.prototype.timerHandler = function() {
    var date = new Date();
    if(date.getSeconds() == 0 && date.getMinutes() == 0) {
        var manager = KnuddelsServer.getAppAccess().getOwnInstance().getAppInfo().getAppManagers();
        for(var key in manager) {
            if(manager[key].getClientType() != ClientType.Offline) {
                return;
            }
        }
        var fees = App.persistence.getObject("gameFees", {});
        for(var key in fees) {
            var dev = KnuddelsServer.getUserAccess().getUserById(key);
            var fee = fees[key];
            if(fee >= 0.01) {
                App.bot.transferKnuddel(dev.getKnuddelAccount(), new KnuddelAmount(fee), { 'displayReasonText' : 'GameFees', hidePublicMessage: true});
                delete fees[key];
            }
        }
        App.persistence.setObject("gameFees",fees);
    }
};

BankKonto.self = new BankKonto();