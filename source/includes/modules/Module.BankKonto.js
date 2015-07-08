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
BankKonto.prototype.addKnuddelAmount = function(user, knuddelAmount) {
    return parseFloat(user.getPersistence().addNumber("mBankKontoKonto_amount",knuddelAmount.asNumber()).toFixed(2));
};
BankKonto.prototype.removeKnuddelAmount = function(user, knuddelAmount) {
    var abzug = -1 * knuddelAmount.asNumber();
    abzug = parseFloat(abzug.toFixed(2));
    return parseFloat(user.getPersistence().addNumber("mBankKontoKonto_amount", abzug).toFixed(2));
};
BankKonto.prototype.getKnuddelAmount = function(user) {
    return parseFloat(user.getPersistence().getNumber("mBankKontoKonto_amount",0).toFixed(2));
};

BankKonto.prototype.getBotKnuddel = function() {
    return parseFloat(App.bot.getKnuddelAmount().asNumber().toFixed(2));
};

BankKonto.prototype.getPayoutKnuddel = function() {
   return parseFloat((this.getBotKnuddel() - parseFloat(UserPersistenceNumbers.getSum("mBankKontoKonto_amount").toFixed(2))).toFixed(2));

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
        user.sendPrivateMessage("Du hast noch °RR°_" + amnt + " Knuddel°r°_ auf deinem Konto. Jetzt _°BB>auszahlen|/tf-overridesb /bankkonto payout [ZAHL]<°_°r°.");
    }
};

BankKonto.prototype.onKnuddelReceived = function(sender, recv, knuddelAmount, transferReason) {
        if(transferReason == "" || transferReason.toLowerCase() == "bankkonto") {
            var newKonto = this.addKnuddelAmount(sender, knuddelAmount);
            sender.sendPrivateMessage("Du hast nun °RR°_" + newKonto + " Knuddel_°r° auf deinem Konto.");
        } else if(transferReason.toLowerCase() == "spende"){
            App.owner.sendPostMessage(knuddelAmount + "Kn als Spende erhalten", sender.getProfileLink() + " hat soeben °RR°_"+knuddelAmount + " Knuddel_°r° als Spende überwiesen.");
            sender.sendPrivateMessage("Du hast dem AppBot soeben "+ knuddelAmount + " als Spende überwiesen.");
        } else {
            sender.sendPrivateMessage("Du hast dem AppBot soeben "+ knuddelAmount + " überwiesen.");
        }
};


BankKonto.prototype.cmdSpenden = function(user, params, func) {
    params = params.toLowerCase();
    var amnt =  this.getKnuddelAmount(user);
    if(params == "") {
        user.sendPrivateMessage("Du hast °RR°_" + amnt + " Knuddel_°r° Guthaben.");
        return;
    }
    var anzahl = parseFloat(params);
    if(isNaN(anzahl)) {
        user.sendPrivateMessage("Du musst auch eine gültige Knuddel Anzahl eingeben. °RR°_°>/spenden [ZAHL]|/tf-overridesb /spenden [ZAHL]<°°r°_.");
        return;
    }
    if(anzahl <= 0) {
        user.sendPrivateMessage("Du kannst nicht 0 oder weniger Knuddel spenden.");
        return;
    }
    if(amnt < anzahl) {
        user.sendPrivateMessage("Du kannst nicht mehr Knuddel spenden als du besitzt.");
        return;
    }

    var ka = new KnuddelAmount(anzahl);
    this.removeKnuddelAmount(user, ka);
    user.sendPrivateMessage("Du hast °RR°_" + anzahl + " Knuddel_°r° gespendet.");
    App.owner.sendPostMessage(anzahl + "Kn als Spende erhalten", sender.getProfileLink() + " hat soeben °RR°_"+ anzahl + " Knuddel_°r° als Spende überwiesen.");
};

