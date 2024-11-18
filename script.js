function atualizarDataHora() {
    const datetime = document.getElementById('datetime');
    datetime.innerHTML = new Date().toLocaleString();
}

setInterval(atualizarDataHora, 1000);

function registrarEntrada() {
    registrarPonto('Entrada');
}

function registrarSaida() {
    registrarPonto('Saída');
}

function registrarIntervalo() {
    registrarPonto('Intervalo');
}

function registrarRetorno() {
    registrarPonto('Retorno');
}

function registrarPonto(tipo) {
    const ponto = {
        data: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        tipo: tipo,
        editado: false,
        passado: false,
        justificativa: ''
    };
    salvarPonto(ponto);
}

function registrarPontoPassado() {
    const dataPassada = document.getElementById('data-passada').value;
    const horaPassada = document.getElementById('hora-passada').value;
    const tipoPassado = document.getElementById('tipo-passado').value;

    if (dataPassada && horaPassada && new Date(dataPassada) <= new Date()) {
        const ponto = {
            data: new Date(dataPassada).toLocaleDateString(),
            hora: horaPassada,
            tipo: tipoPassado,
            editado: false,
            passado: true,
            justificativa: ''
        };
        salvarPonto(ponto);
    } else {
        alert('Por favor, selecione uma data e hora válidas no passado.');
    }
}

function salvarPonto(ponto) {
    let pontos = JSON.parse(localStorage.getItem('pontos')) || [];
    pontos.push(ponto);
    localStorage.setItem('pontos', JSON.stringify(pontos));
    atualizarRelatorio();
}

function adicionarJustificativa() {
    const justificativa = document.getElementById('justificativa').value;
    const arquivo = document.getElementById('arquivo-justificativa').files[0];

    if (justificativa || arquivo) {
        const ponto = {
            data: new Date().toLocaleDateString(),
            hora: new Date().toLocaleTimeString(),
            tipo: 'Justificativa',
            editado: false,
            passado: false,
            justificativa: justificativa
        };

        if (arquivo) {
            ponto.justificativa += ` (Arquivo: ${arquivo.name})`;
        }

        salvarPonto(ponto);
    } else {
        alert('Preencha uma justificativa ou envie um arquivo.');
    }
}

function atualizarRelatorio() {
    const tabela = document.getElementById('tabela-relatorio');
    let pontos = JSON.parse(localStorage.getItem('pontos')) || [];
    let totalHoras = 0;

    tabela.innerHTML = `
        <tr>
            <th>Data</th>
            <th>Hora</th>
            <th>Tipo</th>
            <th>Justificativa</th>
            <th>Ações</th>
        </tr>
    `;

    pontos.forEach((ponto, index) => {
        let row = tabela.insertRow();
        row.insertCell(0).innerText = ponto.data;
        row.insertCell(1).innerText = ponto.hora;
        row.insertCell(2).innerText = ponto.tipo;
        row.insertCell(3).innerText = ponto.justificativa || '-';

        let acoesCell = row.insertCell(4);
        acoesCell.innerHTML = `
            <button onclick="editarPonto(${index})">Editar</button>
            <button onclick="excluirPonto(${index})">Excluir</button>
        `;

        if (ponto.editado) {
            row.classList.add('registro-editado');
        }

        if (ponto.passado) {
            row.classList.add('registro-passado');
        }

        totalHoras += calcularHorasTrabalhadas(ponto, index, pontos);
    });

    document.getElementById('total-horas').innerText = `Total de Horas Trabalhadas: ${totalHoras.toFixed(2)}h`;
}

function calcularHorasTrabalhadas(ponto, index, pontos) {
    if (ponto.tipo.includes('Saída') && index > 0) {
        let entradaAnterior = pontos[index - 1];
        if (entradaAnterior.tipo.includes('Entrada')) {
            let horaEntrada = new Date(`01/01/2000 ${entradaAnterior.hora}`);
            let horaSaida = new Date(`01/01/2000 ${ponto.hora}`);
            let diferencaHoras = (horaSaida - horaEntrada) / (1000 * 60 * 60);
            return diferencaHoras > 0 ? diferencaHoras : 0;
        }
    }
    return 0;
}

function editarPonto(index) {
    let pontos = JSON.parse(localStorage.getItem('pontos')) || [];
    let ponto = pontos[index];
    ponto.editado = true;
    ponto.tipo = prompt("Editar Tipo de Ponto:", ponto.tipo) || ponto.tipo;
    localStorage.setItem('pontos', JSON.stringify(pontos));
    atualizarRelatorio();
}

function excluirPonto(index) {
    let pontos = JSON.parse(localStorage.getItem('pontos')) || [];
    pontos.splice(index, 1);
    localStorage.setItem('pontos', JSON.stringify(pontos));
    atualizarRelatorio();
}

function filtrarUltimaSemana() {
    filtrarPorPeriodo(7);
}

function filtrarUltimoMes() {
    filtrarPorPeriodo(30);
}

function filtrarPorPeriodo(dias) {
    const tabela = document.getElementById('tabela-relatorio');
    let pontos = JSON.parse(localStorage.getItem('pontos')) || [];
    const hoje = new Date();

    pontos = pontos.filter(ponto => {
        const dataPonto = new Date(ponto.data.split('/').reverse().join('-'));
        const diferencaDias = Math.floor((hoje - dataPonto) / (1000 * 60 * 60 * 24));
        return diferencaDias <= dias;
    });

    tabela.innerHTML = `
        <tr>
            <th>Data</th>
            <th>Hora</th>
            <th>Tipo</th>
            <th>Justificativa</th>
            <th>Ações</th>
        </tr>
    `;

    pontos.forEach((ponto, index) => {
        let row = tabela.insertRow();
        row.insertCell(0).innerText = ponto.data;
        row.insertCell(1).innerText = ponto.hora;
        row.insertCell(2).innerText = ponto.tipo;
        row.insertCell(3).innerText = ponto.justificativa || '-';
        row.insertCell(4).innerHTML = `
            <button onclick="editarPonto(${index})">Editar</button>
            <button onclick="excluirPonto(${index})">Excluir</button>
        `;
    });
}

atualizarRelatorio();
