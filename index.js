const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT||3000;

// MongoDb
const MongoClient = require('mongodb').MongoClient
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/dev'

async function initMongo(){
    console.log('initialzing MongoDB. . .')
    let success = false;
    while(!success){
        try{
            client = await MongoClient.connect(mongoURL,{useNewUrlParser: true})
            success = true;
        } catch{
            console.log('Error connecting to MongoDB, retrying in 1 second')
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
        console.log('MongoDB initialized')
        return client.db(client.s.opions.dbName).collection('notes')

    }
}

async function start(){
    app.set('view engine', 'pug')
    app.set('views', path.join(__dirname, 'public'))
    app.use(express.static(path.join(__dirname, 'public')))
    
    app.listen(port, ()=>{
        console.log('App Listening on http://localhost:${port}')
    })
    app.get('/',(req, res)=>res.render('index'))
    const db = await initMongo()
}
start()
