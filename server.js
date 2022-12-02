//declarações das bibliotecas
const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");
const mysql = require('mysql');

app.use(cors());
app.use(express.json());
app.use(session({ secret:'2klqjKDF0032KccxMs3k_ms@Fm485024mfll4bs92lbme8#JD@22kFVee', resave: false, saveUninitialized: true }));

//conexão com o banco de dados
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "criticando",
});

//rotas GET
app.get("/getpostagens", (req,res) => {
    const sql = `select * from usuario as A, postagem as B where A.email = B.email;`;
    con.query(sql, function (err, result){
        res.send(result);
    });
})

app.get("/getobras", (req,res) => {
    const sql = `select obra from obra`;
    con.query(sql, function (err, result){
        res.send(result);
    });
})

app.get("/getidpostagem", (req,res) => {
    var sqlid = "select id from postagem where id >= (select max(id) from postagem)"
    con.query(sqlid, function (err, result){
        res.send(result);
    });
})

app.get("/getpostagem/:id/:email", (req,res) => {
    const {id} = req.params;
    const {email} = req.params;
    const sqlpost = `select * from postagem as A, usuario as B where A.id = ${id} and A.email = B.email`;
    con.query(sqlpost, function (err, result){
        res.send(result);
    });
})

app.post("/getstars/:id/:email", (req,res) => {
    const {id} = req.params;
    const {email} = req.params;
    const sqlpost = `select * from postagemstars where id = ${id} and email = '${email}'`;
    con.query(sqlpost, function (err, result){
        res.send(result);
    });
})

app.get("/getuser/:email", (req,res) => {
    const {email} = req.params;
    const sqlpost = `select * from usuario where email = '${email}'`;
    con.query(sqlpost, function (err, result){
        res.send(result);
    });
})

app.get("/getteoria/:id", (req,res) => {
    const {id} = req.params;
    const sqlpost = `select * from teoria as T,usuario as U where T.email = U.email and T.id = ${id}`;
    con.query(sqlpost, function (err, result){
        res.send(result);
    });
})

app.get("/getcomentario/:id", (req,res) => {
    const {id} = req.params;
    console.log("id da postagem: --->",id)
    const sqlcoment = `select * from comentario as A, usuario as B where id = ${id} and A.email = B.email`;
    con.query(sqlcoment, function (err, result){
        res.send(result);
    });
})

app.get("/pesquisar/:pesquisa", (req,res) => {
    const {pesquisa} = req.params;
    const sql = `select * from usuario as A, postagem as B where A.email = B.email and titulo like '%${pesquisa}%'`;
    con.query(sql, function (err, result){
        res.send(result);
    });
})

//rotas POST
app.post('/autenticar', (req,res) => {
    const {email} = req.body;
    const {name} = req.body;
    const {id} = req.body;
    req.session.loggedin = true;
    req.session.useremail = email;
    const sql = `select * from usuario where email = '${email}'`;
    con.query(sql, function (err, result){
        if(result[0] == undefined){
            const sqlinsert = `insert into usuario values('${name}','${email}','imagemusuariodefault.png')`;
            con.query(sqlinsert, function (err, result) {
                if(err){console.log("problema na criação de conta")};
            });
            console.log("Conta criada");
        }else{
            console.log("usuário logado:",email)
        }
    });
})

app.post("/curtircomentario", (req,res) => {
    const {id} = req.body;
    const {email} = req.body;
    const {curtidas} = req.body;
    const {posicao} = req.body;
    const updatecurtidas = `update comentario set curtidas = ${curtidas} WHERE posicao = ${posicao}`
    con.query(updatecurtidas, function (err, result){if (err) throw err});
    const curtircoment = `insert into comentariocurtidas values('${email}',${id},${posicao})`;
    con.query(curtircoment, function (err, result) {if (err) throw err});
})

