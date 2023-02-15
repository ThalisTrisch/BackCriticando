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
app.get("/autorizarlogin/:email", (req,res) => {
    if(req.session.loggedin = true){
        res.send(req.session.loggedin)
    }
})

app.get("/getgeneros", (req,res) => {
    const sql = `select * from genero group by genero;`;
    con.query(sql, function (err, result){
        res.send(result);
    });
})

app.get("/getpostagens", (req,res) => {
    const sql = `select * from usuario as A, postagem as B where A.email = B.email limit 20`;
    con.query(sql, function (err, result){
        res.send(result);
    });
})

app.get("/getpostagensdetalhadas", (req,res) => {
    const sql = `select * from usuario as U, postagem as P, obras as O, genero as G where U.email = P.email and P.obra = O.obra and G.obra = O.obra;`;
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
    const {id,email} = req.params;
    const sqlpost = `select * from postagem as A, usuario as B where A.id = ${id} and A.email = B.email`;
    con.query(sqlpost, function (err, result){
        res.send(result);
    });
})

app.get("/getstars/:id/:email", (req,res) => {
    const {id,email} = req.params;
    const sqlpost = `select * from postagemstars where id = ${id} and email = '${email}'`;
    con.query(sqlpost, function (err, result){
        res.send(result);
    });
})

app.get("/getuser/:email", (req,res) => {
    const {email} = req.params;
    const sqlpost = `select * from usuario as A,redessociais as B where A.email = '${email}' and B.email = '${email}'`;
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
    const sqlcoment = `select * from comentario as A, usuario as B where id = ${id} and A.email = B.email`;
    con.query(sqlcoment, function (err, result){
        res.send(result);
    });
})

app.get("/pesquisar/:pesquisa", (req,res) => {
    const {pesquisa} = req.params;
    const sql = `select * from usuario as A, postagem as B where A.email = B.email and obra like '%${pesquisa}%'`;
    con.query(sql, function (err, result){
        res.send(result);
    });
})

app.get("/getmaiorid", (req,res) => {
    const sql = "select posicao from comentario where posicao >= (select max(posicao) from comentario)"
    con.query(sql, function (err, result) {
        res.send(result[0])
    });
})

app.get("/getmelhorespostagens", (req,res) => {
    const sql = "select * from postagem as A, usuario as B where A.stars != 'null' and A.email = B.email ORDER BY stars desc LIMIT 3"
    con.query(sql, function (err,result){
        res.send(result)
    })
})

app.get("/getmelhoresusuarios", (req,res) => {
    const sql = "select A.nome,A.email,A.foto, count(*) as num_postagens from usuario as A,postagem as B where A.email = B.email group BY A.email order by num_postagens desc LIMIT 3"
    con.query(sql, function (err,result){
        res.send(result)
    })
})

app.get("/getuseravaliacoes/:email/:numero", (req,res) => {
    const {email,numero} = req.params
    const sql = `select email from avaliacoesteoria where email = '${email}' and numero = ${numero}`
    con.query(sql, function (err,result){
        res.send(result);
    })
})

app.get("/getaceitacao/:numero", (req,res) => {
    const {email,numero} = req.params
    const sql = `select aprovada,reprovada from teoria where numero = ${numero}`
    con.query(sql, function (err,result){
        res.send(result);
    })
})

app.get("/getredessociais/:email", (req,res) => {
    const {email} = req.params
    const sql = `select * from redessociais where email = '${email}'`
    con.query(sql, function (err,result){
        res.send(result)
    })
})

