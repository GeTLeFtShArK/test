import igdb from 'igdb-api-node';

export async function igdbApi() {
    const client = await igdb.default("your igdb token here");
    const platforms = await client.fields("id,abbreviation").limit(500).request("/platforms");
    const object = platforms.data.reduce((obj, item) => (obj[item.id] = item.abbreviation, obj), {});
    client.platforms = object;
    return client;
}
