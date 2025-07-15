var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'GET',
  'hostname': 'sandbox.momodeveloper.mtn.com',
  'path': '/collection/v1_0/accountholder/msisdn/0243656543/active',
  'headers': {
    'X-Target-Environment': 'sandbox',
    'Ocp-Apim-Subscription-Key': '3338adcf1b6541609e7fdcdd2b453298',
    'Authorization': '••••••'
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.end();