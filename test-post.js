const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/products',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(res.statusCode, body));
});
req.write(JSON.stringify({
  slug: 'new-product',
  title: 'New Product',
  price: '200'
}));
req.end();
