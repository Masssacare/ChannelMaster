# ChannelMaster

## Was ist ChannelMaster
ChannelMaster ist eine Sammlung aus mehreren Apps die als Module eingebunden werden. Du kannst die App in deinem MyChannel mit `/apps install knuddelsDEV.30559674.ChannelMaster` installieren.

## Verfügbare Module
* [Botsay](README-botsay.md)
* [ChannelTop](README-channeltop.md)
* [CMComment](README-cmcomment.md)
* [JavaFXCheck](README-javafxcheck.md)
* [KnuPayout](README-knupayout.md)
* [LastOnline](README-lastonline.md)
* [MCMMessage](README-mcmmessage.md)
* [Newsletter](README-newsletter.md)
* [TopicChanger](README-topicchanger.md)
* [Unmute](README-unmute.md)



## Modulbefehle
* `/activatemodule ModuleName` aktiviert ein Modul
* `/deactivatemodule ModuleName` deaktiviert ein Modul

## Trage selbst Code dabei
Gerne kannst du selbst Quellcode beisteuern und die ChannelMaster App zu erweitern. Hierzu müssen aber ein paar Richtlinien eingehalten werden.

### Regeln für Module
* Ein Modul muss ordnungsgemäß von der Klasse Module erben
* Ein Modul darf nicht selber Standardklassen überschreiben
* Ein Modul darf nicht auf einzelne Nutzer/Channel maß geschnitten sein
* Ein Modul darf sich nicht selber aktivieren
* Ein Modul darf andere Module **nicht verändern**
* Ein Modul muss eine `README-modulename.md` im Grundordner haben


## Verantwortlicher Appentwickler
Verantwortlicher Appentwickler ist **Kapsonfire** (in Knuddels.de /w Vampiric Desire).
Ihm obliegt jede Entscheidung ob und unter welchen Bedingungen Änderungen am Code vorgenommen werden.

## Wichtige Links zum Entwickeln
* [Knuddels-API Uservoice](https://knuddels-api.uservoice.com/)
* [Knuddels-API Bitbucket](https://bitbucket.org/knuddels/user-apps/overview)
* [Knuddels-API Dokumentation](http://developer.knuddels.de/docs/)
