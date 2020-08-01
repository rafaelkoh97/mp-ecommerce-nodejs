var express = require("express");
var exphbs = require("express-handlebars");

var app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// SDK de Mercado Pago
const mercadopago = require('mercadopago');

// Agrega credenciales
mercadopago.configure({
  access_token: 'APP_USR-1159009372558727-072921-8d0b9980c7494985a5abd19fbe921a3d-617633181',
  integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/failure", function (req, res) {
  res.render("failure");
});

app.get("/success", function (req, res) {
  console.log(req);
  res.render("success", req.query);
});

app.get("/pending", function (req, res) {
  res.render("pending");
});
app.get("/notify", function (req, res) {
  console.log(req.body);
  res.sendStatus(200);
});

app.get("/detail", function (req, res) {
  var preference = {
    "items": [
      {
        "id": "1234",
        "title": req.query.title,
        "currency_id": "MXN",
        "picture_url": req.headers.host + req.query.img.replace(".", ""),
        "description": "Dispositivo móvil de Tienda e-commerce",
        "quantity": 1,
        "unit_price": parseInt(req.query.price)
      }
    ],
    "payer": {
      "name": "Lalo",
      "surname": "Landa",
      "email": "test_user_58295862@testuser.com",
      "phone": {
        "area_code": "52",
        "number": 5549737300
      },
      "address": {
        "street_name": "Insurgentes Sur",
        "street_number": 1602,
        "zip_code": "03940"
      }
    },
    "back_urls": {
      "success": req.headers.host + "/success",
      "failure": req.headers.host + "/failure",
      "pending": req.headers.host + "/pending"
    },
    "auto_return": "approved",
    "payment_methods": {
      "excluded_payment_methods": [
        {
          "id": "amex"
        }
      ],
      "excluded_payment_types": [
        {
          "id": "atm"
        }
      ],
      "installments": 6
    },
    "notification_url": req.headers.host + "/notify",
    "external_reference": "rafaelkoh97@gmail.com",
  }
  mercadopago.preferences.create(preference)
    .then(function (response) {
      // console.log(response.body.sandbox_init_point);
      // global.id = response.body.id;
      let data = req.query;
      data.init_point = response.body.init_point;
      res.render("detail", data);
    }).catch(function (error) {
      console.log(error);
    });
});

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.listen(process.env.PORT || 5000);