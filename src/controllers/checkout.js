require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const create = async (req, res, next) => {
  const { id, amount, currency, description, type_method, email } = req.body
  try {
    if (!id) return res.status(400).send('No se ha encontrado el id del pedido')
    if (!amount)
      return res.status(400).send('No se ha encontrado el monto del pedido')
    if (!currency)
      return res.status(400).send('No se ha encontrado la moneda del pedido')
    if (!email)
      return res.status(400).send('No se ha encontrado el email del usuario')
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_types: [type_method ?? 'card'],
      payment_method: id,
      amount: currency ? amount * 100 : amount,
      currency,
      description,
      confirm: true,
      receipt_email: email,
    })

    if (!paymentIntent) {
      return res.status(400).json({
        requires_action: true,
        payment_intent_client_secret: paymentIntent.client_secret,
      })
    }
    console.log('detalle ', paymentIntent)
    res.status(201).json({ detalle: paymentIntent })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  create,
}