app.get("/getdados/:email", (req,res) => {
    const {email} = req.params
    const sqlcoment = `select count(*) as contagem from comentario where email = '${email}'`
    con.query(sqlcoment, function (err,resultcomentario){
        const sqlpost = `select count(*) as contagem from postagem where email = '${email}'`
        con.query(sqlpost, function (err,resultpostagem){
            const sqlteorias = `select count(*) as contagem from teoria where email = '${email}'`
            con.query(sqlteorias, function (err,resultteorias){
                const sqlseguidores = `select count(*) as contagem from seguidor where email = '${email}'`
                con.query(sqlseguidores, function (err,resultseguidor){
                    res.send({
                        comentarios:resultcomentario[0].contagem,
                        postagens:resultpostagem[0].contagem,
                        teorias:resultteorias[0].contagem,
                        seguidores:resultseguidor[0].contagem
                    })
                })
            })
        })
    })
})

app.post("/getfavoritos/:email", (req,res) => {
    const {email} = req.params;
    const sqlfavoritos = `select * from postagemfavoritas as A, postagem as B, usuario as C where A.id = B.id and C.email = B.email and A.email = '${email}';`;
    con.query(sqlfavoritos, function (err, result){
        res.send(result)
    });
})

app.get("/getmaiorposicao", (req,res) => {
    var posicao = 1;
    const sqlmaxpos = `select posicao from comentario where posicao >= (select max(posicao) from comentario)`;
    con.query(sqlmaxpos, function (err, result){
        if (result[0] != undefined) {
            posicao += result[0]['posicao'];
        }
        res.send({posicao})
    });
})


//rotas POST
app.post('/autenticar', (req,res) => {
    const {email,name} = req.body;
    req.session.loggedin = true;
    req.session.useremail = email;
    const sql = `select * from usuario where email = '${email}'`;
    con.query(sql, function (err, result){
        if(result){
            if(typeof result[0] === 'undefined'){
                const sqlinsert = `insert into usuario values('${name}','${email}','Olá, sou novo na plataforma!','imagemusuariodefault.png','perguntar')`;
                con.query(sqlinsert, function (err, result) {if(err){throw err};});
                const sqlredes = `insert into redessociais values ('${email}','','','')`;
                con.query(sqlredes, function (err, result){});
                console.log("Conta criada");
            }else{
                console.log("usuário logado:",email)
            }
        }else{
            console.log("Ocorreu algum erro")
        }
    });
})

app.post('/editarpostagem/:id', (req,res) => {
    const {titulo, conteudo} = req.body;
    const {id} = req.params;
    const sql = `update postagem set titulo = '${titulo}', conteudo = '${conteudo}' where id = ${id}`;
    con.query(sql, function (err, result){});
})

app.post('/atualizardados', (req,res) => {
    var {email,nome,bio,instagram,facebook,twitter} = req.body;
    const sqldados = `update usuario set nome='${nome}', biografia='${bio}' where email = '${email}'`;
    con.query(sqldados, function (err, result){});
    const sqlredes = `update redessociais set instagram='${instagram}', facebook='${facebook}', twitter='${twitter}' where email = '${email}'`;
    con.query(sqlredes, function (err, result){});
})

app.post('/aprovarteoria', (req,res) => {
    const {email,numero,id} = req.body;
    const sql = `insert into avaliacoesteoria values('${email}',${id},${numero},'aprovado')`;
    con.query(sql, function (err, result){});
    var num = 0;
    const sqlquant = `select aprovada from teoria where numero = ${numero}`;
    con.query(sqlquant, function (err, result){
        if(typeof result[0] != "undefined"){
            num = result[0].aprovada
        }
        const sqlteoria = `update teoria set aprovada = ${num+1} where numero = ${numero}`;
        con.query(sqlteoria, function (err, result){});
    });
})

app.post('/reprovarteoria', (req,res) => {
    const {email,numero,id} = req.body;
    const sql = `insert into avaliacoesteoria values('${email}',${id},${numero},'reprovado')`;
    con.query(sql, function (err, result){});
    var num = 0;
    const sqlquant = `select reprovada from teoria where numero = ${numero}`;
    con.query(sqlquant, function (err, result){
        if(typeof result[0] != "undefined"){
            num = result[0].reprovada
        }
        const sqlteoria = `update teoria set reprovada = ${num+1} where numero = ${numero}`;
        con.query(sqlteoria, function (err, result){});
    });
})

