// import express from "express";
// import mysql  from "mysql2"

// const db: mysql.Connection = mysql.createConnection({
//     host: 'db', //service name of docker compose
//     user: 'root',
//     password: 'root',
//     database: 'practice'
// });

// //
// db.query('SELECT (1)' , (err: mysql.QueryError | null, results: mysql.RowDataPacket[] | mysql.RowDataPacket[][] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader) => {
//     console.log(results)
// });
// //

// const PORT: number = 8080;
// const app = express();

// app.listen(PORT, ():void => {
//     console.log(`Start on port ${PORT}.`);
// });

// app.get("/", (req: express.Request, res: express.Response):void => {
//     res.send('Hello world');
// });


import express from "express";
import mysql  from "mysql2/promise"

const PORT: number = 8080;
const app = express();
const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'practice',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });



app.listen(PORT, ():void => {
    console.log(`Start on port ${PORT}.`);
});

app.get("/", async (req: express.Request, res: express.Response) => {
    try {
        console.log('before');
        //await pool.execute('DO SLEEP(3)');
        console.log('after');
        res.send('Hello world');

        res.send(pool)

    } catch(err:any) {
        res.status(503)
        res.send(err.message);
    }
});

app.get('/insert', async (req: express.Request, res: express.Response) => {
    //testsテーブルにid:1, name:kubotaをインサートする
    let data:any = await pool.execute('insert into tests values(0, ?)', [req.query.name]);
    // res.send('insert done')

    //let data:any = await pool.execute('select * from tests where id = 1;')
    console.log(data)
    //JSONの形で指定された通りのレスポンスを返却する
    res.json({"status":200, "id":data[0]["insertId"], "name":req.query.name})

});

app.get("/select", async (req: express.Request, res: express.Response) => {
    let data:any = await pool.execute('select name from tests where id = ?', [req.query.id]);
    
    res.json({"status":200, "name":data[0][0]["name"]})
    // const [rows] = await pool.execute('SELECT * FROM tests');
    // const result = {
    //     "status": 200,
    //     "name": rows
    // }
    // res.send(result);
})

app.get("/insert_todo", async (req: express.Request, res: express.Response) => {
    let data:any = await pool.execute('insert into todo values(0, ?, false)', [req.query.taskName]);
    console.log("OK!")
    res.json({"status":200, "id":data[0]["insertId"], "name":req.query.taskName, "state":false})
})


// close database connection correctly
process.on('SIGINT', () => {
    pool.end();
    console.log('Connection pool closed');
    process.exit(0);
});

app.use(express.json())



//------------------------------------
//todo list web API!!!!
//------------------------------------


//create
app.post('/tasks', async (req, res) => {
    try{
        let data:any = await pool.execute('insert into todo values(0, ?, false, ?)', [req.body.name, req.body.comment]);
        console.log("OK!")
        res.json({"status":200, "id":data[0]["insertId"], "name":req.body.name, "state":false, "comment":req.body.comment})
    }catch(error){
        console.error(error)
        res.status(400).json({error:"400 bad request"})
    }
})

//list
app.get('/tasks', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM todo;")
        res.json(rows)
    }catch (error) {
        console.error(error)
        res.status(500).json({error:"Internal server error"})
    }
})

//change state
app.put('/tasks', async (req, res) => {
    try{
        let data:any = await pool.execute('update todo set state = true where id = ?', [req.body.id]);
        console.log("changed!")
        console.log(data)
    }catch(error){
        console.error(error)
        res.status(400).json({error:"400 bad request"})
    }

    res.json({"status":200, "id":true ,"state":req.body.state})

})
