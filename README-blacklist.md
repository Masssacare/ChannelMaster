#Modul: Blacklist

## Was macht Blacklist?
Das Blacklist Modul bietet ChannelInhabern die Möglichkeit bestimmte User auf die Channelinterne Blackliste zu setzen
Sollte ein User der auf dieser Liste steht den Channel betreten, werden die Cms die sich im Channel befinden darüber informiert und erhalten einen /cl Link.
Sofern das CMComment Modul aktiviert ist, wird ebenfalls direkt ein entsprechender Kommentar hinterlegt.

## Befehle für Blacklist
* **/blacklist ** gibt eine Übersicht der aktuell auf der Blacklist vorhandenen Nicks. (Nur Cms & erlaubte User) inkl. Link zum entfernen.
* **/blacklist add:NICK** setzt NICK auf die Blacklist (nur erlaubte User)
* **/blacklistadmin allow:NICK** Erlaubt NICK änderung an der Blacklist vorzunehmen
* **/blacklistadmin disallow:NICK** Entzieht NICK die Rechte für die Nutzung der Blacklist
* **/blacklistadmin** gibt die Liste der freigeschalteten Nutzer, sowie der verfügbaren Funktionen an

## Weitere Infos
* Standardmäßig darf jeder Appmanager auf die Blacklist zugreifen und änderungen vornehmen. Sowie Jeder Cm die Blacklist einsehen.
* Der Channelbesitzer kann die Funktion für Appmanager auch entfernen

## Entwickler
/w DdvOiD