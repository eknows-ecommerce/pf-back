const { Sequelize, DataTypes } = require('sequelize')
const fs = require('fs')
const path = require('path')
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DATABASE_URL } = process.env

const sequelize = new Sequelize(
  DATABASE_URL
    ? `${DATABASE_URL}`
    : `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
    ssl: process.env.PORT ? true : false,
    dialectOptions: process.env.PORT
      ? {
          ssl: { require: true, rejectUnauthorized: false },
        }
      : {},
  }
)
const basename = path.basename(__filename)

const modelDefiners = []

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '../models'))
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '../models', file)))
  })

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize))

// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models)
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
])
sequelize.models = Object.fromEntries(capsEntries)

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Categoria, Libro, Formato, Pedido, Tag, Usuario, Review, Comentario } =
  sequelize.models

// Categoria N<=>M Libro
Categoria.belongsToMany(Libro, {
  through: 'Categoria_Libro',
  as: 'CategoriaLibro',
})
Libro.belongsToMany(Categoria, {
  through: 'Categoria_Libro',
  as: 'CategoriaLibro',
})

// Tag N<=>M Libro
Tag.belongsToMany(Libro, { through: 'Tag_Libro', as: 'TagLibro' })
Libro.belongsToMany(Tag, { through: 'Tag_Libro', as: 'TagLibro' })

// Pedido N<=>M Libro
const Detalle = sequelize.define('Detalle', { cantidad: DataTypes.INTEGER })
Pedido.belongsToMany(Libro, { through: Detalle, as: 'DetalleLibro' })
Libro.belongsToMany(Pedido, { through: Detalle, as: 'DetalleLibro' })

// Libros N<=>M Formato
Libro.belongsToMany(Formato, { through: 'Formato_Libro', as: 'FormatoLibro' })
Formato.belongsTo(Libro, { through: 'Formato_Libro', as: 'FormatoLibro' })

// Usuario 1=>N Pedido
Usuario.hasMany(Pedido)
Pedido.belongsTo(Usuario)

// Libro 1=>N Review
Libro.hasMany(Review)
Review.belongsTo(Libro)

// User 1=>N Review
Usuario.hasMany(Review)
Review.belongsTo(Usuario)

// Review 1=>N Comentarios
Review.hasMany(Comentario)
Comentario.belongsTo(Review)

// User 1=>N Comentarios
Usuario.hasMany(Comentario)
Comentario.belongsTo(Usuario)

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,
  Detalle, // para importart la conexión { conn } = require('./db.js');
}
