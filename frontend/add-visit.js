document.addEventListener("DOMContentLoaded", function() {
  changeContent("add");
  loadUserList();
});

const rowsPerPage = 10; // Número de linhas por página
let currentPage = 1;
let userData = [];

function changeContent(page) {
  let contentArea = document.getElementById("content-area");

  if (page === "add") {
    contentArea.innerHTML = `
      <div class="form-container">
        <form id="formVisita">
          <div class="form-group">
            <label for="nome">Nome/Razão Social:</label>
            <input type="text" id="nome" name="nome" required>
          </div>
          
          <div class="form-group">
            <label for="tipo_empresa">Tipo de Empresa:</label>
            <select id="tipo_empresa" name="tipo_empresa" required>
              <option value="">Selecione</option>
              <option value="pessoa_fisica">Pessoa Física</option>
              <option value="empresa_revendedora">Empresa Revendedora</option>
              <option value="empresa_cliente_final">Empresa Cliente Final</option>
            </select>
          </div>

          <div class="form-group">
            <label for="tipo_cliente">Tipo de Cliente:</label>
            <select id="tipo_cliente" name="tipo_cliente" required>
              <option value="">Selecione</option>
              <option value="potencial_baixo">Potencial Baixo</option>
              <option value="potencial_medio">Potencial Médio</option>
              <option value="potencial_alto">Potencial Alto</option>
              <option value="inviavel">Inválido</option>
            </select>
          </div>

          <div class="form-group">
            <label for="tipo_pneu">Tipo de Pneu:</label>
            <select id="tipo_pneu" name="tipo_pneu" required>
              <option value="">Selecione</option>
              <option value="linha_leve">Linha Leve</option>
              <option value="carga">Carga</option>
              <option value="agricola">Agrícola</option>
            </select>
          </div>

          <div class="form-group">
            <label for="quantidade_pneu">Quantidade de Pneu:</label>
            <input type="number" id="quantidade_pneu" name="quantidade_pneu" required>
          </div>

          <div class="form-group">
            <label for="preco_oferecido">Preço Oferecido:</label>
            <input type="number" id="preco_oferecido" name="preco_oferecido" step="0.01" required>
          </div>

          <div class="form-group">
            <label for="hora_data">Hora/Data:</label>
            <input type="datetime-local" id="hora_data" name="hora_data" required>
          </div>

          <div class="form-group">
            <label for="observacoes">Observações:</label>
            <textarea id="observacoes" name="observacoes" rows="4"></textarea>
          </div>

          <div class="form-group">
            <button type="submit">Adicionar Visita</button>
            <button type="submit" class="secondary-button">Registro de Negócio</button>
          </div>
        </form>
      </div>
    `;

    const form = document.getElementById("formVisita");
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      // Capturando os valores dos campos
      const nome = document.getElementById("nome").value;
      const tipo_empresa = document.getElementById("tipo_empresa").value;
      const tipo_cliente = document.getElementById("tipo_cliente").value;
      const tipo_pneu = document.getElementById("tipo_pneu").value;
      const quantidade_pneu = document.getElementById("quantidade_pneu").value;
      const preco_oferecido = document.getElementById("preco_oferecido").value;
      const hora_data = document.getElementById("hora_data").value;
      const observacoes = document.getElementById("observacoes").value;

      const visitaData = {
        nome: nome,
        tipo_empresa: tipo_empresa,
        tipo_cliente: tipo_cliente,
        tipo_pneu: tipo_pneu,
        quantidade_pneu: parseInt(quantidade_pneu),
        preco_oferecido: parseFloat(preco_oferecido),
        hora_data: hora_data,
        observacoes: observacoes
      };

      fetch('http://127.0.0.1:5000/visitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitaData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Sucesso:', data);
        alert("Visita adicionada com sucesso!");
        form.reset();
        loadUserList();
      })
      .catch((error) => {
        console.error('Erro:', error);
        alert("Erro ao adicionar visita.");
      });
    });
  } else if (page === "list") {
    loadUserList();
  }
}

function loadUserList() {
  fetch('http://127.0.0.1:5000/visitas') // Ajuste o URL para o endpoint correto
    .then(response => response.json())
    .then(data => {
      userData = data;
      renderTable(currentPage);
      renderPagination();
    })
    .catch(error => {
      console.error('Erro ao carregar a lista de usuários:', error);
      const contentArea = document.getElementById("content-area");
      contentArea.innerHTML = "<p>Erro ao carregar a lista de usuários.</p>";
    });
}

function renderTable(page) {
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = userData.slice(start, end);

  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Nome/Razão Social</th>
          <th>Tipo de Empresa</th>
          <th>Tipo de Cliente</th>
          <th>Tipo de Pneu</th>
          <th>Quantidade de Pneu</th>
          <th>Preço Oferecido</th>
          <th>Hora/Data</th>
          <th>Observações</th>
        </tr>
      </thead>
      <tbody>
        ${paginatedData.map(user => `
          <tr>
            <td>${user.nome}</td>
            <td>${user.tipo_empresa}</td>
            <td>${user.tipo_cliente}</td>
            <td>${user.tipo_pneu}</td>
            <td>${user.quantidade_pneu}</td>
            <td>${user.preco_oferecido}</td>
            <td>${user.hora_data}</td>
            <td>${user.observacoes}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  document.getElementById("content-area").innerHTML = tableHTML;
}

function renderPagination() {
  const numPages = Math.ceil(userData.length / rowsPerPage);
  let paginationHTML = `<div class="pagination">`;

  if (currentPage > 1) {
    paginationHTML += `<button onclick="changePage(${currentPage - 1})">Anterior</button>`;
  } else {
    paginationHTML += `<button disabled>Anterior</button>`;
  }

  paginationHTML += `<span>Página ${currentPage} de ${numPages}</span>`;

  if (currentPage < numPages) {
    paginationHTML += `<button onclick="changePage(${currentPage + 1})">Próxima</button>`;
  } else {
    paginationHTML += `<button disabled>Próxima</button>`;
  }

  paginationHTML += `</div>`;
  document.getElementById("content-area").innerHTML += paginationHTML;
}

function changePage(page) {
  currentPage = page;
  renderTable(currentPage);
  renderPagination();
}