app.post("/favoritar", (req,res) => {
    const {id,email} = req.body;
    const favoritar = `insert into postagemfavoritas values('${email}',${id})`;
    con.query(favoritar, function (err, result) {if (err) throw err});
})

app.post("/desfavoritar", (req,res) => {
    const {id,email} = req.body;
    const favoritar = `delete from postagemfavoritas where email = '${email}' and id = ${id}`;
    con.query(favoritar, function (err, result) {if (err) throw err});
})

app.post("/curtircomentario", (req,res) => {
    const {email,curtidas,posicao} = req.body;
    console.log(posicao);
    const updatecurtidas = `update comentario set curtidas = ${curtidas} WHERE posicao = ${posicao}`
    con.query(updatecurtidas, function (err, result){if (err) throw err});
    const curtircoment = `insert into comentariocurtidas values('${email}',${posicao})`;
    con.query(curtircoment, function (err, result) {if (err) throw err});
})

app.post("/descurtircomentario", (req,res) => {
    const {id,email,curtidas,posicao} = req.body;
    const updatecurtidas = `update comentario set curtidas = ${curtidas} WHERE posicao = ${posicao} and id = ${id}`
    con.query(updatecurtidas, function (err, result){if (err) throw err});
    const curtircoment = `delete from comentariocurtidas where posicao = ${posicao} and email = '${email}'`;
    con.query(curtircoment, function (err, result) {if (err) throw err});
})

app.post("/getcurtido", (req,res) => {
    const {id,email,posicao} = req.body;
    const sqlcoment = `select * from comentariocurtidas where email = '${email}' and posicao = ${posicao}`;
    con.query(sqlcoment, function (err, result){
        res.send(result)
    });
})

