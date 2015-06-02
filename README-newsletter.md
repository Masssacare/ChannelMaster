#Modul: Newsletter

## Was macht Newsletter?
Das Newsletter Modul spricht jeden user der sich noch nicht für den Newsletter angemeldet hat beim Channeljoin an gibt einen Hinweis auf den Newsletter.
Sie bietet standardmäßig den  App-Managern und dem Channelowner die Möglichkeit eine /m an alle User die sich für den Newsletter angemeldet haben zu schicken.
Ebenfalls besteht die Möglichkeit


## Befehle für Newsletter
* **/appnewsletter TEXT** Setzt TEXT als Nachricht für die Rundmail (K-Code ist Limitiert, kann aber genutzt werden)
* **/newslettersend ** Verschickt die Newsletter /m an alle für den Newsletter eingetragene User
* **/newsletteradmin allow:NICK** schaltet einen User für /appnewsletter TEXT sowie /newslettersend frei
* **/newsletteradmin disallow:NICK** sperrt einen User für /appnewsletter TEXT sowie /newslettersend
* **/newsletteradmin list** gibt die Anzahl der für den Newsletter eingetragenen User wieder
* **/newsletteradmin ** gibt die Liste der User wieder, die den Text ändern dürfen, sowie den Newsletter verschicken


* **/activatenewsletter ** Funktion die der User nutzt um sich für den Newsletter anzumelden
* **/deactivatenewsletter ** Funktion die der User nutzt um sich von dem Newsletter abzumelden


## Entwickler
/w DdvOiD