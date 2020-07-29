var mercadopago = require("mercadopago");
mercadopago.configure({
  access_token:
    "TEST-1127153816055797-072919-1eec12cf40538ca2dc180e67b78b3c03-246310383",
});

var preference = {
  items: [
    {
      title: "Test",
      quantity: 1,
      currency_id: "ARS",
      unit_price: 10.5,
    },
  ],
};

mercadopago.preferences.create(preference);
