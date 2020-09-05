import Discord from 'discord.js';

export async function discordApp(igdb) {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity("at your service", { type: "gamebud" });
    });

    client.on("error", (e) => console.error(e));
    client.on("warn", (e) => console.warn(e));
    client.on("disconnect", (e) => console.log(e));
    //client.on("debug", (e) => console.log(e));
    client.on("reconnecting", (e) => console.log(e));

    client.on("message", (msg) => respondToMessage(msg, igdb));

    await client.login('your login token here');

    return client;
}

const respondToMessage = async (msg, igdb) => {
    if (msg.content.toLowerCase() === "!games") {
        const games = await getUpcomingGames(igdb);
        msg.reply(`\r\n${games}`);
    }
    if (msg.content.toLowerCase() === "!upcoming") {
        msg.reply("https://www.igdb.com/games/coming_soon");
    }
    if (msg.content.toLowerCase() === "!invite") {
        msg.reply(inviteLink());
    }
}

const inviteLink = () => {
    return "https://discord.com/oauth2/authorize?client_id=751629072932798576&scope=bot";
}

const getUpcomingGames = async (client) => {
    const resp = await client.fields("game").limit(500)
        .where(`date > ${parsedDate(new Date())} & date < ${parsedDate(addDaysToDate(new Date(), 15))}`)
        .sort("date", "asc").request("/release_dates");
    let ids = [];
    await resp.data.forEach(element => {
        ids.push(element.game);
    });

    const gameList = await client.fields("name, url, first_release_date, platforms").limit(20)
        .where(`first_release_date > ${parsedDate(new Date())} & first_release_date < ${parsedDate(addDaysToDate(new Date(), 15))}`)
        .sort("first_release_date", "asc").request("/games");

    let games = [];
    await gameList.data.forEach(({ name, url, first_release_date, platforms }) => {
        //${new Date(first_release_date * 1000)} | ${getPlatform(client, platforms)}
        games.push(`${name.substring(0, 20)} | ${url}`);
    });

    return games.join('\r\n')
}

const parsedDate = (date) => {
    return Date.parse(date) / 1000;
}

const addDaysToDate = (date, days) => {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

const getPlatform = (client, array) => {
    let platforms = array.map(element => client.platforms[element]);
    return platforms.join(" & ");
}