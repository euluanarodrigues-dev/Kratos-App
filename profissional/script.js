document.addEventListener("DOMContentLoaded", function() {
    const corpoTabela = document.getElementById("tabela-agendamentos");
    const formularioManual = document.querySelector("form");

    // ==========================================
    // 1. FUNÇÃO PARA CARREGAR E EXIBIR A AGENDA
    // ==========================================
    function carregarAgenda() {
        let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

        corpoTabela.innerHTML = "";

        if (agendamentos.length === 0) {
            corpoTabela.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #A0A0A0;">Nenhum agendamento encontrado na memória.</td></tr>`;
            return;
        }

        // Organizar por data e hora (Ordem cronológica)
        agendamentos.sort((a, b) => a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora));

        agendamentos.forEach((agendamento, index) => {
            const linha = document.createElement("tr");

            let servicoFormatado = agendamento.servico;
            if(servicoFormatado === "corte") servicoFormatado = "Corte de Cabelo";
            if(servicoFormatado === "barba") servicoFormatado = "Barba Completa";
            if(servicoFormatado === "combo") servicoFormatado = "Combo Kratos";

            // Formatar data para o padrão brasileiro (DD/MM/AAAA)
            const dataOriginal = agendamento.data.split("-");
            const dataFormatada = `${dataOriginal[2]}/${dataOriginal[1]}/${dataOriginal[0]}`;

            linha.innerHTML = `
                <td>${dataFormatada}</td>
                <td>${agendamento.hora}</td>
                <td>${agendamento.cliente}</td>
                <td>${agendamento.barbeiro ? agendamento.barbeiro.replace("barbeiro", "Barbeiro ") : "Barbeiro 1"}</td>
                <td>${servicoFormatado}</td>
                <td>
                    <button class="btn-concluir" onclick="removerAgendamento(${index})">Concluir</button>
                    <button class="btn-cancelar" onclick="removerAgendamento(${index})">Cancelar</button>
                </td>
            `;

            corpoTabela.appendChild(linha);
        });
    }

    // ==========================================
    // 2. LÓGICA DO FORMULÁRIO DE AGENDAMENTO MANUAL
    // ==========================================
    formularioManual.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que a página recarregue

        // Capturar os dados digitados pelo barbeiro
        const nomeManual = formularioManual.querySelector("input[placeholder='Nome do Cliente']").value;
        const whatsManual = formularioManual.querySelector("input[placeholder='WhatsApp do Cliente']").value;
        const servicoManual = formularioManual.querySelector("select").value;
        const dataManual = formularioManual.querySelector("input[type='date']").value;
        const horaManual = formularioManual.querySelector("input[type='time']").value;

        // Validação rápida
        if (!dataManual || !horaManual || !nomeManual) {
            alert("Por favor, preencha o nome, data e horário para o agendamento manual!");
            return;
        }

        // Criar o objeto do agendamento (por padrão colocamos para o Barbeiro 1, ou o principal do dia)
        const novoAgendamentoManual = {
            barbeiro: "barbeiro1", 
            servico: servicoManual,
            data: dataManual,
            hora: horaManual,
            cliente: nomeManual,
            whatsapp: whatsManual
        };

        // Salvar no localStorage junto com os outros
        let agendamentosSalvos = JSON.parse(localStorage.getItem("agendamentos")) || [];
        agendamentosSalvos.push(novoAgendamentoManual);
        localStorage.setItem("agendamentos", JSON.stringify(agendamentosSalvos));

        alert(`Agendamento manual de ${nomeManual} salvo com sucesso!`);

        // Limpar o formulário e recarregar a tabela na hora
        formularioManual.reset();
        carregarAgenda();
    });

    // ==========================================
    // 3. FUNÇÃO PARA CONCLUIR/CANCELAR
    // ==========================================
    window.removerAgendamento = function(index) {
        let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
        agendamentos.splice(index, 1);
        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
        carregarAgenda();
    };

    // Inicializa a tabela assim que abre a página
    carregarAgenda();
});
