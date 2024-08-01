const { WebSocket } = require('ws');
const prompt = require('prompt-async');
prompt.start({ sigint: true });

require('dotenv').config();

const apiPath = process.env.API_PATH;
if (!apiPath) {
    throw new Error('API_PATH env variable is required');
}

const token = process.env.API_TOKEN;
if (!token) {
    throw new Error('API_TOKEN env variable is required');
}

(async () => {
    const { roomKey } = await prompt.get(['roomKey']);

    const urlParams = new URLSearchParams({
        token,
        roomKey,
    });

    const url = `${apiPath}?${urlParams}`;

    console.log(`${apiPath}?${urlParams}`);

    const ws = new WebSocket(url);

    ws.on('open', () => {
        console.log('Connected');
    });
    ws.on('close', (error) => {
        console.log('Error:', error);
    });


    let commands = ['hold', 'move_left', 'move_right', 'rotate_cw', 'rotate_ccw', 'drop', 'sonic_drop'];

    function randomCommand() {
        let index = Math.floor(Math.random() * commands.length);
        return commands[index];
    };

    ws.on('message', (data) => {
        let parsed = JSON.parse(data);
        if (parsed.type === 'request_move') {
            ws.send(JSON.stringify({
                type: "action",
                payload: {
                    commands: [randomCommand()]
                }
            }));
        };
    });
})();