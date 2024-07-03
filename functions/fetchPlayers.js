import { writeFile } from 'fs/promises';
import https from 'https';

const TITLES = ["GM", "WGM", "IM", "WIM", "FM", "WFM", "NM", "WNM", "CM", "WCM"];

const fetchTitledPlayers = async (title) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.chess.com',
            path: `/pub/titled/${title}`,
            method: 'GET',
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData.players);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
};

const storeData = async (data, dateTime) => {
    const fileName = `playersData_${dateTime}.json`;
    await writeFile(`./${fileName}`, JSON.stringify(data, null, 2));
    console.log(`Players data saved to ${fileName}`);
};

const getFormattedDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};

exports.handler = async function(event, context) {
    try {
        const dateTime = getFormattedDateTime();
        const newData = {};

        for (const title of TITLES) {
            const players = await fetchTitledPlayers(title);
            newData[title] = players;
        }

        await storeData(newData, dateTime);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Players data saved to playersData_${dateTime}.json` }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
