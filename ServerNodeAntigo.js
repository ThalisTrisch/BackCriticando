//Importações usando require
const http = require("http");
const express = require("express");
const app = express();
const session = require('express-session');
const formidable = require('formidable');
var crypto = require('crypto');
const { hash } = require('bcrypt');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
var bodyparser = require('body-parser');
const nodemailer = require('nodemailer');
const { render, get } = require("express/lib/response");
const { resourceLimits } = require("worker_threads");
const { resolveSoa } = require("dns");
const multer = require('multer')
var passport = require('passport')
var auth = require("./middleware/auth")
const { storage } = require('./middleware/uploadfoto.js');
const upload = multer({ storage: storage })
const uploadbackground = multer({ 
    dest: 'public/imagens/background/',
    storage: multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, 'public/imagens/background/')
        },
        filename: (req, file, cb) =>{
            crypto.randomBytes(4, (err,hash)=>{
                if(err) cb(err);
                var filename = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, filename);
            })
        }
    }),
    filefilter: (req, file, cb) =>{
        const types = [
            'image/png',
            'image/jpg',
            'image/jpeg'
        ];
        if(types.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new error("invalid mimetype"))
        }
    }
})
const uploadimagem = multer({ 
    dest: 'public/imagens/imagem/',
    storage: multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, 'public/imagens/imagem/')
        },
        filename: (req, file, cb) =>{
            crypto.randomBytes(4, (err,hash)=>{
                if(err) cb(err);
                var filename = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, filename);
            })
        }
    }),
    filefilter: (req, file, cb) =>{
        const types = [
            'image/png',
            'image/jpg',
            'image/jpeg'
        ];
        if(types.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new error("invalid mimetype"))
        }
    }
})

//configurações utilizando express
app.use(express.static("public"));
app.set('view engine', 'ejs')
app.use(session({ secret: '2C44-4D44-WppQ38S', resave: false, saveUninitialized: true }));
app.use(bodyparser.urlencoded({ extended : false}))
app.use(passport.initialize())
app.use(passport.session())

//conexão BD
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "DBcriticando",
});

app.get('/', function (req, res) {
    res.render("inicial.ejs");
});

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/success', function(req,res){
    console.log(`logado`)
    const sql = `select * from usuario where email = '${req.user.email}'`;
    con.query(sql, function (err, result){
        if(result[0] == undefined){
            console.log(req.user.displayName)
            const sqlinsert = `insert into usuario values('${req.user.displayName}','${req.user.email}','imagemusuariodefault.png')`;
            con.query(sqlinsert, function (err, result) {});
        }
        req.session.loggedin = true;
        req.session.useremail = req.user.email
        res.redirect('/principal');
    });
});

app.get('/auth/google/failure', function(req,res){
    res.send("Algo deu errado, clique a seguir para voltar para a pagina inicial: <a href="/">voltar</a>")
});

app.get('/principal', function (req, res) {
    if (req.session.loggedin) {
        var email = req.session.useremail;
        var sql = `select * from usuario where email = '${email}'`;
        con.query(sql, function (err, dadosusuario) {
            var sqldados = "select * from postagem";
            con.query(sqldados, function (err, dadospostagens) {
                res.render('principal.ejs', { postagens: dadospostagens, usuario: dadosusuario });
            });
        });
    } else {
        res.redirect("/");
    }
});

app.post('/principal/desconectar', function (req, res) {
    req.session.destroy(function (err) {
        // cannot access session here
        res.redirect('/');
    })
});

app.post('/principal/pesquisar', function (req, res) {
    var pesquisar = req.body['pesquisar']
    if (req.session.loggedin) {
        var email = req.session.useremail;
        var sql = `select * from usuario where email = '${email}'`;
        con.query(sql, function (err, dadosusuario) {
            var sqldados = `select * from postagem where titulo like '%${pesquisar}%'`;
            con.query(sqldados, function (err, dadospostagens) {
                res.render('principal.ejs', { postagens: dadospostagens, usuario: dadosusuario });
            });
        });
    } else {
        res.redirect("/");
    }
});

app.get('/principal/meuperfil/:nome', function (req, res) {
    var email = req.session.useremail;
    var sql = `select * from usuario where email = '${email}'`;
    con.query(sql, function (err, dadosusuario) {
        sqlpost = `select * from postagem where email = '${email}'`
        con.query(sqlpost, function (err, dadospostagem) {
            res.render("meuperfil.ejs", { postagens: dadospostagem, usuario: dadosusuario });
        });
    });
});

