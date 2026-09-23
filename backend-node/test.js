async function test() {
    try {
        const res = await fetch('http://127.0.0.1:8000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test",
                age: 30,
                gender: "Male",
                income: 50000,
                state: "Maharashtra",
                category: "General",
                occupation: "farmer",
                land_holding: 2
            })
        });
        const data = await res.json();
        console.log("STATUS:", res.status);
        console.log("RESPONSE:", data);
    } catch (e) {
        console.log("ERROR:", e);
    }
}
test();
