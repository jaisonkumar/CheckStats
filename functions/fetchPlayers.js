// functions/fetchPlayers.js
import fetch from 'node-fetch';

const fetchTitledPlayers = async (title) => {
    const response = await fetch(`https://api.chess.com/pub/titled/${title}`);
    if (!response.ok) {
        throw new Error('Failed to fetch titled players');
    }
    const data = await response.json();
    return data.players;
};

exports.handler = async function(event, context) {
    try {
        const TITLES = ["GM", "WGM", "IM", "WIM", "FM", "WFM", "NM", "WNM", "CM", "WCM"];
        const data = {};

        for (const title of TITLES) {
            data[title] = await fetchTitledPlayers(title);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};
