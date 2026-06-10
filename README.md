# 🍳 Controle de Cozinha

Sistema web completo para controle de desperdício e produção em cozinhas profissionais.

## 📋 Funcionalidades

✅ **Registro de Desperdício**
- Selecione o tipo de desperdício (queimado, vencido, danificado, etc.)
- Informe o funcionário responsável
- Registre a quantidade e data
- Adicione observações

✅ **Registro de Produção**
- Quantidade utilizada (kg/L)
- Quantidade produzida (porções/unidades)
- Funcionário responsável
- Data do registro
- Observações adicionais

✅ **Gerenciamento de Funcionários**
- Lista pré-carregada de funcionários
- Adicione novos funcionários dinamicamente
- Persistência de dados

✅ **Filtros e Busca**
- Filtrar por tipo (desperdício/produção)
- Buscar por funcionário
- Histórico completo de registros

✅ **Relatórios**
- Total de desperdícios
- Total de produções
- Quantidade total desperdiçada
- Quantidade total produzida
- Análise de motivos mais frequentes
- Funcionários mais ativos

✅ **Backend API**
- CRUD completo de registros
- Armazenamento em arquivo JSON
- Exportação em CSV
- Relatórios detalhados

## 🚀 Como Usar

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/stefaniemwetmann-design/controle-cozinha.git
cd controle-cozinha
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

4. Acesse no navegador:
```
http://localhost:3000
```

### Desenvolvimento

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
controle-cozinha/
├── index.html          # Interface principal
├── style.css           # Estilização
├── script.js           # Lógica do frontend
├── server.js           # Backend Node.js
├── package.json        # Dependências
├── dados.json          # Armazenamento de dados
└── README.md           # Este arquivo
```

## 🔌 Endpoints da API

### Registros

- `GET /api/registros` - Obter todos os registros
- `POST /api/registros` - Criar novo registro
- `GET /api/registros/:id` - Obter registro específico
- `PUT /api/registros/:id` - Atualizar registro
- `DELETE /api/registros/:id` - Deletar registro

### Relatórios

- `GET /api/relatorio` - Gerar relatório completo
- `GET /api/exportar/csv` - Exportar dados em CSV

## 📊 Exemplo de Registro

### Desperdício
```json
{
  "id": 1234567890,
  "tipo": "desperdicio",
  "funcionario": "Maria Santos",
  "motivo": "queimado",
  "quantidade": 2.5,
  "descricao": "Arroz ficou queimado na panela",
  "data": "2026-06-10",
  "dataCriacao": "2026-06-10T14:30:00.000Z"
}
```

### Produção
```json
{
  "id": 1234567891,
  "tipo": "producao",
  "funcionario": "João Silva",
  "utilizado": 10.5,
  "produzido": 150,
  "quantidade": 150,
  "descricao": "Produção da tarde",
  "data": "2026-06-10",
  "dataCriacao": "2026-06-10T15:45:00.000Z"
}
```

## 💾 Persistência de Dados

Os dados são armazenados de duas formas:

1. **LocalStorage** - Dados locais no navegador (para uso offline)
2. **Server (JSON)** - Dados no servidor (compartilhado entre usuários)

A sincronização ocorre automaticamente a cada 30 segundos.

## 🎨 Personalizações

### Adicionar mais tipos de desperdício
Edite em `index.html`:
```html
<option value="novo-motivo">Novo Motivo</option>
```

### Adicionar mais funcionários pré-carregados
Edite em `script.js`:
```javascript
let funcionarios = ['João Silva', 'Maria Santos', ...];
```

### Mudar cores
Edite as variáveis em `style.css`:
```css
--cor-primaria: #FF6B6B;
--cor-secundaria: #4ECDC4;
```

## 📱 Responsivo

O site é totalmente responsivo e funciona em:
- 🖥️ Desktop
- 📱 Tablets
- 📲 Smartphones

## 🔒 Segurança

Para produção, considere adicionar:
- Autenticação de usuários
- Validação mais rigorosa de dados
- HTTPS
- Rate limiting
- Backup automático

## 📝 Licença

MIT License - Veja LICENSE para detalhes

## 👤 Autor

Desenvolvido por **Stephanie Wetmann**

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

⭐ Se este projeto ajudou você, não esqueça de dar uma estrela!