BankKonto.prototype.cmdBankKonto = function(user, params, func) {
    params = params.toLowerCase();
    if(params == "") {
        user.sendPrivateMessage("Du hast °RR°_" + this.getKnuddelAmount(user)+ " Knuddel_°r° Guthaben.");
        return;
    }



    if(params.startsWith("payout")) {
        var anzahl = parseFloat(params.substr("payout".length).trim());
        if(isNaN(anzahl)) {
            user.sendPrivateMessage("Du musst auch eine gültige Knuddel Anzahl eingeben. °RR°_°>/bankkonto payout ZAHL|/tf-overridesb /bankkonto payout [Zahl]<°°r°_.");
            return;
        }
        if(anzahl <= 0) {
            user.sendPrivateMessage("Dukannst nicht 0 oder weniger Knuddel abheben.");
            return;
        }
        if(anzahl > this.getKnuddelAmount(user)) {
            user.sendPrivateMessage("Du besitzt nur °RR°_" + this.getKnuddelAmount(user) + " Knuddel_°r°.");
            return;
        }
        //steuern beachtung
        var needed = anzahl;
        //needed = needed*1.666666;
        if(needed>App.bot.getKnuddelAmount().asNumber()) {
            user.sendPrivateMessage("Soviele Knuddel können dir derzeit nicht ausgezahlt werden. Bitte wende dich an den Channelbesitzer.");
            return;
        }
        var ka = new KnuddelAmount(anzahl);
        App.bot.transferKnuddel(user, ka, {hidePublicMessage: !this.publicTransfer});
        var guthaben = this.removeKnuddelAmount(user, ka);
        user.sendPrivateMessage("Du hast nun °RR°_"+guthaben+" Knuddel_°r° auf deinem Konto.");
    }
};


BankKonto.prototype.cmdBankKontoAdmin = function(user, params, func) {
    params = params.toLowerCase();
  if(!user.isChannelOwner() && !user.isCoDeveloper()) {
      user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
      return;
  }
    if(params == "public") {
        App.persistence.setNumber("mBankKonto_publicTransfer",1);
        user.sendPrivateMessage("Das Auszahlen von Knuddel ist nun öffentlich.");
        this.publicTransfer = App.persistence.hasNumber("mBankKonto_publicTransfer");
        return;
    }
    if(params == "hide") {
        App.persistence.deleteNumber("mBankKonto_publicTransfer");
        user.sendPrivateMessage("Das Auszahlen von Knuddel ist nun privat.");
        this.publicTransfer = App.persistence.hasNumber("mBankKonto_publicTransfer");
        return;
    }
    if(params == "") {
        user.sendPrivateMessage("Auf dem BotNick befinden sich derzeit °RR°_" + this.getBotKnuddel() + " Knuddel°r°_. " +
                                " Auszahlbar sind derzeit: °RR°_°>"+ this.getPayoutKnuddel() + " Knuddel|/tf-overridesb /bankkontoadmin payout [Zahl]<°°r°_");
        return;
    }

    if(!user.isChannelOwner()) {
        user.sendPrivateMessage("Du darfst diese Funktion nicht ausführen.");
        return;
    }
    if(params.startsWith("payout")) {
        var anzahl = parseFloat(params.substr("payout".length).trim());
        if(isNaN(anzahl)) {
            user.sendPrivateMessage("Du musst auch eine gültige Knuddel Anzahl eingeben. °RR°_°>/bankkontoadmin payout [ZAHL]|/tf-overridesb /bankkontoadmin payout [Zahl]<°°r°_.");
            return;
        }
        if(anzahl > this.getBotKnuddel()) {
            user.sendPrivateMessage("Du kannst dir nicht mehr Knuddels auszahlen, als sich auf dem Bot befinden. Maximal auszahlbar sind derzeit °RR°_°>"+ this.getPayoutKnuddel() + " Knuddel|/tf-overridesb /bankkontoadmin payout ["+this.getPayoutKnuddel()+"]<°°r°_.");
            return;
        }
        if(anzahl > this.getPayoutKnuddel()) {
            user.sendPrivateMessage("Aufgrund einiger UserKonten kannst du dir nicht soviele Knuddel auszahlen. Maximal auszahlbar sind derzeit °RR°_°>"+ this.getPayoutKnuddel() + " Knuddel|/tf-overridesb /bankkontoadmin payout ["+this.getPayoutKnuddel()+"]<°°r°_.");
            return;
        }
        var ka = new KnuddelAmount(anzahl);


        App.bot.transferKnuddel(user, ka, {hidePublicMessage: true});


        user.sendPrivateMessage("Du hast dir gerade °RR°_"+ anzahl +" Knuddel°r°_ ausgezahlt. Dem AppBot stehen jetzt noch "+ this.getBotKnuddel() +" zur Verfügung.");
    }
};

BankKonto.self = new BankKonto();