app.post('/principal/meuperfil/mudarfoto/upload', upload.single('file'), function (req, res, next) {
    var sqluser = `select * from usuario where email = '${req.session.useremail}'`;
    con.query(sqluser, function (err, dadosusuario) {
        console.log("antiga foto: ",dadosusuario[0]['foto']);
        console.log("nova foto: ",req.file.filename);
        if(dadosusuario[0]['foto'] != "imagemusuariodefault.png"){
            fs.unlink(`${__dirname}/public/imagens/fotouser/${dadosusuario[0]['foto']}`, (err => {
                if (err) console.log(err);
            }));
        }
        sqlup = `update usuario set foto ='${req.file.filename}' where email = '${req.session.useremail}'`;
        con.query(sqlup, function (err, result) {
            res.redirect(`/principal/meuperfil/${dadosusuario[0]['nome']}`);
        })
    });
});

app.post('/principal/meuperfil/mudarfoto/remover', function (req, res) {
    var sqluser = `select * from usuario where email = '${req.session.useremail}'`;
    con.query(sqluser, function (err, dadosusuario) {
        if(dadosusuario[0]['foto'] == 'imagemusuariodefault.png'){
            console.log("Foto padrão já está definida com foto de perfil")
        }else{
            fs.unlink(`${__dirname}/public/imagens/fotouser/${dadosusuario[0]['foto']}`, (err => {
                if (err) console.log(err);
            }));
            var sqlfoto = `update usuario set foto = 'imagemusuariodefault.png' where email = '${req.session.useremail}'`
            con.query(sqlfoto, function (err, result) {
                if (err) console.log(err);
            });
        }
        res.redirect(`/principal/meuperfil/${dadosusuario[0]['nome']}`);
    });
});

app.get('/principal/criarpostagem', function (req, res) {
    res.render('criarpostagem.ejs');
});

app.post('/principal/criarpostagem/postar', function(req,res){
    var email = req.session.useremail;
    var titulo = req.body['titulo'];
    var conteudo = req.body['conteudo'];
    var id = 1;
    if (titulo != undefined && conteudo != undefined) {
        var sqlid = "select id from postagem where id >= (select max(id) from postagem)"
        con.query(sqlid, function (err, result) {
            if (typeof result[0] != "undefined") {
                id += result[0]['id'];
            }
            sql = `insert into postagem values('${email}','${titulo}','${conteudo}','default.jpg','bgdefault.jpg',0,${id})`;
            con.query(sql, function (err, result1) {
                if (err) throw err;
                res.redirect("/principal/criarpostagem/postar/imagem/"+id);
            });
        });
    } else {
        res.redirect("/principal/criarpostagem");
    }
})

app.get('/principal/criarpostagem/postar/imagem/:id', function (req, res, next) {
    var id = req.params['id'];
    res.render("inseririmagem.ejs",{id})
});

app.post('/principal/criarpostagem/postar/background/:id', uploadimagem.single('imagem'), function (req, res, next) {
    var id = req.params['id'];
    sqlup = `update postagem set imagem ='${req.file.filename}' where id = ${id}`;
    con.query(sqlup, function (err, result) {
        if(err) throw err;
        res.render("inserirbackground.ejs",{id})
    })
});

app.get('/principal/criarpostagem/postar/background/:id', function (req, res, next) {
    var id = req.params['id'];
    res.render("inserirbackground.ejs",{id})
});

app.post('/principal/criarpostagem/postar/finalizar/:id', uploadbackground.single('background'), function (req, res, next) {
    var id = req.params['id'];
    sqlup = `update postagem set bgimagem ='${req.file.filename}' where id = ${id}`;
    con.query(sqlup, function (err, result) {
        if(err) throw err;
        res.redirect("/principal");
    })
});

app.get('/principal/post/:id', function (req, res) {
    var id = req.params['id'];
    var email = req.session.useremail;
    var sql = `select * from postagem where id = ${id}`;
    con.query(sql, function (err, dadospost) {
        var sqlcoment = `select *,a.curtidas as likes from comentario as A,postagem as B, usuario as C where A.id = B.id and B.id = ${id} and C.email = A.email`
        con.query(sqlcoment, function (err, dadoscoment) {
            var sqluser = `select * from usuario where email = '${email}'`
            con.query(sqluser, function (err, dadosuser) {
                res.render("postagem.ejs", { postagem: dadospost, comentario: dadoscoment, usuario:dadosuser, id})
            });
        });
    });
});

