import { discordApp } from './bot.mjs';
import { igdbApi } from './igdb.mjs';

(async function startServers() {
    const igdbClient = await igdbApi();
    if (igdbClient) console.log("igdb ready");
    const discordClient = await discordApp(igdbClient);
    if (discordClient) console.log("discord ready");
})();