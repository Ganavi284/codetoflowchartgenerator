const http = require('http');

const data = JSON.stringify({
  code: 'console.log("Hello, World!");',
  language: 'javascript'
});

const options = {
  hostname: 'localhost',
  port: 3400,
  path: '/convert',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response status code:', res.statusCode);
    console.log('Response headers:', res.headers);
    console.log('Response body:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();