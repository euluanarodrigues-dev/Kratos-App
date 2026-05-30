// Aguarda a página carregar completamente
document.addEventListener("DOMContentLoaded", function() {
    
    // Pegar o botão de agendamento através do texto dele ou tags
    const botaoAgendar = document.querySelector("button[type='submit']");
    
    // Ficar atento para quando o cliente clicar no botão
    botaoAgendar.addEventListener("click", function(event) {
        event.preventDefault(); // Evita que a página recarregue do nada

        // 1. Capturar os dados que o cliente escolheu/digitou
        const barbeiroSelecionado = document.querySelector("select").value;
        
        // Pega o serviço que foi marcado (radio button)
        const servicoMarcado = document.querySelector("input[name='servico']:checked");
        const dataSelecionada = document.getElementById("data").value;
        const horaSelecionada = document.getElementById("hora").value;
        
        // Pega o Nome e o WhatsApp (são os dois inputs de texto no final)
        const inputsTexto = document.querySelectorAll("input[type='text'], input[type='tel']");
        const nomeCliente = inputsTexto[0].value;
        const whatsappCliente = inputsTexto[1].value;

        // 2. Validação simples: Não deixar agendar se faltar alguma informação
        if (!servicoMarcado) {
            alert("Por favor, selecione um serviço!");
            return;
        }
        if (!dataSelecionada || !nomeCliente || !whatsappCliente) {
            alert("Por favor, preencha todos os campos do formulário!");
            return;
        }

        // 3. Organizar os dados em um "objeto" de agendamento
        const novoAgendamento = {
            barbeiro: barbeiroSelecionado,
            servico: servicoMarcado.value,
            data: dataSelecionada,
            hora: horaSelecionada,
            cliente: nomeCliente,
            whatsapp: whatsappCliente
        };

        // 4. Salvar no localStorage (Mini banco de dados do navegador)
        // Pegamos o que já tem lá, se não tiver nada, criamos uma lista vazia []
        let agendamentosSalvos = JSON.parse(localStorage.getItem("agendamentos")) || [];
        
        // Adicionamos o novo agendamento na lista
        agendamentosSalvos.push(novoAgendamento);
        
        // Salvamos de volta no navegador transformando em texto
        localStorage.setItem("agendamentos", JSON.stringify(agendamentosSalvos));

        // 5. Sucesso!
        alert(`Sucesso! Horário agendado para ${nomeCliente} no dia ${dataSelecionada} às ${horaSelecionada}.`);

        // Limpar os campos de texto após agendar
        inputsTexto[0].value = "";
        inputsTexto[1].value = "";
    });
});