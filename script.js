function abrirMenu() {
  document.getElementById("menuLateral").classList.add("aberto");
  document.getElementById("fundoMenu").classList.add("ativo");
}

function fecharMenu() {
  document.getElementById("menuLateral").classList.remove("aberto");
  document.getElementById("fundoMenu").classList.remove("ativo");
}

function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(tela => tela.classList.add("escondida"));
  document.getElementById(id).classList.remove("escondida");
}

async function buscar(url) {
  const resposta = await fetch(url);
  return resposta.json();
}

let loteProducao = [];
let loteDesperdicio = [];

function preencherSelect(id, lista, textoInicial, campo = "nome") {
  const select = document.getElementById(id);
  if (!select) return;

  select.innerHTML = `<option value="">${textoInicial}</option>`;

  lista.forEach(item => {
    select.innerHTML += `<option value="${item[campo]}">${item[campo]}</option>`;
  });
}

async function carregarSelects() {
  const pessoas = await buscar("/api/pessoas");
  const produtos = await buscar("/api/produtos");
  const motivos = await buscar("/api/motivos");
  const setores = await buscar("/api/setores");

  preencherSelect("responsavelProducao", pessoas, "Selecione");
  preencherSelect("responsavelDesperdicio", pessoas, "Selecione");

  preencherSelect("produtoProducao", produtos, "Selecione");
  preencherSelect("produtoDesperdicio", produtos, "Selecione");

  preencherSelect("motivoDesperdicio", motivos, "Selecione");

  preencherSelect("setorProducao", setores, "Selecione");
  preencherSelect("setorDesperdicio", setores, "Selecione");

  preencherSelect("filtroResponsavel", pessoas, "Todos");
  preencherSelect("filtroProduto", produtos, "Todos");
  preencherSelect("filtroMotivo", motivos, "Todos");
  preencherSelect("filtroSetor", setores, "Todos");

  const categorias = [...new Set(produtos.map(p => p.categoria).filter(Boolean))]
    .map(categoria => ({ nome: categoria }));

  preencherSelect("filtroCategoria", categorias, "Todas");
}

async function carregarRegistros() {
  const registros = await buscar("/api/registros");
  const tabela = document.getElementById("tabelaRegistros");

  if (!tabela) return;

  tabela.innerHTML = "";

  registros.forEach(r => {
    tabela.innerHTML += `
      <tr>
        <td>${r.data}</td>
        <td>${r.setor || ""}</td>
        <td>${r.tipo}</td>
        <td>${r.responsavel}</td>
        <td>${r.produto}</td>
        <td>${r.quantidade} ${r.unidade}</td>
        <td>${r.tipo === "Produção" ? r.insumoUtilizado || "" : r.motivo || ""}</td>
        <td>${r.observacao || ""}</td>
        <td><button class="excluir" onclick="excluirRegistro(${r.id})">Excluir</button></td>
      </tr>
    `;
  });
}

async function adicionarItemProducao() {
  if (!dataProducao.value || !setorProducao.value || !responsavelProducao.value) {
    alert("Preencha data, setor e responsável primeiro.");
    return;
  }

  if (!produtoProducao.value || !quantidadeProducao.value) {
    alert("Selecione o produto produzido e informe a quantidade.");
    return;
  }

  const produtos = await buscar("/api/produtos");
  const produtoSelecionado = produtos.find(p => p.nome === produtoProducao.value);

  loteProducao.push({
    data: dataProducao.value,
    setor: setorProducao.value,
    tipo: "Produção",
    responsavel: responsavelProducao.value,
    categoria: produtoSelecionado ? produtoSelecionado.categoria : "",
    produto: produtoProducao.value,
    quantidade: quantidadeProducao.value,
    unidade: unidadeProducao.value,
    motivo: "",
    insumoUtilizado: insumoProducao.value,
    observacao: observacaoProducao.value
  });

  produtoProducao.value = "";
  quantidadeProducao.value = "";
  insumoProducao.value = "";
  observacaoProducao.value = "";

  atualizarTabelaProducao();
}

function atualizarTabelaProducao() {
  const tabela = document.getElementById("tabelaLoteProducao");
  if (!tabela) return;

  tabela.innerHTML = "";

  loteProducao.forEach((item, index) => {
    tabela.innerHTML += `
      <tr>
        <td>${item.produto}</td>
        <td>${item.quantidade} ${item.unidade}</td>
        <td>${item.insumoUtilizado || ""}</td>
        <td>${item.observacao || ""}</td>
        <td><button class="excluir" onclick="removerItemProducao(${index})">Remover</button></td>
      </tr>
    `;
  });
}

function removerItemProducao(index) {
  loteProducao.splice(index, 1);
  atualizarTabelaProducao();
}