app.post("/validarfavoritos", (req,res) => {
    const {id,email} = req.body;
    const sqlfavoritos = `select * from postagemfavoritas where email = '${email}' and id = ${id}`;
    con.query(sqlfavoritos, function (err, result){
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
    const {titulo,email,obra,conteudo,categoria,data,genero,linguagem,lancamento,obraid} = req.body
    var id = 1;
    sqlverifobra = `select * from obras where obra = '${obra}';`;
    con.query(sqlverifobra, function (err, resultobra) {
        ;
        if (typeof resultobra[0] == 'undefined') {
            sqlobra = `insert into obras values('${obra}','${lancamento}','${categoria}','${linguagem}',${obraid})`;
            con.query(sqlobra, function (err, result) {;});
            if(genero !== undefined){
                if(typeof genero[0] !== undefined){
                    const sqlgenero = `insert into genero values('${genero[0].name}','${obra}')`;
                    con.query(sqlgenero, function (err, result) {});
                }
            }
        }
    });
    var sqlid = "select id from postagem where id >= (select max(id) from postagem)"
    con.query(sqlid, function (err, resultid) {
        if (typeof resultid[0] != "undefined") {
            id += resultid[0]['id'];
        }
        const oldbackground = 'https://t4.ftcdn.net/jpg/03/22/45/85/360_F_322458522_fWMrqLWx59EDO1jYpMq0ACdkzv8YEYUj.jpg'
        const newbackground = 'https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg'
        sqlpost = `insert into postagem values('${email}','${titulo}','${obra}','${conteudo}','https://hospitalsantamonica.com.br/wp-content/uploads/2021/07/FILME-DE-TERROR-scaled.jpg','https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg',0,'${data}',${id},null)`;
        con.query(sqlpost, function (err, result) {;});
    });
    // genero.forEach((genero) => {
    //     console.log(genero.name)
    //     const sqlgenero = `insert into genero values('${genero.name}','${obra}')`;
    //     con.query(sqlgenero, function (err, result) {});
    // })
})

app.post('/criarteoria', (req,res) => {
    const {titulo,email,conteudo,id} = req.body
    var posicao = 1;
    var sqlid = "select numero from teoria where numero >= (select max(numero) from teoria)"
    con.query(sqlid, function (err, result) {
        ;
        if(typeof result[0] != "undefined"){
            posicao += result[0]['numero'];
        }
        sql = `insert into teoria values('${titulo}','${conteudo}','${email}',${id},0,0,${posicao})`;
        con.query(sql, function (err, result1) {
            ;
        });
    });
})

app.post("/deletarpostagem/:id/:obra", (req,res) => {
    const {id,obra} = req.params
    const deleteavaliacao = `delete from avaliacoesteoria where id = ${id}`;
    const deleteteoria = `delete from teoria where id = ${id}`;
    const deletestars = `delete from postagemstars where id = ${id}`;
    const deletecomentario = `delete from comentario where id = ${id}`;
    const deletecurtidas = `delete from comentariocurtidas where posicao in (select posicao from comentario where id = ${id})`;
    const deletefavoritas = `delete from postagemfavoritas where id = ${id}`;
    const deletepostagem = `delete from postagem where id = ${id}`;
    con.query(deleteavaliacao, function (err, result){if(err) throw err});
    con.query(deleteteoria, function (err, result){if(err) throw err});
    con.query(deletestars, function (err, result){if(err) throw err});
    con.query(deletecurtidas, function (err, result){if(err) throw err});
    con.query(deletecomentario, function (err, result){if(err) throw err});
    con.query(deletefavoritas, function (err, result){if(err) throw err});
    con.query(deletepostagem, function (err, result){if(err) throw err});
})

app.post("/deletarteoria", (req,res) => {
    const {email,numero} = req.body
    const deleteavaliacao = `delete from avaliacoesteoria where numero = ${numero}`;
    con.query(deleteavaliacao, function (err, result){});
    const deleteteoria = `delete from teoria where numero = ${numero} and email = '${email}'`;
    con.query(deleteteoria, function (err, result){});
})

app.post("/deletarcomentario", (req,res) => {
    const {id,email,posicao} = req.body;
    const deletelikescoment = `delete from comentariocurtidas where email = '${email}' and posicao = ${posicao}`;
    con.query(deletelikescoment, function (err, result){});
    const deletecoment = `delete from comentario where email = '${email}' and posicao = ${posicao}`;
    con.query(deletecoment, function (err, result){});
    const quantcoment = `select count(*) as quantidade from comentario where id = ${id}`;
    con.query(quantcoment, function (err, quantidade) {
        const updatepostagem = `update postagem set comentarios = ${quantidade[0]['quantidade']} where id = ${id}`;
        con.query(updatepostagem, function (err, alterar) {});
    });
})

app.post("/deletarfoto/:email", (req,res) => {
    const {email} = req.params
    const deletarfoto = `update usuario set foto = 'imagemusuariodefault.png' where email = '${email}'`;
    con.query(deletarfoto, function (err, result){});
})

app.post('/comentar', (req,res) => {
    const {email,id,comentario, posicao} = req.body
    const sqlcoment = `insert into comentario values('${comentario}','${email}',0,${id},${posicao})`;
    con.query(sqlcoment, function (err, comentar) {});
    const quantcoment = `select count(*) as quantidade from comentario where id = ${id}`;
    con.query(quantcoment, function (err, quantidade) {
        const sqlpostcoment = `update postagem set comentarios = ${quantidade[0]['quantidade']} where id = ${id}`;
        con.query(sqlpostcoment, function (err, alterar) {});
    });
})

app.post('/inserirfoto', (req,res) => {
    const {foto,email} = req.body
    var sql = `UPDATE usuario SET foto = '${foto}' WHERE email = '${email}'`;
    con.query(sql, function (err, result) {});
})

app.post('/inseririmagem', (req,res) => {
    const {imagem,id} = req.body
    var sql = `UPDATE postagem SET imagem = '${imagem}' WHERE id = ${id}`;
    con.query(sql, function (err, result) {});
})

app.post('/inserirbackground', (req,res) => {
    const {background,id} = req.body;
    var sql = `update postagem set bgimagem = '${background}' WHERE id = ${id}`;
    con.query(sql, function (err, result) {});
})

app.post('/avaliarpostagem', (req,res) => {
    const {email,star,id} = req.body
    const sqlverif = `select * from postagemstars where email = '${email}' and id = ${id}`;
    con.query(sqlverif, function (err, result) {
        if (result[0] == undefined) {
            var sql = `insert into postagemstars values('${email}',${id},${star})`;
            con.query(sql, function (err, sqlresult) {});
        }else{
            var sql = `update postagemstars set stars = ${star} WHERE email = '${email}' and id = ${id}`;
            con.query(sql, function (err, sqlresult) {});
        }
        var sqlpoststar = `SELECT count(*) as avaliacoes, sum(stars) as soma FROM postagemstars where id = ${id} and email != '${email}'`;
        con.query(sqlpoststar, function (err, resultstars) {
            const avaliacoes = resultstars[0]['avaliacoes']+1
            const soma = resultstars[0]['soma']
            media = (soma+star)/(avaliacoes);
            var sqlmediastars = `update postagem set stars = ${media} where id = ${id}`;
            con.query(sqlmediastars, function (err, resultstars) {});
        });
    });
})

app.post('/setperguntarnovamente', (req,res) => {
    const {email} = req.body;
    const sql = `update usuario set salateorias = 'seguir' where email = '${email}'`
    con.query(sql, function (err, result) {})
})

app.post('/seguirperfil', (req,res) => {
    const {email, emailseguidor} = req.body;
    const sql = `insert into seguidor values('${email}','${emailseguidor}')`
    con.query(sql, function (err, result){})
})

app.post('/cancelseguirperfil', (req,res) => {
    const {email, emailseguidor} = req.body;
    const sql = `delete from seguidor where email = '${emailseguidor}' and emailseguidor = '${email}'`;
    con.query(sql, function (err, result){})
})

app.post("/verifseguidor", (req,res) => {
    const {email,emailseguidor} = req.body;
    const sqlfavoritos = `select * from seguidor where email = '${email}' and emailseguidor = '${emailseguidor}'`;
    con.query(sqlfavoritos, function (err, result){
        res.send(result)
    });
})

app.post("/deletarconta/:email", (req,res) => {
    const {email} = req.params
    const deleteteoria = `delete from teoria where numero in (select numero from postagem as A, teoria as B where A.id = B.id and B.email = '${email}');`;
    const deletestars = `delete from postagemstars where id in (select id from postagem where email = '${email}');`;
    const deletecomentario = `delete from comentario where email = '${email}'`;
    const deletecurtidas = `delete from comentariocurtidas where id in (select id from comentario where email = '${email}')`;
    const deletefavoritas = `delete from postagemfavoritas where id in (select B.id from postagem as A, postagemfavoritas as B where B.email = '${email}' and A.id = B.id)`;
    const deleteavaliacao = `delete from avaliacoesteoria where numero in (select numero from teoria where email = '${email}');`;
    const deletepostagem = `delete from postagem where email = '${email}'`;
    const deleteredes = `delete from redessociais where email = '${email}'`;
    const deleteseguidor = `delete from seguidor where email = '${email}' or emailseguidor = '${email}'`;
    const deleteuser = `delete from usuario where email = '${email}'`;
    con.query(deleteavaliacao, function (err, result){});
    con.query(deletestars, function (err, result){});
    con.query(deletefavoritas, function (err, result){});
    con.query(deletecurtidas, function (err, result){});
    con.query(deleteteoria, function (err, result){});
    con.query(deletecomentario, function (err, result){});
    con.query(deletepostagem, function (err, result){});
    con.query(deleteseguidor, function (err, result){});
    con.query(deleteredes, function (err, result){});
    con.query(deleteuser, function (err, result){});
})

var port = 3001;
app.listen(port, (req,res) => {
    console.log("executando na porta:"+ port);
})