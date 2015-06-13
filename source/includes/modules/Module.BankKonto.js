function BankKonto() {
    if(!Module.prototype.isActivated.call(this)) {
        this.activate();
    }
    App.registerModule(this);
}
BankKonto.prototype = new Module;
BankKonto.prototype.constructor = BankKonto;

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

BankKonto.prototype.onActivated = function() {
    this.registerCommand("bankkonto", this.cmdBankkonto);
};

BankKonto.prototype.onDeactivated = function() {
    this.unregisterCommand("bankkonto");

};

BankKonto.prototype.onKnuddelReceived = function(sender, recv, knuddelAmount, transferReason) {

        var newKonto = this.addKnuddelAmount(sender, knuddelAmount);
        sender.sendPrivateMessage("Du hast nun °RR°_"+newKonto+" Knuddel_°r° auf deinem Konto.");
};
BankKonto.prototype.cmdBankkonto = function(user, params, func) {
    params = params.toLowerCase();
    if(params == "") {
        user.sendPrivateMessage("Du hast °RR°_" + this.getKnuddelAmount(user)+ " Knuddel_°r° Guthaben.");
    }
    if(params.startsWith("payout")) {
        var anzahl = parseFloat(params.substr("payout".length).trim());
        if(isNaN(anzahl)) {
            user.sendPrivateMessage("Du musst auch eine gültige Knuddel Anzahl eingeben. °RR°_°>/bankkonto payout ZAHL|/tf-overridesb /bankkonto payout [Zahl]<°°r°_.");
            return;
        }
        if(anzahl > this.getKnuddelAmount(user)) {
            user.sendPrivateMessage("Du besitzt nur °RR°_" + this.getKnuddelAmount(user) + " Knuddel_°r°.");
            return;
        }
        //steuern beachtung
        if((anzahl*1.6666666666666)>App.bot.getKnuddelAmount().asNumber()) {
            user.sendPrivateMessage("Soviele Knuddel können dir derzeit nicht ausgezahlt werden. Bitte wende dich an den Channelbesitzer.");
            return;
        }
        var ka = new KnuddelAmount(anzahl);
        App.bot.transferKnuddel(user, ka, {hidePublicMessage: true});
        var guthaben = this.removeKnuddelAmount(user, ka);
        user.sendPrivateMessage("Du hast nun °RR°_"+guthaben+" Knuddel_°r° auf deinem Konto.");
    }
};

BankKonto.self = new BankKonto();