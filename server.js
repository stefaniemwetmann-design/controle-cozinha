const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function lerArquivo(nome, padrao = []) {
  if (!fs.existsSync(nome)) {
    fs.writeFileSync(nome, JSON.stringify(padrao, null, 2));
  }
  return JSON.parse(fs.readFileSync(nome));
}

function salvarArquivo(nome, dados) {
  fs.writeFileSync(nome, JSON.stringify(dados, null, 2));
}

// REGISTROS
app.get("/api/registros", (req, res) => {
  res.json(lerArquivo("registros.json"));
});

app.post("/api/registros", (req, res) => {
  const registros = lerArquivo("registros.json");

  const novo = {
  id: Date.now(),
  data: req.body.data,
  setor: req.body.setor,
  tipo: req.body.tipo,
  responsavel: req.body.responsavel,
  categoria: req.body.categoria,
  produto: req.body.produto,
  quantidade: Number(req.body.quantidade),
  unidade: req.body.unidade,
  motivo: req.body.motivo,
  observacao: req.body.observacao
};

app.post("/api/registros/lote", (req, res) => {
  const registros = lerArquivo("registros.json");
  const novos = req.body.registros || [];

  novos.forEach(item => {
    registros.push({
      id: Date.now() + Math.floor(Math.random() * 10000),
      data: item.data,
      setor: item.setor,
      tipo: item.tipo,
      responsavel: item.responsavel,
      categoria: item.categoria,
      produto: item.produto,
      quantidade: Number(item.quantidade),
      unidade: item.unidade,
      motivo: item.motivo,
      insumoUtilizado: item.insumoUtilizado,
      observacao: item.observacao
    });
  });

  salvarArquivo("registros.json", registros);
  res.json({ sucesso: true });
});

  registros.push(novo);
  salvarArquivo("registros.json", registros);

  res.json({ sucesso: true });
});

app.post("/api/registros/lote", (req, res) => {
  const registros = lerArquivo("registros.json");
  const novos = req.body.registros || [];

  novos.forEach(item => {
    registros.push({
      id: Date.now() + Math.floor(Math.random() * 10000),
      data: item.data,
      setor: item.setor,
      tipo: item.tipo,
      responsavel: item.responsavel,
      categoria: item.categoria,
      produto: item.produto,
      quantidade: Number(item.quantidade),
      unidade: item.unidade,
      motivo: item.motivo,
      insumoUtilizado: item.insumoUtilizado,
      observacao: item.observacao
    });
  });

  salvarArquivo("registros.json", registros);
  res.json({ sucesso: true });
});

app.delete("/api/registros/:id", (req, res) => {
  let registros = lerArquivo("registros.json");
  registros = registros.filter(r => r.id != req.params.id);
  salvarArquivo("registros.json", registros);
  res.json({ sucesso: true });
});

// CADASTROS
function criarRotasCadastro(nomeRota, arquivo) {
  app.get(`/api/${nomeRota}`, (req, res) => {
    res.json(lerArquivo(arquivo));
  });

  app.post(`/api/${nomeRota}`, (req, res) => {
    const lista = lerArquivo(arquivo);

    const novo = {
      id: Date.now(),
      nome: req.body.nome
    };

    lista.push(novo);
    salvarArquivo(arquivo, lista);

    res.json({ sucesso: true });
  });

  app.put(`/api/${nomeRota}/:id`, (req, res) => {
    let lista = lerArquivo(arquivo);

    lista = lista.map(item => {
      if (item.id == req.params.id) {
        return {
          ...item,
          nome: req.body.nome
        };
      }
      return item;
    });

    salvarArquivo(arquivo, lista);
    res.json({ sucesso: true });
  });

  app.delete(`/api/${nomeRota}/:id`, (req, res) => {
    let lista = lerArquivo(arquivo);
    lista = lista.filter(item => item.id != req.params.id);
    salvarArquivo(arquivo, lista);

    res.json({ sucesso: true });
  });
}

criarRotasCadastro("pessoas", "pessoas.json");
app.get("/api/produtos", (req, res) => {
  res.json(lerArquivo("produtos.json"));
});

app.post("/api/produtos", (req, res) => {
  const lista = lerArquivo("produtos.json");

  const novo = {
    id: Date.now(),
    categoria: req.body.categoria || "",
    nome: req.body.nome,
    unidade: req.body.unidade || ""
  };

app.put("/api/produtos/:id", (req, res) => {
  let lista = lerArquivo("produtos.json");

  lista = lista.map(item => {
    if (item.id == req.params.id) {
      return {
        ...item,
        categoria: req.body.categoria || "",
        nome: req.body.nome,
        unidade: req.body.unidade || ""
      };
    }
    return item;
  });

  salvarArquivo("produtos.json", lista);
  res.json({ sucesso: true });
});

  lista.push(novo);
  salvarArquivo("produtos.json", lista);

  res.json({ sucesso: true });
});

app.post("/api/produtos/importar", (req, res) => {
  const produtosAtuais = lerArquivo("produtos.json");
  const novosProdutos = req.body.produtos || [];

  novosProdutos.forEach(p => {
    produtosAtuais.push({
      id: Date.now() + Math.floor(Math.random() * 10000),
      categoria: p.categoria || "",
      nome: p.produto || p.nome || "",
      unidade: p.unidade || ""
    });
  });

  salvarArquivo("produtos.json", produtosAtuais);
  res.json({ sucesso: true });
});

app.delete("/api/produtos/:id", (req, res) => {
  let lista = lerArquivo("produtos.json");
  lista = lista.filter(item => item.id != req.params.id);
  salvarArquivo("produtos.json", lista);

  res.json({ sucesso: true });
});
criarRotasCadastro("motivos", "motivos.json");
criarRotasCadastro("setores", "setores.json");

app.get("/api/relatorio", (req, res) => {
  let registros = lerArquivo("registros.json");

  const {
    dataInicio,
    dataFim,
    setor,
    categoria,
    produto,
    responsavel,
    motivo
  } = req.query;

  if (dataInicio) {
    registros = registros.filter(r => r.data >= dataInicio);
  }

  if (dataFim) {
    registros = registros.filter(r => r.data <= dataFim);
  }

  if (setor) {
    registros = registros.filter(r => r.setor === setor);
  }

  if (categoria) {
    registros = registros.filter(r => r.categoria === categoria);
  }

  if (produto) {
    registros = registros.filter(r => r.produto === produto);
  }

  if (responsavel) {
    registros = registros.filter(r => r.responsavel === responsavel);
  }

  if (motivo) {
    registros = registros.filter(r => r.motivo === motivo);
  }

  res.json(registros);
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Sistema rodando na porta ${PORT}`);
});