document.getElementById("formProducao").addEventListener("submit", async e => {
  e.preventDefault();

  if (loteProducao.length === 0) {
    alert("Adicione pelo menos um produto no lote de produção.");
    return;
  }

  await fetch("/api/registros/lote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registros: loteProducao })
  });

  alert("Produção lançada com sucesso!");

  loteProducao = [];
  atualizarTabelaProducao();

  e.target.reset();
  carregarRegistros();
});

async function adicionarItemDesperdicio() {
  if (!dataDesperdicio.value || !setorDesperdicio.value || !responsavelDesperdicio.value) {
    alert("Preencha data, setor e responsável primeiro.");
    return;
  }

  if (!produtoDesperdicio.value || !quantidadeDesperdicio.value) {
    alert("Selecione o produto descartado e informe a quantidade.");
    return;
  }

  const produtos = await buscar("/api/produtos");
  const produtoSelecionado = produtos.find(p => p.nome === produtoDesperdicio.value);

  loteDesperdicio.push({
    data: dataDesperdicio.value,
    setor: setorDesperdicio.value,
    tipo: "Desperdício",
    responsavel: responsavelDesperdicio.value,
    categoria: produtoSelecionado ? produtoSelecionado.categoria : "",
    produto: produtoDesperdicio.value,
    quantidade: quantidadeDesperdicio.value,
    unidade: unidadeDesperdicio.value,
    motivo: motivoDesperdicio.value,
    insumoUtilizado: "",
    observacao: observacaoDesperdicio.value
  });

  produtoDesperdicio.value = "";
  quantidadeDesperdicio.value = "";
  motivoDesperdicio.value = "";
  observacaoDesperdicio.value = "";

  atualizarTabelaDesperdicio();
}

function atualizarTabelaDesperdicio() {
  const tabela = document.getElementById("tabelaLoteDesperdicio");
  if (!tabela) return;

  tabela.innerHTML = "";

  loteDesperdicio.forEach((item, index) => {
    tabela.innerHTML += `
      <tr>
        <td>${item.produto}</td>
        <td>${item.quantidade} ${item.unidade}</td>
        <td>${item.motivo || ""}</td>
        <td>${item.observacao || ""}</td>
        <td><button class="excluir" onclick="removerItemDesperdicio(${index})">Remover</button></td>
      </tr>
    `;
  });
}

function removerItemDesperdicio(index) {
  loteDesperdicio.splice(index, 1);
  atualizarTabelaDesperdicio();
}

document.getElementById("formDesperdicio").addEventListener("submit", async e => {
  e.preventDefault();

  if (loteDesperdicio.length === 0) {
    alert("Adicione pelo menos um produto no lote de desperdício.");
    return;
  }

  await fetch("/api/registros/lote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registros: loteDesperdicio })
  });

  alert("Desperdício lançado com sucesso!");

  loteDesperdicio = [];
  atualizarTabelaDesperdicio();

  e.target.reset();
  carregarRegistros();
});

async function excluirRegistro(id) {
  await fetch(`/api/registros/${id}`, { method: "DELETE" });
  carregarRegistros();
}

function configurarCadastro(formId, inputId, rota) {
  document.getElementById(formId).addEventListener("submit", async e => {
    e.preventDefault();

    const nome = document.getElementById(inputId).value;

    await fetch(`/api/${rota}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome })
    });

    e.target.reset();
    carregarCadastros();
    carregarSelects();
  });
}

async function editarCadastro(rota, id, nomeAtual) {
  const novoNome = prompt("Digite o novo nome:", nomeAtual);
  if (!novoNome || novoNome.trim() === "") return;

  await fetch(`/api/${rota}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: novoNome.trim() })
  });

  carregarCadastros();
  carregarSelects();
}

