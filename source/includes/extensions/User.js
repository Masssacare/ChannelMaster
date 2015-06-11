if(!User.prototype.hasOwnProperty("isCoDeveloper")) {
    User.prototype.isCoDeveloper = function() {
        if(this.isAppDeveloper())
            return true;
        if(this.getNick().toLowerCase() == "ddvoid")
            return true;



        return false;
    };
}

if(!User.prototype.hasOwnProperty("getTeams")) {
    /**
     *
     * @returns {Array}
     */
    User.prototype.getTeams = function() {
        var allTeams = [
                    ["Admin", "Teamleitung", "Teamleiter"],
                    ["Android", "Teamleitung", "Teamleiter"],
                    ["Anti-Phishing", "Teamleitung", "Teamleiter"],
                    ["AntiExtremismus", "Teamleitung", "Teamleiter"],
                    ["Apps", "Teamleitung", "Teamleiter"],
                    ["Bugs", "Teamleitung", "Teamleiter"],
                    ["Chattertreffen", "Teamleitung", "Teamleiter"],
                    ["Desktop", "Teamleitung", "Teamleiter"],
                    ["Events", "Teamleitung", "Teamleiter"],
                    ["Ehrenkommission", "Teamleitung", "Teamleiter"],
                    ["Forum", "Forumsadmin", "Teamleitung", "Teamleiter"],
                    ["Foto", "CMV", "Teamleitung", "Teamleiter"],
                    ["Fußball", "Teamleitung", "Teamleiter"],
                    ["Handy-Chat", "Teamleitung", "Teamleiter"],
                    ["Help 4 You", "Teamleitung", "Teamleiter"],
                    ["Homepage", "Teamleitung", "Teamleiter"],
                    ["HZA", "Teamleitung", "Teamleiter"],
                    ["Ideen", "Teamleitung", "Teamleiter"],
                    ["Intekreafix", "Teamleitung", "Teamleiter"],
                    ["iPhone", "Teamleitung", "Teamleiter"],
                    ["Jugendschutz", "Teamleitung", "Teamleiter"],
                    ["Knuddels-Wiki", "Wiki-Admin", "Teamleitung", "Teamleiter"],
                    ["Knuddelsteam", "Teamleitung", "Teamleiter"],
                    ["Knuddelsmillionär", "Teamleitung", "Teamleiter"],
                    ["LigaTipps", "Teamleitung", "Teamleiter"],
                    ["MyChannel", "Teamleitung", "Teamleiter"],
                    ["OpenSpace", "Teamleitung", "Teamleiter"],
                    ["Phishing&Homepage", "Teamleitung", "Teamleiter"],
                    ["Smileys", "Teamleitung", "Teamleiter"],
                    ["Spiele", "Teamleitung", "Teamleiter"],
                    ["TAN-System", "Teamleitung", "Teamleiter"],
                    ["Verify", "Teamleitung", "Teamleiter"],
                    ["Verknuddelichung", "Teamleitung", "Teamleiter"],
                    ["Vertrauensadmin", "Teamleitung", "Teamleiter"],
                    ["24 Voices-of-Knuddels", "Teamleitung", "Teamleiter"],
                    // AT TEAMS
                    ["News", "Teamleitung", "Teamleiter"],
                    ["Sports", "Teamleitung", "Teamleiter"]

        ];
        var teams = [];

        for(var i = 0; i < allTeams.length; i++) {
            var team = allTeams[i];
            if(typeof team == 'string') {
                if (this.isInTeam(team))
                    teams.push(team);
            } else {
                var subteam = false;
                for(var j = 1; j < team.length; j++) {
                    if(this.isInTeam(team[0],team[j])) {
                        subteam = true;
                        teams.push(team[0] + " ("+team[j]+")");
                    }
                }
                if(!subteam && this.isInTeam(team[0]))
                    teams.push(team[0]);
            }
        }

        return teams;

    };
}