/**
 * @file Diese Datei erweitert die String Klasse
 * @author KnuddelsTools
 * @author Vampiric Desire
 * @copyright KnuddelsTools
 * @link https://github.com/KnuddelsTools KnuddelsTools on Github
 *
 * @license LGPL
 * @license http://www.gnu.org/licenses/lgpl.html GNU Lesser General Public License
 */


if(!String.prototype.hasOwnProperty("fixsplit")) {
    /**
     * Fixed die Splitfunktion von Knuddels. Kein RegEx möglich.
     * @param {string} sep
     * @param {string} limit
     * @returns {Array}
     */
    String.prototype.fixsplit = function(sep, limit) {
        limit = limit | 0;
        var arr = [];
        var tmp = this.toString();
        var i = -1;
        while(true) {
            i = tmp.indexOf(sep);
            if(i==-1)
                break;
            var part = tmp.substring(0,i);
            arr.push(part);
            if(limit > 0 && arr.length == limit)
                return arr;


            tmp = tmp.substring(i+sep.length);
        }
        arr.push(tmp);


        return arr;
    };
}



if(!String.prototype.hasOwnProperty("limitKCode")) {
    /**
     * Diese Funktion entfernt verbotenen KCode.
     * @param {Object] limits
     * @returns {string}
     */
    String.prototype.limitKCode = function(limits) {
        var tmpstr = "";

        var allowed = {
            size: true,
            bold: true,
            italic: true,
            color: true,
            profileLinks: true,
            channelLinks: true,
            infoLinks: true,
            allLinks: false,
            orientation:  true,
            newLine: true,
            appCommandLinks: true,
            knuddelsLinks: true,
            youtubeLinks: true,
            wikiLinks: true,
            KwikiLinks: true,
            googleLinks: true,
            overrideLinks: true,
            helpLinks:true,
            diceLinks:true,
            readmeLinks:true
        };

        if (typeof limits === 'object') {
            for(var key in limits) {
                allowed[key] = limits[key];
            }
        }
        var escaped = false;
        var insideKCode = false;
        for(var i = 0; i < this.length; i++) {
            var char = this[i];
            if(insideKCode!==false) {
                if(escaped) {
                    insideKCode += "\\"+char;
                    escaped = false;
                    continue;
                }
                else if(char == '°')
                {
                    var tmpInsideKCode = "";
                    var inLink = false;
                    var inColor = false;
                    var inEscaped = false;
                    for(var j = 0; j < insideKCode.length; j++) {
                        var iChar = insideKCode[j];

                        if(inLink !== false) {
                            if(inEscaped) {
                                inLink += "\\" + iChar;
                                inEscaped = false;
                                continue;
                            }
                            if(iChar == "\\") {
                                inEscaped = true;
                                continue;
                            }

                            if(iChar == '<') {
                                if(inLink.length == 0)
                                    continue;
                                switch(inLink.toLowerCase()) {
                                    case "center":
                                    case "left":
                                    case "right":
                                    case "justify":
                                    case "-":
                                        if(allowed.orientation) {
                                            tmpInsideKCode += ">" + inLink + "<";
                                            inLink = false;
                                            continue;
                                        }
                                        break;

                                }



                                if(allowed.allLinks) {
                                    tmpInsideKCode += ">" + inLink + "<";
                                    inLink = false;
                                    continue;
                                }
                                if(inLink.startsWith("{font}")) {
                                    tmpInsideKCode += ">" + inLink + "<";
                                }

                                var parts = inLink.split('|');
                                var text = "";
                                var action = "";
                                if(parts.length == 1) {
                                    text = parts[0];
                                    action = parts[0];
                                } else {
                                    //keine rechtsklick aktion, die forcen wir
                                    text = parts[0];
                                    action = parts[1];
                                }

                                if(action.startsWith("http://") || action.startsWith("https://")) {
                                    var url = (function(href) {
                                        var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
                                        var matches =  href.match(pattern);
                                        return {
                                            scheme: matches[2],
                                            authority: matches[4],
                                            path: matches[5],
                                            query: matches[7],
                                            fragment: matches[9]
                                        };
                                    })(action);

                                    if(url.authority.endsWith("play.google.com") && allowed.googleLinks) {
                                        tmpInsideKCode += ">" + text + "|" + action + "<";
                                        continue;
                                    }

                                    if((url.authority.endsWith("knuddels.de") || url.authority.endsWith("knuddelsseiten.de")) && allowed.knuddelsLinks) {
                                        tmpInsideKCode += ">" + text + "|" + action + "<";
                                        continue;
                                    }

                                    if((url.authority.endsWith("knuddels.de") || url.authority.endsWith("knuddelsseiten.de")) && allowed.knuddelsLinks) {
                                        tmpInsideKCode += ">" + text + "|" + action + "<";
                                        continue;
                                    }
                                    if((url.authority.endsWith("youtube.com") || url.authority.endsWith("youtu.be")) && allowed.youtubeLinks) {
                                        tmpInsideKCode += ">" + text + "|" + action + "<";
                                        continue;
                                    }
                                    if((url.authority.endsWith("knuddels-wiki.de") && allowed.KwikiLinks)) {
                                        tmpInsideKCode += ">" + text + "|" + action + "<";
                                        continue;
                                    }
                                    if((url.authority.endsWith("wikipedia.org") && allowed.wikiLinks)) {
                                        tmpInsideKCode += ">" + text + "|" + action + "<";
                                        continue;
                                    }
                                }

                                if((action.toLowerCase() == "/e setlmc" || action.toLowerCase() == "/edit setlmc") && allowed.channelLinks) {
                                    tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
                                }

                                if(action.toLowerCase().startsWith("/pp ") && allowed.profileLinks) {
                                    var nick = action.substr(4).trim();
                                    if(nick == '"')
                                        nick = text;


                                    if(KnuddelsServer.userExists(nick.replace("\\","")))
                                        tmpInsideKCode += ">" + text + "|" + action + "|/w " + nick + "<";
                                    continue;
                                }

                                if(action.toLowerCase().startsWith("/m ") && allowed.profileLinks) {
                                    var nick = action.substr(3).trim();
                                    if(nick == '"')
                                        nick = text;


                                    if(KnuddelsServer.userExists(nick.replace("\\","")))
                                        tmpInsideKCode += ">" + text + "|" + action + "|/w " + nick + "<";
                                    continue;
                                }

                                if(action.toLowerCase().startsWith("/w ") && allowed.profileLinks) {
                                    var nick = action.substr(3).trim();
                                    if(nick == '"')
                                        nick = text;


                                    if(KnuddelsServer.userExists(nick.replace("\\","")))
                                        tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
                                }
                                if((action.toLowerCase().startsWith("/go ") || action.toLowerCase().startsWith("/cc ")) && allowed.channelLinks) {
                                    tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
                                }
                                if((action.toLowerCase().startsWith("/info ") || action.toLowerCase() == "/info") && allowed.channelLinks) {
                                    tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
                                }

                                if(action.toLowerCase().startsWith("/tf-overridesb ") && allowed.overrideLinks) {
                                    tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
                                }

                                if(action.toLowerCase().startsWith("/readme ") && allowed.readmeLinks) {
                                    tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
                                }

                                if((action.toLowerCase().startsWith("/h ") || action.toLowerCase().startsWith("/help ")) && allowed.helpLinks) {
                                    tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
                                }

                                if((action.toLowerCase().startsWith("/top ") || action.toLowerCase().startsWith("/showtoplist "))&& allowed.helpLinks) {
                                    tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
                                }
                                if((action.toLowerCase().startsWith("/dice ") || action.toLowerCase().startsWith("/d ")) && allowed.diceLinks) {
                                    tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
                                }



                                if(allowed.appCommandLinks) {
                                    //checke ob action eine appinterne funktion ist
                                    var splittedaction = action.split(" ");
                                    if (splittedaction.length > 0) {
                                        var cmdname = splittedaction[0].toLowerCase().substr(1);
                                        if (typeof App.chatCommands[cmdname] === 'function') {
                                            tmpInsideKCode += ">" + text + "|" + action + "<";
                                            continue;
                                        }
                                    }
                                }

                                continue;
                            } else {
                                inLink += iChar;
                                continue;
                            }

                            continue;
                        } else {
                            if(inColor !== false) {
                                if(iChar == ']') {
                                    if(allowed.color) {
                                        tmpInsideKCode += "[" +  inColor + "]";
                                    }
                                } else {
                                    inColor += iChar;
                                }
                                continue;
                            } else {
                                if(inEscaped) {
                                    tmpInsideKCode += "\\" + iChar;
                                    inEscaped = false;
                                    continue;
                                }
                                switch(iChar) {
                                    case '>':
                                        inLink = "";
                                        continue;
                                    case '[':
                                        inColor = "";
                                        continue;
                                    case 'r':
                                        if(allowed.color || allowed.size) {
                                            tmpInsideKCode += iChar;
                                        }
                                        continue;
                                    case '0':
                                    case '1':
                                    case '2':
                                    case '3':
                                    case '4':
                                    case '5':
                                    case '6':
                                    case '7':
                                    case '8':
                                    case '9':
                                    case '-':
                                        if(allowed.size)
                                            tmpInsideKCode += iChar;
                                        continue;
                                    default:
                                        if(iChar.toLowerCase() >= 'a' && iChar.toLowerCase() <= 'z') {
                                            if(allowed.color) {
                                                tmpInsideKCode += iChar;
                                            }
                                        }



                                }



                            }
                        }
                        continue;
                    }
                    if(tmpInsideKCode.length > 0)
                        tmpstr += "°" + tmpInsideKCode + "°";
                    insideKCode = false;
                } else {
                    insideKCode += char;
                }
            }
            else
            {
                if(escaped) {
                    tmpstr += "\\"+char;
                    escaped = false;
                    continue;
                }
                switch(char) {
                    case '\\':
                        escaped = true;
                        break;
                    case '#':
                        if(allowed.newLine)
                            tmpstr += "°#r°";
                        break;
                    case '_':
                        if(allowed.bold)
                            tmpstr += char;
                        break;
                    case '"':
                        if(allowed.italic)
                            tmpstr += char;
                        break;
                    case '°':
                        insideKCode = "";
                        break;

                    default:
                        tmpstr += char;
                }
            }



        }


        return tmpstr;
    };


}