app.post("/descurtircomentario", (req,res) => {
    const {id} = req.body;
    const {email} = req.body;
    const {curtidas} = req.body;
    const {posicao} = req.body;
    const updatecurtidas = `update comentario set curtidas = ${curtidas} WHERE posicao = ${posicao}`
    con.query(updatecurtidas, function (err, result){if (err) throw err});
    const curtircoment = `delete from comentariocurtidas where posicao = ${posicao} and email = '${email}'`;
    con.query(curtircoment, function (err, result) {if (err) throw err});
})

app.post("/getusuario", (req,res) => {
    const {email} = req.body
    const sql = `select * from usuario where email = '${email}'`;
    con.query(sql, function (err, result){
        res.send(result);
    });
})

app.post("/getcurtido", (req,res) => {
    const {id} = req.body;
    const {email} = req.body;
    const {posicao} = req.body;
    const sqlcoment = `select * from comentariocurtidas where id = ${id} and email = '${email}' and posicao = ${posicao}`;
    con.query(sqlcoment, function (err, result){
        res.send(result)
    });
})

app.post("/getpostagem/meuperfil", (req,res) => {
    const {email} = req.body
    const sql = `select * from usuario as A, postagem as B where A.email = B.email and B.email = '${email}'`;
    con.query(sql, function (err, result){
        res.send(result);
    });
})

app.post('/criarpostagem', (req,res) => {
    const {titulo} = req.body
    const {email} = req.body
    const {obra} = req.body
    const {conteudo} = req.body
    const {data} = req.body
    var id = 1;
    var sqlid = "select id from postagem where id >= (select max(id) from postagem)"
    con.query(sqlid, function (err, result) {
        if (typeof result[0] != "undefined") {
            id += result[0]['id'];
            res.send({id:id})
        }
        sql = `insert into postagem values('${email}','${titulo}','${obra}','${conteudo}','https://hospitalsantamonica.com.br/wp-content/uploads/2021/07/FILME-DE-TERROR-scaled.jpg','https://t4.ftcdn.net/jpg/03/22/45/85/360_F_322458522_fWMrqLWx59EDO1jYpMq0ACdkzv8YEYUj.jpg',0,'${data}',${id},null)`;
        con.query(sql, function (err, result1) {
            if(err) throw err;
        });
    });
})

app.post('/criarteoria', (req,res) => {
    const {titulo} = req.body
    const {email} = req.body
    const {conteudo} = req.body
    const {id} = req.body
    var posicao = 1;
    var sqlid = "select numero from teoria where numero >= (select max(numero) from teoria)"
    con.query(sqlid, function (err, result) {
        if(err) throw err;
        if(typeof result[0] != "undefined"){
            posicao += result[0]['numero'];
        }
        sql = `insert into teoria values('${titulo}','${conteudo}','${email}',${id},0,0,${posicao})`;
        con.query(sql, function (err, result1) {
            if(err) throw err;
        });
    });
})

app.post("/deletarpostagem/:id", (req,res) => {
    const {id} = req.params
    const deleteteoria = `delete from teoria where id = ${id}`;
    const deletestars = `delete from postagemstars where id = ${id}`;
    const deletecomentario = `delete from comentario where id = ${id}`;
    const deletecurtidas = `delete from comentariocurtidas where id = ${id}`;
    const deletefavoritas = `delete from postagemfavoritas where id = ${id}`;
    const deleteavaliacao = `delete from avaliacaoteoria where id = ${id}`;
    const deletepostagem = `delete from postagem where id = ${id}`;
    con.query(deleteteoria, function (err, result){});
    con.query(deletestars, function (err, result){});
    con.query(deletecomentario, function (err, result){});
    con.query(deletecurtidas, function (err, result){});
    con.query(deletefavoritas, function (err, result){});
    con.query(deleteavaliacao, function (err, result){});
    con.query(deletepostagem, function (err, result){});
})

