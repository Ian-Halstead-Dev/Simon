fetch('reqres.in/api/users', {
	method: 'POST',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({ a: 1, b: 'Textual content' })
})
	.then((response) => response.json())
	.then((data) => console.log(data));
