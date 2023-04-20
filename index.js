const express = require('express')
const app = express()
const multer = require('multer')
const fs = require('fs')

//storage -> local ond vai ser armazenado
const storage = multer.diskStorage(
    //requisição, arquivo, callback
    {
        destination:(req, file, cab) => {
            cab(null, './uploads')
        },
        filename:(req, file, cab) => {
            cab(null, Date.now().toString() + '_' + file.originalname)
        },
    }

);

//filter -> tipo de arquivo que pode subir(jpg e png *Nesse caso*)
const fileFilter = (req, file, cab) => {

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
        cab(null, true)
    } else {
        cab(null, false)
    }

}

//upload -> storage, limits, filterFile

const upload = multer(
    {
        storage: storage,
        limits:{
            fileSize: (1024 ** 2) * 5 
            //5 kbytes 
        },
        fileFilter: fileFilter
    }
);

//rota post -> upload
app.post('/upload', upload.array('imagem', 2), (req, res)=> {
    console.log(req.files)
    console.log(req.body.nome)
    console.log(req.body.email)

    res.send('upload feito!')
})

app.delete('/delete/:imagem', (req, res)=> {
    
    let { imagem } = req.params;
    let caminho = './uploads/' + imagem;

    fs.unlink(caminho, 
        (error) =>{

            if(error){
                res.send('Não deu lek');
                console.log('Error na imagem lek' + error)
            }else {
                res.send('Imagem feita lek!')
            }
    })
})


app.use(express.json())

app.listen(3000, ()=>{
    console.log('Servidor: http://localhost:3000')
});