app.post('/principal/post/:id/curtirpostagem', function (req, res) {
    var id = req.params['id'];
    var email = req.session.useremail;
    var sql = `select * from postagemcurtidas where email = '${email}' and id = ${id}`;
    con.query(sql, function (err, dadosusercurtida) {
        var sqlcurtidas = `select curtidas from postagem where id = ${id}`;
        con.query(sqlcurtidas, function (err, curtidas) {
            if(dadosusercurtida[0] != undefined){
                var sqlupdatecurtida = `update postagem set curtidas = ${curtidas[0]['curtidas']-1} where id = ${id}` 
                con.query(sqlupdatecurtida, function (err, dadoscurtida) {
                    var sql = `delete from postagemcurtidas where email = '${email}' and id = ${id}`;
                    con.query(sql, function (err, result) {
                        if(err) throw err;
                    });
                });  
            }else{
                var sqlupdatecurtida = `update postagem set curtidas = ${curtidas[0]['curtidas']+1} where id = ${id}`
                con.query(sqlupdatecurtida, function (err, dadoscurtida) {
                    var sql = `insert into postagemcurtidas values('${email}',${id})`;
                    con.query(sql, function (err, dadoscurtida) {
                        if (err) throw err;
                    });
                });
            }
        })
    });
    res.redirect("/principal/post/"+id);
});

app.post('/principal/post/:id/curtircomentario/:posicao', function (req, res) {
    var id = req.params['id'];
    var posicao = req.params['posicao'];
    var email = req.session.useremail;
    var sql = `select * from comentariocurtidas where email = '${email}' and posicao = ${posicao}`;
    con.query(sql, function (err, dadosusercurtida) {
        var sqlcurtidas = `select curtidas from comentario where posicao = ${posicao}`;
        con.query(sqlcurtidas, function (err, curtidas) {
            if(dadosusercurtida[0] != undefined){
                var sqlupdatecurtida = `update comentario set curtidas = ${curtidas[0]['curtidas']-1} where posicao = ${posicao}` 
                con.query(sqlupdatecurtida, function (err, dadoscurtida) {
                    var sql = `delete from comentariocurtidas where email = '${email}' and posicao = ${posicao}`;
                    con.query(sql, function (err, result) {
                        if(err) throw err;
                    });
                });  
            }else{
                var sqlupdatecurtida = `update comentario set curtidas = ${curtidas[0]['curtidas']+1} where posicao = ${posicao}`;
                con.query(sqlupdatecurtida, function (err, dadoscurtida) {
                    var sql = `insert into comentariocurtidas values('${email}',${id},${posicao})`;
                    con.query(sql, function (err, dadoscurtida) {
                        if (err) throw err;
                    });
                });
            }
        })
    });
    res.redirect("/principal/post/"+id);
});

app.post('/principal/post/:id/comentar', function (req, res) {
    var id = req.params['id'];
    var comentario = req.body['comentario'];
    var email = req.session.useremail;
    var posicao = 1;
    var sqlpos = `select posicao from comentario where posicao >= (select max(posicao) from comentario)`;
    con.query(sqlpos, function (err, dadosposicao) {
        if (dadosposicao[0] != undefined) {
            posicao += dadosposicao[0]['posicao'];
        }
        var sql = `insert into comentario values('${comentario}','${email}',0,${id},${posicao})`;
        con.query(sql, function (err, dadospost) {
            if(err) throw err;
        });
        res.redirect(`/principal/post/${id}`)
    });
});

app.post('/principal/post/:id/removercomentario/:posicao', function (req, res) {
    var id = req.params['id'];
    var posicao = req.params['posicao'];
    sqldelete = `delete from curtidascomentario where posicao = ${posicao}`;
    con.query(sqldelete, function (err, result) {
        sqldelete = `delete from comentario where posicao = ${posicao}`;
        con.query(sqldelete, function (err, result) {
            res.redirect("/principal/post/"+id);
        });
    });
});

app.get('/principal/post/:id/teorias', function (req, res) {
    var id = req.params['id'];
    sql = `select * from teorias where id = ${id}`;
    con.query(sql, function (err, result) {
        res.render("teoria.ejs",{teorias:result,id});
    });
});

app.get('/principal/post/:id/criarteoria', function (req, res) {
    var id = req.params['id'];
    res.render("criarteoria.ejs",{id});
});

app.post('/principal/post/:id/teorias/publicar', function (req, res) {
    var id = req.params['id'];
    var titulo = req.body['titulo']
    var conteudo = req.body['conteudo']
    var sql = `insert into teoria values()`;
});

port = 100;
app.listen(port, function (req, res) {
    console.log('Executando em http://localhost:' + port);
    //url: http://localhost:100
});