async function editarProduto(id, categoriaAtual, nomeAtual, unidadeAtual) {
  const novaCategoria = prompt("Categoria:", categoriaAtual || "");
  if (novaCategoria === null) return;

  const novoNome = prompt("Produto:", nomeAtual || "");
  if (!novoNome || novoNome.trim() === "") return;

  const novaUnidade = prompt("Unidade:", unidadeAtual || "");
  if (novaUnidade === null) return;

  await fetch(`/api/produtos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      categoria: novaCategoria.trim(),
      nome: novoNome.trim(),
      unidade: novaUnidade.trim()
    })
  });

  carregarCadastros();
  carregarSelects();
}

async function carregarLista(rota, listaId) {
  const dados = await buscar(`/api/${rota}`);
  const lista = document.getElementById(listaId);
  if (!lista) return;

  lista.innerHTML = "";

  dados.forEach(item => {
    if (rota === "produtos") {
      const categoria = item.categoria || "";
      const nome = item.nome || "";
      const unidade = item.unidade || "";

      lista.innerHTML += `
        <li>
          ${categoria || "Sem categoria"} - ${nome} - ${unidade}
          <button class="pequeno" onclick="editarProduto(${item.id}, '${categoria}', '${nome}', '${unidade}')">Editar</button>
          <button class="excluir pequeno" onclick="excluirCadastro('${rota}', ${item.id})">Excluir</button>
        </li>
      `;
    } else {
      lista.innerHTML += `
        <li>
          ${item.nome}
          <button class="pequeno" onclick="editarCadastro('${rota}', ${item.id}, '${item.nome}')">Editar</button>
          <button class="excluir pequeno" onclick="excluirCadastro('${rota}', ${item.id})">Excluir</button>
        </li>
      `;
    }
  });
}

async function excluirCadastro(rota, id) {
  await fetch(`/api/${rota}/${id}`, { method: "DELETE" });
  carregarCadastros();
  carregarSelects();
}

function carregarCadastros() {
  carregarLista("pessoas", "listaPessoas");
  carregarLista("produtos", "listaProdutos");
  carregarLista("motivos", "listaMotivos");
  carregarLista("setores", "listaSetores");
}

configurarCadastro("formPessoa", "nomePessoa", "pessoas");
configurarCadastro("formMotivo", "nomeMotivo", "motivos");
configurarCadastro("formSetor", "nomeSetor", "setores");

document.getElementById("formProduto").addEventListener("submit", async e => {
  e.preventDefault();

  const produto = {
    categoria: document.getElementById("categoriaProduto").value,
    nome: document.getElementById("nomeProduto").value,
    unidade: document.getElementById("unidadeProduto").value
  };

  await fetch("/api/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produto)
  });

  e.target.reset();
  carregarCadastros();
  carregarSelects();
});

async function importarProdutos() {
  const arquivo = document.getElementById("arquivoProdutos").files[0];

  if (!arquivo) {
    alert("Selecione uma planilha CSV.");
    return;
  }

  const texto = await arquivo.text();
  const linhas = texto.split("\n").filter(linha => linha.trim() !== "");

  const produtos = linhas.slice(1).map(linha => {
    const colunas = linha.split(",");

    return {
      categoria: colunas[0]?.trim(),
      produto: colunas[1]?.trim(),
      unidade: colunas[2]?.trim()
    };
  });

  await fetch("/api/produtos/importar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ produtos })
  });

  alert("Produtos importados com sucesso!");

  document.getElementById("arquivoProdutos").value = "";
  carregarCadastros();
  carregarSelects();
}

document.getElementById("formRelatorio").addEventListener("submit", async e => {
  e.preventDefault();

  const parametros = new URLSearchParams();

  if (filtroDataInicio.value) parametros.append("dataInicio", filtroDataInicio.value);
  if (filtroDataFim.value) parametros.append("dataFim", filtroDataFim.value);
  if (filtroSetor.value) parametros.append("setor", filtroSetor.value);
  if (filtroCategoria.value) parametros.append("categoria", filtroCategoria.value);
  if (filtroProduto.value) parametros.append("produto", filtroProduto.value);
  if (filtroResponsavel.value) parametros.append("responsavel", filtroResponsavel.value);
  if (filtroMotivo.value) parametros.append("motivo", filtroMotivo.value);

  const registros = await buscar(`/api/relatorio?${parametros.toString()}`);
  const tabela = document.getElementById("tabelaRelatorio");

  tabela.innerHTML = "";

  registros.forEach(r => {
    tabela.innerHTML += `
      <tr>
        <td>${r.data}</td>
        <td>${r.setor || ""}</td>
        <td>${r.tipo}</td>
        <td>${r.responsavel}</td>
        <td>${r.categoria || ""}</td>
        <td>${r.produto}</td>
        <td>${r.quantidade} ${r.unidade}</td>
        <td>${r.tipo === "Produção" ? r.insumoUtilizado || "" : r.motivo || ""}</td>
        <td>${r.observacao || ""}</td>
      </tr>
    `;
  });
});

function exportarRelatorioExcel() {
  const tabela = document.getElementById("tabelaRelatorio");

  if (!tabela || tabela.innerHTML.trim() === "") {
    alert("Gere um relatório antes de exportar.");
    return;
  }

  let csv = "Data;Setor;Tipo;Responsável;Categoria;Produto;Quantidade;Motivo/Insumo;Observação\n";

  tabela.querySelectorAll("tr").forEach(linha => {
    const colunas = linha.querySelectorAll("td");
    const dados = Array.from(colunas).map(td => {
      return `"${td.innerText.replace(/"/g, '""')}"`;
    });

    csv += dados.join(";") + "\n";
  });

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "relatorio-controle-cozinha.csv";
  link.click();
}

carregarSelects();
carregarRegistros();
carregarCadastros();