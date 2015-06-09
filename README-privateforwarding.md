#Modul: PrivateForwading

## Was macht PrivateForwading?
PrivateForwading leitet alle Nachrichten die an den AppBot geschickt werden an die eingestellten User weiter.

## Befehle für PrivateForwading
* **/forwardingadmin allow:NICK** Fügt NICK zur Liste der User hinzu, denen die Nachrichten an den AppBot zugeschickt werden
* **/forwardingadmin allow:NICK** Entfernt NICK von der Liste der User hinzu, denen die Nachrichten an den AppBot zugeschickt werden
* **/activateofflinemessage** Aktiviert das sofern der User offline ist, die Nachrichten an den AppBot per /m verschickt werden (Standardmäßig aktiviert)
* **/deactivateofflinemessage** Deaktiviert den Versand per /m wenn der User offline ist


## Weitere Infos
* Standardmäßig ist nur der Channelbesitzer für den Empfang der Nachricht (sowohl /p als auch /m) freigeschaltet.
    
## Entwickler
/w DdvOID