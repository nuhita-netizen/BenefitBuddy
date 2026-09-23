fetch('http://127.0.0.1:8000/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    age: 30,
    gender: 'female',
    annual_income: 50000,
    state: 'Delhi',
    category: 'general',
    occupation: 'student',
    land_holding_acres: 0
  })
}).then(r => r.json()).then(console.log);
