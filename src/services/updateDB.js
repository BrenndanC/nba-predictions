const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.BALLDONTLIE_API_KEY;
const API_URL = process.env.BALLDONTLIE_API_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAndStoreData() {
    try {
        const team_response = await supabase
            .from('teams')
            .select('*')
            .eq('id', 14)
            .single();

        const team_name = team_response.data.name;
        const full_name = team_response.data.full_name

        const options = {
            method: 'GET',
            headers: {
                'Authorization': API_KEY
            },
            params: {
                team_ids: [14],
                postseason: false,
                seasons: [2023],
                per_page: 100
            }
        };

        const response = await axios.get(`${API_URL}/games`, options);
        const games = response.data.data;

        var wins_total = 0;
        var losses_total = 0;
        var wins_home = 0;
        var losses_home = 0;
        var wins_away = 0;
        var losses_away = 0;

        for (game of games) {
            if (game.home_team.name == team_name) {
                if (game.home_team_score > game.visitor_team_score) {
                    wins_total++;
                    wins_home++;
                }
                else {
                    losses_total++;
                    losses_home++;
                }
            }
            else {
                if (game.home_team_score > game.visitor_team_score) {
                    losses_total++;
                    losses_away++;
                }
                else {
                    wins_total++;
                    wins_away++;
                }
            }
        }

        var wins_last_5 = 0;
        var wins_last_10 = 0;
        var winstreak = 0;
        var has_lost = false;

        for (var j = games.length-1; j >= 60; j--) {
            if (games[j].home_team.name == team_name) {
                if (games[j].home_team_score > games[j].visitor_team_score) {
                    if (!has_lost) {
                        winstreak++;
                    }
                    if (games.length - j <= 5) {
                        wins_last_5++;
                    }
                    if(games.length - j <= 10) {
                        wins_last_10++;
                    }
                }
                else {
                    has_lost = true;
                }
            }
            else {
                if (games[j].visitor_team_score > games[j].home_team_score) {
                    if (!has_lost) {
                        winstreak++;
                    }
                    if (games.length - j <= 5) {
                        wins_last_5++;
                    }
                    if(games.length - j <= 10) {
                        wins_last_10++;
                    }
                }
                else {
                    has_lost = true;
                }
            }
        }

        console.log(`${team_name}:\nwins:${wins_total}\nlosses:${losses_total}\nwins_home:${wins_home}\nlosses_home:${losses_home}\nwins_away:${wins_away}\nlosses_away:${losses_away}`)
        console.log(`wins_last_5:${wins_last_5}\nwins_last_10:${wins_last_10}\nwinstreak:${winstreak}\n`)

        const { data, error } = await supabase
            .from('standings')
            .upsert([
                {
                    team: full_name,
                    wins_total: wins_total,
                    losses_total: losses_total,
                    wins_home: wins_home,
                    losses_home: losses_home,
                    wins_away: wins_away,
                    losses_away: losses_away,
                    wins_last_5: wins_last_5,
                    wins_last_10: wins_last_10,
                    winstreak: winstreak
                }
            ])
        if (error) {
            console.error('Error inserting data:', error);
        } else {
            console.log('Data inserted.');
        }
    }
    catch (error) {
        console.error(error);
    }
}

fetchAndStoreData();