process.loadEnvFile()
import express from "express";
import mysql from "mysql2";

const app = express();
const port =  1234 || 0;

const db = mysql.createConnection({
    host: 'junction.proxy.rlwy.net',
    port: 41723,
    user: "root",
    password: 'QixLXGdzznWFfvBaeKzKbCrQmbfXpjHI', //process.env.DB_PASSWORD,
    database: "railway"
})

db.connect( err => {
    if(err){
        console.error("Error al conectarse a la base de datos " + err)
        return
    } 
    console.info("connection Exitosa")
})

// mysql://root:QixLXGdzznWFfvBaeKzKbCrQmbfXpjHI@junction.proxy.rlwy.net:41723/railway

app.use(express.static('public'))
app.use(express.json())


app.get('/Pool', (req, res) =>{
    express.static('public/add-productos.html')
})

// Crear CRUD 
// leer
app.get('/articulos', (req, res) =>{
    db.query("select * from railway.productosh", (err, result) => {
        if(err) return res.status(500).send(err)
        res.json(result)
        // console.log(result)
    })
})

// leer por id de articulo 
app.get("/articulos/:id", (req, res) =>{
    const { id }  = req.params;
    db.query('select * from railway.productosh where idh= ?', [id], (err, result)=>{
        if(err) return res.status(500).send(err)
        if ( result.length === 0 ) return res.status(404).send(500)
        res.json(result)
        // console.log(result)
    } )
})

app.put("/articulos/:id", (req, res) => {
    const { id }  = req.params;
    const {  nombreh, codigoh, descripcionh,precioh, imagenh, unidadh} = req.body

    const sql = `update railway.productosh
                    set  nombreh = ?,
                    codigoh = ?,
                    descripcionh = ?,
                    precioh = ?,
                    imagenh = ?,
                    unidadh = ?,
                    where idh = ?`
    
    db.query(sql, [nombreh, codigoh, descripcionh, precioh, imagenh, unidadh,id], (err, res) => {

        if(err) return res.status(500).send(err)

        if(res.affectedRows === 0 ) return res.status(404).json( {message: "Articulo no encontrado"})
        res.status(202).res.json({ message: " actulizado"})
    })

})



app.listen(port, ()=> {
    console.info(`Estoy escuchando en puerto ` + port)
})





