import fetch from 'node-fetch';

const TITLES = ["GM", "WGM", "IM", "WIM", "FM", "WFM", "NM", "WNM", "CM", "WCM"];

const fetchTitledPlayers = async (title) => {
    const response = await fetch(`https://api.chess.com/pub/titled/${title}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.players;
};

exports.handler = async (event, context) => {
    try {
        const newData = {};

        for (const title of TITLES) {
            const players = await fetchTitledPlayers(title);
            newData[title] = players;
        }

        return {
            statusCode: 200,
            body: JSON.stringify(newData)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
