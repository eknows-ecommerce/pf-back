require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { Pedido, Libro } = require('../conexion/db')

const create = async (req, res, next) => {
  const {
    id,
    amount,
    currency,
    description,
    type_method,
    email,
    fechaEntrega,
  } = req.body

  try {
    if (!id) return res.status(400).send('No se ha encontrado el id del pedido')
    if (!amount)
      return res.status(400).send('No se ha encontrado el monto del pedido')
    if (!currency)
      return res.status(400).send('No se ha encontrado la moneda del pedido')
    if (!email)
      return res.status(400).send('No se ha encontrado el email del usuario')

    let voucher = 'Detalle: '
    description.libros.forEach(
      (libro) =>
        (voucher += `LibroId:${libro.id} - Precio:${libro.precio} - Cantidad:${libro.cantidad}`)
    )
    voucher += ` Total:${amount}`
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_types: [type_method ?? 'card'],
      payment_method: id,
      amount: currency === 'USD' ? amount * 100 : amount,
      currency,
      description: voucher,
      confirm: true,
      receipt_email: email,
    })

    if (!paymentIntent) {
      return res.status(400).json({
        requires_action: true,
        payment_intent_client_secret: paymentIntent.client_secret,
      })
    }

    const pedido = await Pedido.create({
      direccionEnvio: description.direccionEnvio,
      estado: description.estado,
      descuento: description.descuento,
      fechaEntrega: fechaEntrega ?? new Date(),
      UsuarioId: description.UsuarioId,
    })

    if (!pedido)
      return res.status(200).json({ msg: 'No se pudo crear el pedido' })

    if (description.libros.length > 0) {
      description.libros.forEach(async ({ id, cantidad }) => {
        const libro = await Libro.findByPk(id)
        await libro.update({
          stock: libro.stock - cantidad,
        })
        pedido.addDetalleLibro(libro, { through: { cantidad } })
      })
    }

    res
      .status(201)
      .json({ msg: 'Pedido realizado correctamente', detalle: voucher, pedido })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  create,
}
