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
    if (['Entrada', 'Saída', 'Intervalo', 'Retorno'].includes(novoTipo)) {
        ponto.tipo = novoTipo;
    } else {
        alert('Tipo inválido!');
        return;
    }

    const novaData = prompt("Digite a nova data (dd/mm/aaaa):", ponto.data);
    const novaHora = prompt("Digite a nova hora (hh:mm):", ponto.hora);

    if (novaData && novaHora) {
        ponto.data = novaData;
        ponto.hora = novaHora;
        ponto.editado = true;
    } else {
        alert("Data ou Hora inválidas!");
        return;
    }

    localStorage.setItem('pontos', JSON.stringify(pontos));
    atualizarRelatorio();
}

// Outras funções como calcularHorasTrabalhadas e atualizarRelatorio permanecem iguais...
