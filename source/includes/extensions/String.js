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
            newLine: true
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
                                if(!allowed.profileLinks && !allowed.channelLinks && !allowed.infoLinks && !allowed.allLinks) {
                                    inLink = false;
                                    continue;
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

                                if(action.startsWith("/pp ") && allowed.profileLinks) {
                                    var nick = action.substr(4).trim();
                                    if(nick == '"')
                                        nick = text;


                                    if(KnuddelsServer.userExists(nick.replace("\\","")))
                                        tmpInsideKCode += ">" + text + "|" + action + "|/w " + nick + "<";
                                    continue;
                                }

                                if(action.startsWith("/m ") && allowed.profileLinks) {
                                    var nick = action.substr(3).trim();
                                    if(nick == '"')
                                        nick = text;


                                    if(KnuddelsServer.userExists(nick.replace("\\","")))
                                        tmpInsideKCode += ">" + text + "|" + action + "|/w " + nick + "<";
                                    continue;
                                }

                                if(action.startsWith("/w ") && allowed.profileLinks) {
                                    var nick = action.substr(3).trim();
                                    if(nick == '"')
                                        nick = text;


                                    if(KnuddelsServer.userExists(nick.replace("\\","")))
                                        tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
                                }
                                if(action.startsWith("/go ") && allowed.channelLinks) {
                                    tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
                                }
                                if(action.startsWith("/info ") && allowed.channelLinks) {
                                    tmpInsideKCode += ">" + text + "|" + action + "<";
                                    continue;
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
                            tmpstr += "°#°";
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