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

function editarPonto(index) {
    let pontos = JSON.parse(localStorage.getItem('pontos')) || [];
    let ponto = pontos[index];

    const novoTipo = prompt("Digite o novo tipo de ponto (Entrada, Saída, Intervalo, Retorno):", ponto.tipo);
    if (!['Entrada', 'Saída', 'Intervalo', 'Retorno'].includes(novoTipo)) {
        alert("Tipo inválido! Use apenas: Entrada, Saída, Intervalo, ou Retorno.");
        return;
    }

    const novaData = prompt("Digite a nova data (dd/mm/aaaa):", ponto.data);
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(novaData)) {
        alert("Data inválida! Use o formato dd/mm/aaaa.");
        return;
    }

    const novaHora = prompt("Digite a nova hora (hh:mm):", ponto.hora);
    if (!/^\d{2}:\d{2}$/.test(novaHora)) {
        alert("Hora inválida! Use o formato hh:mm.");
        return;
    }

    ponto.tipo = novoTipo;
    ponto.data = novaData;
    ponto.hora = novaHora;
    ponto.editado = true;

    localStorage.setItem('pontos', JSON.stringify(pontos));
    atualizarRelatorio();
}

function excluirPonto(index) {
    let pontos = JSON.parse(localStorage.getItem('pontos')) || [];
    pontos.splice(index, 1);
    localStorage.setItem('pontos', JSON.stringify(pontos));
    atualizarRelatorio();
}

function atualizarRelatorio() {
    const tabela = document.querySelector("#tabela-relatorio tbody");
    let pontos = JSON.parse(localStorage.getItem('pontos')) || [];
    let totalHoras = 0;

    tabela.innerHTML = "";

    pontos.forEach((ponto, index) => {
        const row = tabela.insertRow();
        row.insertCell(0).innerText = ponto.data;
        row.insertCell(1).innerText = ponto.hora;
        row.insertCell(2).innerText = ponto.tipo;
        row.insertCell(3).innerText = ponto.justificativa || '-';
        const actionsCell = row.insertCell(4);

        actionsCell.innerHTML = `
            <button onclick="editarPonto(${index})">Editar</button>
            <button onclick="excluirPonto(${index})">Excluir</button>
        `;

        if (ponto.editado) {
            row.classList.add('registro-editado');
        }

        if (ponto.passado) {
            row.classList.add('registro-passado');
        }
    });

    totalHoras = calcularTotalHorasTrabalhadas(pontos);
    document.getElementById('total-horas').innerText = `Total de Horas Trabalhadas: ${totalHoras.toFixed(2)}h`;
}

function calcularTotalHorasTrabalhadas(pontos) {
    let totalHoras = 0;
    let horaEntrada = null;

    pontos.forEach((ponto) => {
        if (ponto.tipo === 'Entrada') {
            horaEntrada = new Date(`01/01/2000 ${ponto.hora}`);
        } else if (ponto.tipo === 'Saída' && horaEntrada) {
            const horaSaida = new Date(`01/01/2000 ${ponto.hora}`);
            const diferencaHoras = (horaSaida - horaEntrada) / (1000 * 60 * 60);
            if (diferencaHoras > 0) {
                totalHoras += diferencaHoras;
            }
            horaEntrada = null;
        }
    });

    return totalHoras;
}

atualizarRelatorio();
