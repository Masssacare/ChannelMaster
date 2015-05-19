#Modul: Botsay

## Was macht Botsay?
Botsay ermöglicht es freigeschalteten Nutzern im Namen des Bots öffentlich zu schreiben. Appmanager/Channelbesitzer haben die Möglichkeit einzelne Nutzer freizuschalten.

## Befehle für Botsay
* **/botsay TEXT** sendet im Namen des Bots den eingegeben Text. Dabei kann limitierter KCode genutzt werden.
* **/botsayadmin allow:NICK** schaltet einen User für /botsay frei
* **/botsayadmin disallow:NICK** sperrt einen User für /botsay

## Weitere Infos
* Standardmäßig darf jeder Appmanager /botsay nutzen. Der Channelbesitzer kann aber auch für andere Appmanager dieses deaktivieren
* Sollte ein Appmanager für /botsay gesperrt sein, darf er auch nicht mehr Rechte anderer verwalten
* Der KCode ist limiert auf:
    * Fett
    * Kursiv
    * Farbig
    * Größe
    * /w, /m, /pp Links
    * /go Links
    * /info Links
    * CENTER, LEFT, RIGHT, JUSTIFY,
    * neue Zeile
    
## Entwickler
/w Vampiric Desire