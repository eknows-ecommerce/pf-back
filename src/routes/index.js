const stripe = require('stripe')('sk_test_51LWSCuKM9WIiKVeE6rAWN02sb7WtahaQUchurYMzCXPiPDWwIx5MS4j5IDY00jKTa0TfLgQswayqjvrBSQyvZnhU00OA3hS6vJ');
const  { Router  } = require('express')
const tag = require('./tag.js')
const categoria = require('./categoria.js')
const libro = require('./libro.js')
const review = require('./review.js')
const comentario = require('./comentario.js')
const pedido = require('./pedido')
const usuario = require('./usuario')
const formato = require('./formato')
const puntuacion = require('./puntuacion')
const auth = require('./auth')



const router = Router()

router.use('/auth', auth)
router.use('/categorias', categoria)
router.use('/libros', libro)
router.use('/tags', tag)
router.use('/pedidos', pedido)
router.use('/usuarios', usuario)
router.use('/formatos', formato)
router.use('/puntuaciones', puntuacion)
router.use('/review', review)
router.use('/comentario', comentario)

router.post('/checkout', async (req,res) => {
    const {id,amount,currency,description} = req.body
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      payment_method: id,              
      currency: currency,   
      description:description,    
      payment_method_types: ['card'],            
      confirm: true,

    });

   console.log('payment ', paymentIntent)
   
   res.send({message: 'Transaccion exitosa'})
})




module.exports = router
