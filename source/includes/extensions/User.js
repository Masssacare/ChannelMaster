if(!User.prototype.hasOwnProperty("getTeams")) {
    /**
     *
     * @returns {Array}
     */
    User.prototype.getTeams = function() {
        var allTeams = [
                    "Admin", "Android", "Anti-Phishing",
                    "AntiExtremismus", "Apps", "Bugs",
                    "Chattertreffen", "Desktop", "Events",
                    "Ehrenkommission",
                    "Forum", "Foto", "Fußball", "Handy-Chat",
                    "Help 4 You", "Homepage", "HZA", "Ideen",
                    "Intekreafix", "iPhone", "Jugendschutz",
                    "Knuddels-Wiki", "Knuddelsteam", "Knuddelsmillionär", "LigaTipps",
                    "MyChannel", "OpenSpace", "Phishing&Homepage",
                    "Smileys", "Spiele", "TAN-System",
                    "Verify", "Verknuddelichung", "Vertrauensadmin",
                    "24 Voices-of-Knuddels",


        ];
        var teams = [];
        for(var i = 0; i < allTeams.length; i++) {
            var team = allTeams[i];
            if(this.isInTeam(team))
                teams.push(team);
        }

        return teams;

    };
}