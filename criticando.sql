-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 26-Jan-2023 às 15:24
-- Versão do servidor: 10.4.22-MariaDB
-- versão do PHP: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `criticando`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `avaliacaoteoria`
--

CREATE TABLE `avaliacaoteoria` (
  `email` varchar(255) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  `numero` int(11) DEFAULT NULL,
  `avaliacao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `avaliacaoteoria`
--

INSERT INTO `avaliacaoteoria` (`email`, `id`, `numero`, `avaliacao`) VALUES
('thalistrisch.gr470@academico.ifsul.edu.br', 1, 2, 'aprovado');

-- --------------------------------------------------------

--
-- Estrutura da tabela `comentario`
--

CREATE TABLE `comentario` (
  `resposta` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `curtidas` int(11) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  `posicao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `comentario`
--

INSERT INTO `comentario` (`resposta`, `email`, `curtidas`, `id`, `posicao`) VALUES
('new comentário', 'thalistrisch.gr470@academico.ifsul.edu.br', 3, 1, 1),
('new coment', 'thalistrisch.gr470@academico.ifsul.edu.br', 1, 2, 2),
('comentário novo de demosntração de como se comenta na plataforma', 'thalistrisch.gr470@academico.ifsul.edu.br', 2, 1, 7),
('outro comentário só pra ter certeza', 'thalistrisch.gr470@academico.ifsul.edu.br', 0, 1, 8);

-- --------------------------------------------------------

--
-- Estrutura da tabela `comentariocurtidas`
--

CREATE TABLE `comentariocurtidas` (
  `email` varchar(255) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  `posicao` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `genero`
--

CREATE TABLE `genero` (
  `genero` varchar(255) DEFAULT NULL,
  `obra` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `genero`
--

INSERT INTO `genero` (`genero`, `obra`) VALUES
('Ação', 'One Piece 3D2Y'),
('Comédia', 'Saneamento Básico: O Filme'),
('Drama', 'The Walking Dead'),
('Terror', 'Bleach'),
('Documentário', 'Farofa da GKay: O Documentário'),
('Animação', 'Superman/Shazam!: O Retorno do Adão Negro'),
('Mistério', 'Supernatural'),
('Terror', 'Noite dos zumbis'),
('Comédia', 'Eu Matei Adam Sandler'),
('Família', 'Rin-Tin-Tin: Hero of the West');

-- --------------------------------------------------------

--
-- Estrutura da tabela `obras`
--

CREATE TABLE `obras` (
  `obra` varchar(255) NOT NULL,
  `lancamento` date DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `linguagem` varchar(255) DEFAULT NULL,
  `obraid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `obras`
--

INSERT INTO `obras` (`obra`, `lancamento`, `categoria`, `linguagem`, `obraid`) VALUES
('Bleach', '2020-12-31', 'Anime', 'en', 794004),
('Eu Matei Adam Sandler', '2022-08-10', 'filme', 'pt', 1012704),
('Farofa da GKay: O Documentário', '2022-03-25', 'Documentário', 'pt', 954293),
('Noite dos zumbis', '2013-10-08', 'filme', 'en', 219247),
('One Piece 3D2Y', '2014-12-31', 'filme', 'ja', 290271),
('Rin-Tin-Tin: Hero of the West', '1991-04-11', 'filme', 'en', 295919),
('Saneamento Básico: O Filme', '2007-07-20', 'filme', 'pt', 64397),
('Superman/Shazam!: O Retorno do Adão Negro', '2010-11-16', 'filme', 'en', 43641),
('Supernatural', '1933-04-21', 'Série', 'en', 109841),
('The Walking Dead', '1995-02-24', 'Série', 'en', 95963),
('ライブ・スペクタクル NARUTO -ナルト- 〜暁の調べ〜', '2021-01-07', 'Anime', 'ja', 784594);

-- --------------------------------------------------------

--
-- Estrutura da tabela `postagem`
--

CREATE TABLE `postagem` (
  `email` varchar(255) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `obra` varchar(255) DEFAULT NULL,
  `conteudo` varchar(2000) DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `bgimagem` varchar(255) DEFAULT NULL,
  `comentarios` int(11) DEFAULT NULL,
  `data` varchar(10) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `stars` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `postagem`
--

INSERT INTO `postagem` (`email`, `titulo`, `obra`, `conteudo`, `imagem`, `bgimagem`, `comentarios`, `data`, `id`, `stars`) VALUES
('thalistrisch.gr470@academico.ifsul.edu.br', 'one piece, bom demais', 'One Piece 3D2Y', 'conteudo', 'https://hospitalsantamonica.com.br/wp-content/uploads/2021/07/FILME-DE-TERROR-scaled.jpg', 'https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg', 3, '2023-01-09', 1, 3),
('thalistrisch.gr470@academico.ifsul.edu.br', 'Titulo', 'The Walking Dead', 'conteudisss', 'https://firebasestorage.googleapis.com/v0/b/criticandoproject.appspot.com/o/imagem%2F58530179215b68ee4a8f409add7eff88_4096x2730_520e651b.webp(22hour%3A0min%3A59sec_9%7C1%7C2023)?alt=media&token=bb99ff84-9d47-444e-9872-817b76566f29', 'https://firebasestorage.googleapis.com/v0/b/criticandoproject.appspot.com/o/background%2F20-curiosidades-incriveis-sobre-the-walking-dead-divulgacao.jpg(22hour%3A1min%3A20sec_9%7C1%7C2023)?alt=media&token=2c7a63ff-43ae-4b28-a55c-7e033745dde8', 5, '2023-01-09', 2, 5),
('thalistrisch.gr470@academico.ifsul.edu.br', 'Black Adam muito confuso', 'Superman/Shazam!: O Retorno do Adão Negro', 'conteudoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo', 'https://hospitalsantamonica.com.br/wp-content/uploads/2021/07/FILME-DE-TERROR-scaled.jpg', 'https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg', 0, '2023-01-20', 6, 1),
('thalistrisch.gr470@academico.ifsul.edu.br', 'title', 'Supernatural', 'conteudassssoooo', 'https://hospitalsantamonica.com.br/wp-content/uploads/2021/07/FILME-DE-TERROR-scaled.jpg', 'https://www.freecodecamp.org/news/content/images/2022/09/jonatan-pie-3l3RwQdHRHg-unsplash.jpg', 0, '2023-01-20', 7, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `postagemfavoritas`
--

CREATE TABLE `postagemfavoritas` (
  `email` varchar(255) DEFAULT NULL,
  `id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `postagemfavoritas`
--

INSERT INTO `postagemfavoritas` (`email`, `id`) VALUES
('thalistrisch.gr470@academico.ifsul.edu.br', 1),
('thalistrisch.gr470@academico.ifsul.edu.br', 2),
('thalis.trisch2003@gmail.com', 1),
('thalistrisch.gr470@academico.ifsul.edu.br', 7);

-- --------------------------------------------------------

--
-- Estrutura da tabela `postagemstars`
--

CREATE TABLE `postagemstars` (
  `email` varchar(255) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  `stars` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `postagemstars`
--

INSERT INTO `postagemstars` (`email`, `id`, `stars`) VALUES
('thalistrisch.gr470@academico.ifsul.edu.br', 1, 1),
('thalistrisch.gr470@academico.ifsul.edu.br', 2, 5),
('thalistrisch.gr470@academico.ifsul.edu.br', 6, 1),
('thalis.trisch2003@gmail.com', 1, 4);

-- --------------------------------------------------------

--
-- Estrutura da tabela `redessociais`
--

CREATE TABLE `redessociais` (
  `email` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `redessociais`
--

INSERT INTO `redessociais` (`email`, `instagram`, `facebook`, `twitter`) VALUES
('thalistrisch.gr470@academico.ifsul.edu.br', '3002_TTrisch', '3002ThalisFace', 'undefined'),
('thalis.trisch2003@gmail.com', '', '', '');

-- --------------------------------------------------------

--
-- Estrutura da tabela `seguidor`
--

CREATE TABLE `seguidor` (
  `email` varchar(255) DEFAULT NULL,
  `emailseguidor` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `teoria`
--

CREATE TABLE `teoria` (
  `titulo` varchar(255) DEFAULT NULL,
  `conteudo` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  `aprovada` int(11) DEFAULT NULL,
  `reprovada` int(11) DEFAULT NULL,
  `numero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `teoria`
--

INSERT INTO `teoria` (`titulo`, `conteudo`, `email`, `id`, `aprovada`, `reprovada`, `numero`) VALUES
('new teoria', 'conteudo', 'thalistrisch.gr470@academico.ifsul.edu.br', 2, 1, 0, 1),
('tituloooooooo', 'este é o conteudo tlgd', 'thalistrisch.gr470@academico.ifsul.edu.br', 1, 0, 0, 4),
('new teoria', 'será que essa teoria ficará boa?', 'thalistrisch.gr470@academico.ifsul.edu.br', 1, 0, 0, 5);

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE `usuario` (
  `nome` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `biografia` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `salateorias` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`nome`, `email`, `biografia`, `foto`, `salateorias`) VALUES
('Thalis T', 'thalis.trisch2003@gmail.com', 'Olá, sou novo na plataforma!', 'imagemusuariodefault.png', 'perguntar'),
('Thalis T.', 'thalistrisch.gr470@academico.ifsul.edu.br', 'bio do Thalis T', 'https://firebasestorage.googleapis.com/v0/b/criticandoproject.appspot.com/o/foto%2Fimages%20(10)%20(1).jpeg(17hour%3A5min%3A3sec_19%7C1%7C2023)?alt=media&token=9cba97a4-913e-4569-a657-21b51c57b9d3', 'perguntar');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `avaliacaoteoria`
--
ALTER TABLE `avaliacaoteoria`
  ADD KEY `fk_avaliacoesteoria_usuario` (`email`),
  ADD KEY `fk_avaliacoesteoria_teoria` (`numero`);

--
-- Índices para tabela `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`posicao`),
  ADD KEY `fk_comentario_postagem` (`id`),
  ADD KEY `fk_comentario_usuario` (`email`);

--
-- Índices para tabela `comentariocurtidas`
--
ALTER TABLE `comentariocurtidas`
  ADD KEY `fk_comentariocurtidas_comentario` (`posicao`),
  ADD KEY `fk_comentariocurtidas_usuario` (`email`);

--
-- Índices para tabela `genero`
--
ALTER TABLE `genero`
  ADD KEY `fk_genero_obras` (`obra`);

--
-- Índices para tabela `obras`
--
ALTER TABLE `obras`
  ADD PRIMARY KEY (`obra`);

--
-- Índices para tabela `postagem`
--
ALTER TABLE `postagem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_postagem_usuario` (`email`),
  ADD KEY `fk_postagem_obras` (`obra`);

--
-- Índices para tabela `postagemfavoritas`
--
ALTER TABLE `postagemfavoritas`
  ADD KEY `fk_favoritas_usuario` (`email`),
  ADD KEY `fk_favoritas_postagem` (`id`);

--
-- Índices para tabela `postagemstars`
--
ALTER TABLE `postagemstars`
  ADD KEY `fk_postagemstars_postagem` (`id`),
  ADD KEY `fk_postagemstars_usuario` (`email`);

--
-- Índices para tabela `redessociais`
--
ALTER TABLE `redessociais`
  ADD KEY `fk_redessociais_usuario` (`email`);

--
-- Índices para tabela `seguidor`
--
ALTER TABLE `seguidor`
  ADD KEY `fk_seguidor_usuario` (`email`);

--
-- Índices para tabela `teoria`
--
ALTER TABLE `teoria`
  ADD PRIMARY KEY (`numero`),
  ADD KEY `fk_teoria_usuario` (`email`),
  ADD KEY `fk_teoria_postagem` (`id`);

--
-- Índices para tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`email`);

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `fk_comentario_postagem` FOREIGN KEY (`id`) REFERENCES `postagem` (`id`),
  ADD CONSTRAINT `fk_comentario_usuario` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`);

--
-- Limitadores para a tabela `comentariocurtidas`
--
ALTER TABLE `comentariocurtidas`
  ADD CONSTRAINT `fk_comentariocurtidas_comentario` FOREIGN KEY (`posicao`) REFERENCES `comentario` (`posicao`),
  ADD CONSTRAINT `fk_comentariocurtidas_usuario` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`);

--
-- Limitadores para a tabela `genero`
--
ALTER TABLE `genero`
  ADD CONSTRAINT `fk_genero_obras` FOREIGN KEY (`obra`) REFERENCES `obras` (`obra`);

--
-- Limitadores para a tabela `postagem`
--
ALTER TABLE `postagem`
  ADD CONSTRAINT `fk_postagem_obras` FOREIGN KEY (`obra`) REFERENCES `obras` (`obra`),
  ADD CONSTRAINT `fk_postagem_usuario` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`);

--
-- Limitadores para a tabela `postagemfavoritas`
--
ALTER TABLE `postagemfavoritas`
  ADD CONSTRAINT `fk_favoritas_postagem` FOREIGN KEY (`id`) REFERENCES `postagem` (`id`),
  ADD CONSTRAINT `fk_favoritas_usuario` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`);

--
-- Limitadores para a tabela `postagemstars`
--
ALTER TABLE `postagemstars`
  ADD CONSTRAINT `fk_postagemstars_postagem` FOREIGN KEY (`id`) REFERENCES `postagem` (`id`),
  ADD CONSTRAINT `fk_postagemstars_usuario` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`);

--
-- Limitadores para a tabela `redessociais`
--
ALTER TABLE `redessociais`
  ADD CONSTRAINT `fk_redessociais_usuario` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`);

--
-- Limitadores para a tabela `seguidor`
--
ALTER TABLE `seguidor`
  ADD CONSTRAINT `fk_seguidor_usuario` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`);

--
-- Limitadores para a tabela `teoria`
--
ALTER TABLE `teoria`
  ADD CONSTRAINT `fk_teoria_postagem` FOREIGN KEY (`id`) REFERENCES `postagem` (`id`),
  ADD CONSTRAINT `fk_teoria_usuario` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
