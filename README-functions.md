#Modul: Functions

## Was kann Functions?
Das Functions Modul bietet dem ChannelBesitzer die Möglichkeit eine Funktionsübersicht für eine ausgewählte Usergruppe zur Verfügung zu stellen.

## Befehle für Functions
* **/functions** gibt eine Übersicht der aktuell auf der Blacklist vorhandenen Nicks. (Nur Cms & erlaubte User) inkl. Link zum entfernen.
* **/functions Funktion::Beschreibung** setzt eine Funktion auf die Funktionsübersicht. (nur erlaubte User)
* **/deletefunctions KEY** löscht den Eintrag KEY aus der Funktionsübersicht (von oben nach unten gezählt, mit 0 beginnend)
* **/functionsadmin allow:NICK** Erlaubt NICK änderung an der Funktionsübersicht vorzunehmen
* **/functionsadmin disallow:NICK** Entzieht NICK die Rechte für die Nutzung der Funktionsübersicht
* **/functionsadmin** gibt die Liste der freigeschalteten Nutzer, sowie der verfügbaren Funktionen an

## Weitere Infos
* Standardmäßig darf jeder Appmanager auf die Funktionsübersicht zugreifen und änderungen vornehmen. Sowie Jeder Cm die Funktionsübersicht einsehen.
* Der Channelbesitzer kann die Funktion für Appmanager oder Channelmoderatoren aber auch entfernen

## Entwickler
/w DdvOiD