app.post("/deletarcomentario", (req,res) => {
    const {id} = req.body;
    const {email} = req.body;
    const {posicao} = req.body;
    const deletelikescoment = `delete from comentariocurtidas where id = ${id} and email = '${email}' and posicao = ${posicao}`;
    const deletecoment = `delete from comentario where id = ${id} and email = '${email}' and posicao = ${posicao}`;
    con.query(deletelikescoment, function (err, result){});
    con.query(deletecoment, function (err, result){});
    const quantcoment = `select count(*) as quantidade from comentario where id = ${id}`;
        con.query(quantcoment, function (err, quantidade) {
            if(err) throw err
            const updatepostagem = `update postagem set comentarios = ${quantidade[0]['quantidade']} where id = ${id}`;
            con.query(updatepostagem, function (err, alterar) {if(err) throw err});
        });
})

app.post("/deletarfoto/:email", (req,res) => {
    const {email} = req.params
    const deletarfoto = `update usuario set foto = 'imagemusuariodefault.png' where email = '${email}'`;
    con.query(deletarfoto, function (err, result){});
})

app.post('/comentar', (req,res) => {
    const {email} = req.body
    const {id} = req.body
    const {comentario} = req.body
    var posicao = 1;
    const sqlpos = `select posicao from comentario where posicao >= (select max(posicao) from comentario)`;
    con.query(sqlpos, function (err, dadosposicao) {
        if (dadosposicao[0] != undefined) {posicao += dadosposicao[0]['posicao'];}
        const sqlcoment = `insert into comentario values('${comentario}','${email}',0,${id},${posicao})`;
        con.query(sqlcoment, function (err, comentar) {if(err) throw err});
        const quantcoment = `select count(*) as quantidade from comentario where id = ${id}`;
        con.query(quantcoment, function (err, quantidade) {
            if(err) throw err
            const sqlpostcoment = `update postagem set comentarios = ${quantidade[0]['quantidade']} where id = ${id}`;
            con.query(sqlpostcoment, function (err, alterar) {if(err) throw err});
            console.log("comentario criado")
        });
    });

})

app.post('/inseririmagem', (req,res) => {
    const {imagem} = req.body
    const {id} = req.body
    var sql = `UPDATE postagem SET imagem = '${imagem}' WHERE id = ${id}`;
    con.query(sql, function (err, result) {});
})

app.post('/inserirfoto', (req,res) => {
    const {foto} = req.body
    const {email} = req.body
    var sql = `UPDATE usuario SET foto = '${foto}' WHERE email = '${email}'`;
    con.query(sql, function (err, result) {});
})

app.post('/inserirbackground', (req,res) => {
    const {background} = req.body
    const {id} = req.body
    var sql = `update postagem set bgimagem = '${background}' WHERE id = ${id}`;
    con.query(sql, function (err, result) {});
})

app.post('/avaliarpostagem/:id', (req,res) => {
    const {email} = req.body
    const {star} = req.body
    const {id} = req.params
    const sqlverif = `select * from postagemstars where email = '${email}'`;
    con.query(sqlverif, function (err, result) {
        if (result[0] == undefined) {
            var sql = `insert into postagemstars values('${email}',${id},${star})`;
            con.query(sql, function (err, sqlresult) {if(err) throw err});
        }else{
            var sql = `update postagemstars set stars = ${star} WHERE email = '${email}'`;
            con.query(sql, function (err, sqlresult) {if(err) throw err});
        }
        var sqlpoststar = `SELECT count(*) as avaliacoes, sum(stars) as soma FROM postagemstars where id = ${id} and email != '${email}'`;
        con.query(sqlpoststar, function (err, resultstars) {
            const avaliacoes = resultstars[0]['avaliacoes']+1
            const soma = resultstars[0]['soma']
            media = (soma+star)/(avaliacoes);
            var sqlmediastars = `update postagem set stars = ${media} where id = ${id}`;
            con.query(sqlmediastars, function (err, resultstars) {if(err) throw err});
        });
    });
})

var port = 3001;
app.listen(port, (req,res) => {
    console.log("executando na porta:"+ port);
})