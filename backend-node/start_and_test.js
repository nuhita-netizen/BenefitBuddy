import { spawn } from 'child_process';

const server = spawn('node', ['src/index.js']);

server.stdout.on('data', (data) => console.log(`[SERVER] ${data}`));
server.stderr.on('data', (data) => console.log(`[SERVER ERROR] ${data}`));

setTimeout(async () => {
    console.log("Making request...");
    try {
        const res = await fetch('http://127.0.0.1:8000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Bug",
                age: 10,
                gender: "female",
                income: 150000,
                state: "Maharashtra",
                category: "General",
                occupation: "student",
                land_holding: 0
            })
        });
        const data = await res.json();
        console.log("Response:", data);

        const eligRes = await fetch(`http://127.0.0.1:8000/eligibility/check/${data.id}`, { method: 'POST' });
        const eligData = await eligRes.json();
        console.log("Eligibility:", eligData.length);
    } catch (e) {
        console.log("Request failed:", e.message);
    }
    server.kill();
}, 2000);
