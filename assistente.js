document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const elements = {
        btn: document.getElementById('assistente-btn'),
        chatBox: document.getElementById('chat-box'),
        messages: document.getElementById('chat-messages'),
        quickActions: document.getElementById('quick-actions'),
        moreOptions: document.getElementById('more-options'),
        input: document.getElementById('mensagem-input'),
        sendBtn: document.getElementById('enviar-btn'),
        closeBtn: document.getElementById('fechar-btn'),
        mouth: document.getElementById('boca'),
        eyes: document.querySelectorAll('.olho'),
        clickSound: document.getElementById('som-clique'),
        notificationSound: document.getElementById('som-notificacao'),
        nameInputContainer: document.getElementById('name-input-container'),
        nameInput: document.getElementById('name-input'),
        confirmNameBtn: document.getElementById('confirm-name-btn')
    };

    // Configurações da clínica
    const config = {
        clinica: {
            nome: "Beleza Perfeita Estética",
            telefone: "(11) 9999-8888",
            whatsapp: "5511999998888",
            endereco: "Av. da Beleza, 150 - Jardim Estético, São Paulo/SP",
            horario: "Segunda a Sábado, das 9h às 20h",
            email: "contato@clinicabeleza.com.br",
            site: "https://www.clinicabeleza.com.br",
            horariosDisponiveis: {
                seg: ['09:00', '11:00', '14:00', '16:00', '18:00'],
                ter: ['09:30', '11:30', '14:30', '16:30'],
                qua: ['10:00', '12:00', '15:00', '17:00'],
                qui: ['09:00', '11:00', '14:00', '16:00', '18:00'],
                sex: ['09:30', '11:30', '14:30', '16:30'],
                sab: ['10:00', '12:00']
            },
            tempoConsulta: 60, // minutos
            tratamentos: {
                "Limpeza de Pele Profissional": 250,
                "Botox Facial": 600,
                "Preenchimento Labial": 800,
                "Drenagem Linfática": 180,
                "Depilação a Laser": 350
            },
            googleCalendar: {
                apiKey: 'SUA_CHAVE_API',
                calendarId: 'ID_DO_CALENDARIO@group.calendar.google.com',
                timeZone: 'America/Sao_Paulo'
            },
            emailService: {
                apiUrl: 'https://api.emailservice.com/send',
                apiKey: 'SUA_CHAVE_API_EMAIL'
            },
            whatsappReminder: {
                apiUrl: 'https://api.whatsappservice.com/send',
                apiKey: 'SUA_CHAVE_API_WHATSAPP'
            },
            paymentGateway: {
                apiKey: 'SUA_CHAVE_API_PAGAMENTO',
                checkoutUrl: 'https://api.paymentgateway.com/checkout'
            }
        }
    };

    // Mapeamento de ícones para ações rápidas
    const iconMap = {
        "Agendar Consulta": "calendar-alt",
        "Nossos Tratamentos": "spa",
        "Promoções": "gift",
        "Falar com Especialista": "user-md",
        "Localização": "map-marker-alt",
        "Formas de Pagamento": "credit-card",
        "Nossa Equipe": "users",
        "WhatsApp": "whatsapp",
        "Telefone": "phone",
        "Email": "envelope",
        "Ver Horários": "clock",
        "Como chegar?": "directions",
        "Fotos da Clínica": "camera",
        "Rotas": "route",
        "Cartão Fidelidade": "id-card",
        "Indique Amigos": "user-plus",
        "Compromisso de Qualidade": "medal",
        "Limpeza de Pele": "spa",
        "Botox Facial": "syringe",
        "Preenchimento Labial": "lips",
        "Drenagem Linfática": "massage",
        "Depilação a Laser": "fire",
        "Pagar com Pix": "qrcode",
        "Pagar com Cartão": "credit-card",
        "Pagar na Clínica": "money-bill-wave",
        "Novo Agendamento": "calendar-plus",
        "Enviar para meu email": "envelope",
        "Compartilhar": "share",
        "Confirmar Agendamento": "check-circle",
        "Alterar Data/Horário": "calendar-edit",
        "Cancelar": "times-circle"
    };

    // Base de conhecimento do assistente
    const knowledgeBase = {
        saudacao: {
            getMessage: (userName) => {
                const greeting = getGreetingByTime();
                let message = `${greeting}${userName ? `, ${userName}` : ''}! 😊 Como posso te ajudar hoje?`;
                
                const lastVisit = localStorage.getItem('lastVisit');
                if (lastVisit) {
                    const daysDiff = Math.floor((new Date() - new Date(lastVisit)) / (1000 * 60 * 60 * 24));
                    if (daysDiff > 1) {
                        message = `${greeting}${userName ? `, ${userName}` : ''}! 😊 Faz ${daysDiff} dias que não nos falamos! Como posso te ajudar?`;
                    }
                }
                
                return message;
            },
            options: [
                "Agendar Consulta",
                "Nossos Tratamentos", 
                "Promoções",
                "Falar com Especialista"
            ],
            moreOptions: [
                "Localização",
                "Nossa Equipe",
                "Formas de Pagamento"
            ]
        },
        tratamentos: {
            message: `
                <div class="tratamento-card">
                    <h4> Nossos Tratamentos Estéticos</h4>
                    <div class="tratamento-item">
                        <span>Limpeza de Pele Profissional</span>
                        <strong>R$ 250</strong>
                    </div>
                    <div class="tratamento-item">
                        <span>Botox Facial</span>
                        <strong>R$ 600/área</strong>
                    </div>
                    <div class="tratamento-item">
                        <span>Preenchimento Labial</span>
                        <strong>A partir de R$ 800</strong>
                    </div>
                </div>
            `,
            options: [
                "Detalhes Limpeza",
                "Detalhes Preenchimento", 
                "Detalhes Botox"
            ],
            moreOptions: [
                "Lipo Enzimática",
                "Drenagem Linfática",
                "Depilação a Laser"
            ]
        },
        promocoes: {
            message: `
                <div class="promo-card">
                    <h4> Promoções Exclusivas</h4>
                    <p><span class="promo-tag">NOVOS CLIENTES</span> 1ª Sessão com <strong>30% OFF</strong></p>
                    <p><span class="promo-tag">PACOTE</span> 5 Sessões de Lipo por <strong>R$ 1.400</strong></p>
                    <p><span class="promo-tag">INDICAÇÃO</span> Indique 3 amigos e ganhe <strong>1 sessão grátis</strong></p>
                </div>
            `,
            options: [
                "Quero esta Promoção",
                "Agendar Avaliação", 
                "Compartilhar"
            ],
            moreOptions: [
                "Ver Parcelamento",
                "Cartão Presente",
                "Programa de Indicação"
            ]
        },
        agendamento: {
            iniciar: {
                message: (userName) => `Vamos agendar sua consulta, ${userName || ''}! Primeiro, para qual tratamento você gostaria de agendar?`,
                options: ["Limpeza de Pele", "Botox Facial", "Preenchimento Labial"],
                moreOptions: ["Drenagem Linfática", "Depilação a Laser", "Outro tratamento"]
            },
            confirmacao: (agendamento) => ({
                message: `
                    <div class="agendamento-card">
                        <h4>📅 Confirmação de Agendamento</h4>
                        <p><strong>Tratamento:</strong> ${agendamento.tratamento}</p>
                        <p><strong>Data:</strong> ${agendamento.data} às ${agendamento.horario}</p>
                        <p><strong>Duração:</strong> ${config.clinica.tempoConsulta} minutos</p>
                        <p>Por favor, confirme se está tudo correto:</p>
                    </div>
                `,
                options: ["Confirmar Agendamento", "Alterar Data/Horário", "Cancelar"]
            })
        }
    };

    // Estado do agendamento
    let agendamentoEmAndamento = null;

    // Inicializa o assistente
    function init() {
        setupEventListeners();
        if (elements.chatBox.classList.contains('ativo')) {
            startConversation();
        }
    }

    // Configura os ouvintes de eventos
    function setupEventListeners() {
        elements.btn.addEventListener('click', toggleChat);
        elements.btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                toggleChat();
            }
        });
        
        elements.closeBtn.addEventListener('click', closeChat);
        elements.closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                closeChat();
            }
        });
        
        elements.sendBtn.addEventListener('click', sendMessage);
        elements.sendBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                sendMessage();
            }
        });
        
        elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
        
        elements.confirmNameBtn.addEventListener('click', confirmName);
        elements.confirmNameBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                confirmName();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            elements.eyes.forEach(eye => {
                const rect = eye.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width/2;
                const y = e.clientY - rect.top - rect.height/2;
                const angle = Math.atan2(y, x);
                eye.style.transform = `translate(${Math.cos(angle)*2}px, ${Math.sin(angle)*2}px)`;
            });
        });
    }

    // Função para obter a saudação com base no horário atual
    function getGreetingByTime() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }

    // Função para alternar o chat
    function toggleChat() {
        playSound('click');
        elements.chatBox.classList.toggle('ativo');
        if (elements.chatBox.classList.contains('ativo') && elements.messages.children.length === 0) {
            startConversation();
        }
    }

    // Função para fechar o chat
    function closeChat() {
        playSound('click');
        elements.chatBox.classList.remove('ativo');
    }

    // Inicia a conversa com o usuário
    function startConversation() {
        const userName = localStorage.getItem('userName');
        const lastVisit = localStorage.getItem('lastVisit');
        
        if (!userName) {
            elements.nameInputContainer.style.display = 'flex';
        } else {
            continueConversation(userName);
        }
        
        localStorage.setItem('lastVisit', new Date());
    }

    // Função para confirmar o nome do usuário
    function confirmName() {
        const name = elements.nameInput.value.trim();
        if (name) {
            localStorage.setItem('userName', name);
            elements.nameInputContainer.style.display = 'none';
            continueConversation(name);
        }
    }

    // Continua a conversa com uma saudação personalizada
    function continueConversation(userName) {
        const greeting = getGreetingByTime();
        const welcomeMessage = `${greeting}, ${userName}! 😊 ${localStorage.getItem('lastVisit') ? 'Que bom te ver de novo!' : 'É um prazer te conhecer!'} Como posso te ajudar hoje?`;
        
        showMessage(welcomeMessage, 'assistente');
        showQuickActions(knowledgeBase.saudacao.options);
        showMoreOptions(knowledgeBase.saudacao.moreOptions);
    }

    // Cria um botão de ação rápida com ícone e texto
    function createButton(text) {
        const btn = document.createElement('button');
        btn.className = 'acao-rapida';
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('role', 'button');
        
        // Adiciona classe especial para botões de pagamento
        if (text.includes("Pagar com")) {
            btn.classList.add(text.toLowerCase().replace(' ', '-'));
        }
        
        if (iconMap[text]) {
            btn.innerHTML = `<i class="fas fa-${iconMap[text]}" aria-hidden="true"></i> ${text}`;
        } else {
            btn.textContent = text;
        }
        return btn;
    }

    // Exibe uma mensagem na tela
    function showMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `mensagem mensagem-${sender}`;
        text.includes('<') ? msgDiv.innerHTML = text : msgDiv.textContent = text;
        elements.messages.appendChild(msgDiv);
        
        if (sender === 'assistente') {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'feedback-container';
            feedbackDiv.innerHTML = `
                <button class="feedback-btn" aria-label="Esta mensagem foi útil" tabindex="0" role="button">👍</button>
                <button class="feedback-btn" aria-label="Esta mensagem não foi útil" tabindex="0" role="button">👎</button>
                <span class="feedback-text">Isso ajudou?</span>
            `;
            
            feedbackDiv.querySelectorAll('.feedback-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const wasHelpful = e.target.textContent === '👍';
                    trackFeedback(wasHelpful, text);
                    e.target.style.transform = 'scale(1.5)';
                    setTimeout(() => {
                        feedbackDiv.style.opacity = '0';
                    }, 1000);
                });
                
                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        const wasHelpful = e.target.textContent === '👍';
                        trackFeedback(wasHelpful, text);
                        e.target.style.transform = 'scale(1.5)';
                        setTimeout(() => {
                            feedbackDiv.style.opacity = '0';
                        }, 1000);
                    }
                });
            });
            
            elements.messages.appendChild(feedbackDiv);
        }
        
        scrollToBottom();
        if (sender === 'assistente') {
            playSound('notification');
            animateMouth(text.length);
        }
    }

    // Função para rastrear feedback do usuário
    function trackFeedback(wasHelpful, message) {
        const feedbacks = JSON.parse(localStorage.getItem('chatFeedbacks') || '[]');
        feedbacks.push({
            message,
            helpful: wasHelpful,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('chatFeedbacks', JSON.stringify(feedbacks));
    }

    // Exibe as ações rápidas na parte inferior do chat
    function showQuickActions(actions) {
        elements.quickActions.innerHTML = '';
        if (!actions || actions.length === 0) return;
        actions.forEach(action => {
            const btn = createButton(action);
            btn.addEventListener('click', () => {
                playSound('click');
                processInput(action);
            });
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    playSound('click');
                    processInput(action);
                }
            });
            elements.quickActions.appendChild(btn);
        });
    }

    // Exibe mais opções de interação
    function showMoreOptions(options) {
        elements.moreOptions.innerHTML = '';
        if (!options || options.length === 0) {
            elements.moreOptions.style.display = 'none';
            return;
        }
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'more-options-btn';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-down" aria-hidden="true"></i> Mais opções';
        toggleBtn.setAttribute('tabindex', '0');
        toggleBtn.setAttribute('role', 'button');
        toggleBtn.setAttribute('aria-expanded', 'false');
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'more-options-content';
        
        options.forEach(option => {
            const btn = createButton(option);
            btn.addEventListener('click', () => {
                playSound('click');
                processInput(option);
            });
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    playSound('click');
                    processInput(option);
                }
            });
            contentDiv.appendChild(btn);
        });
        
        toggleBtn.addEventListener('click', () => {
            playSound('click');
            const isExpanded = contentDiv.style.display === 'flex';
            contentDiv.style.display = isExpanded ? 'none' : 'flex';
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            toggleBtn.innerHTML = isExpanded 
                ? '<i class="fas fa-chevron-down" aria-hidden="true"></i> Mais opções' 
                : '<i class="fas fa-chevron-up" aria-hidden="true"></i> Menos opções';
        });
        
        toggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                playSound('click');
                const isExpanded = contentDiv.style.display === 'flex';
                contentDiv.style.display = isExpanded ? 'none' : 'flex';
                toggleBtn.setAttribute('aria-expanded', !isExpanded);
                toggleBtn.innerHTML = isExpanded 
                    ? '<i class="fas fa-chevron-down" aria-hidden="true"></i> Mais opções' 
                    : '<i class="fas fa-chevron-up" aria-hidden="true"></i> Menos opções';
            }
        });
        
        elements.moreOptions.appendChild(toggleBtn);
        elements.moreOptions.appendChild(contentDiv);
        elements.moreOptions.style.display = 'block';
    }

    // Processa a entrada do usuário
    function processInput(input) {
        showMessage(input, 'usuario');
        showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            
            // Verifica se está em processo de agendamento
            if (agendamentoEmAndamento) {
                if (agendamentoEmAndamento.etapa === 'selecionarData') {
                    selecionarData(input);
                    return;
                }
                if (agendamentoEmAndamento.etapa === 'selecionarHorario') {
                    selecionarHorario(input);
                    return;
                }
                if (agendamentoEmAndamento.etapa === 'confirmacao' && input === 'Confirmar Agendamento') {
                    confirmarAgendamento();
                    return;
                }
            }
            
            const userName = localStorage.getItem('userName');
            const response = generateResponse(input, userName);
            
            // Se a resposta for uma função, chama-a passando o nome do usuário
            let message = response.message;
            if (typeof message === 'function') {
                message = message(userName);
            }
            
            if (message) showMessage(message, 'assistente');
            showQuickActions(response.options || []);
            showMoreOptions(response.moreOptions || []);
        }, 1000 + Math.random() * 1000);
    }

    // Gera a resposta do assistente com base na entrada do usuário
    function generateResponse(input, userName) {
        const inputLower = input.toLowerCase();
        
        if (/oi|olá|ola|bom dia|boa tarde|boa noite/.test(inputLower)) {
            return {
                message: knowledgeBase.saudacao.getMessage(userName),
                options: knowledgeBase.saudacao.options,
                moreOptions: knowledgeBase.saudacao.moreOptions
            };
        }
        
        if (/tratamento|procedimento|serviço|limpeza|botox|preenchimento/.test(inputLower)) {
            return knowledgeBase.tratamentos;
        }
        
        if (/promo|desconto|oferta|cupom|indicação/.test(inputLower)) {
            return knowledgeBase.promocoes;
        }
        
        if (/agenda|marcar|consulta|horário|agendar/.test(inputLower)) {
            return knowledgeBase.agendamento.iniciar;
        }
        
        if (/limpeza de pele|limpeza/.test(inputLower)) {
            iniciarAgendamento("Limpeza de Pele Profissional");
            return { message: "" };
        }
        
        if (/botox|toxina botulínica/.test(inputLower)) {
            iniciarAgendamento("Botox Facial");
            return { message: "" };
        }
        
        if (/preenchimento|labial|lábios/.test(inputLower)) {
            iniciarAgendamento("Preenchimento Labial");
            return { message: "" };
        }
        
        if (/drenagem|linfática/.test(inputLower)) {
            iniciarAgendamento("Drenagem Linfática");
            return { message: "" };
        }
        
        if (/depilação|laser/.test(inputLower)) {
            iniciarAgendamento("Depilação a Laser");
            return { message: "" };
        }
        
        if (/local|onde fica|endereço|chegar|mapa/.test(inputLower)) {
            return {
                message: ` <strong>Localização:</strong><br><br>${config.clinica.endereco}<br><strong>Horário:</strong> ${config.clinica.horario}<br><br><a href="https://maps.google.com?q=${encodeURIComponent(config.clinica.endereco)}" target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>`,
                options: ["Rotas", "Horários", "Fotos da Clínica"]
            };
        }
        
        return {
            message: "Hmm, não entendi. Poderia escolher uma das opções abaixo?",
            options: ["Agendar Consulta", "Nossos Tratamentos", "Promoções"],
            moreOptions: ["Localização", "Nossa Equipe", "Formas de Pagamento"]
        };
    }

    // Exibe o indicador de digitação do assistente
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'mensagem mensagem-assistente';
        typingDiv.id = 'typing-indicator';
        typingDiv.textContent = '...';
        elements.messages.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    function scrollToBottom() {
        elements.messages.scrollTop = elements.messages.scrollHeight;
    }

    function playSound(type) {
        const sound = type === 'click' ? elements.clickSound : elements.notificationSound;
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Erro ao reproduzir som:", e));
    }

    function animateMouth(length) {
        const duration = Math.min(10, Math.floor(length / 5));
        let frame = 0;
        
        function animate() {
            if (frame < duration) {
                elements.mouth.style.height = (frame % 2 === 0) ? '4px' : '8px';
                elements.mouth.style.width = (frame % 2 === 0) ? '15px' : '20px';
                frame++;
                setTimeout(animate, 150);
            } else {
                elements.mouth.style.height = '8px';
                elements.mouth.style.width = '20px';
            }
        }
        animate();
    }

    // Envia a mensagem quando o usuário clica no botão ou pressiona Enter
    function sendMessage() {
        const message = elements.input.value.trim();
        if (message) {
            processInput(message);
            elements.input.value = '';
        }
    }

    // Funções para o sistema de agendamento
    function iniciarAgendamento(tratamento) {
        agendamentoEmAndamento = {
            tratamento,
            etapa: 'selecionarData'
        };
        
        const hoje = new Date();
        const opcoesData = gerarOpcoesData(hoje, 14); // Próximas 2 semanas
        
        showMessage(`Para ${tratamento}, selecione uma data:`, 'assistente');
        showQuickActions(opcoesData.map(data => formatarData(data)));
    }

    function selecionarData(data) {
        agendamentoEmAndamento.data = data;
        agendamentoEmAndamento.etapa = 'selecionarHorario';
        
        const diaSemana = new Date(data).toLocaleDateString('pt-BR', { weekday: 'short' }).toLowerCase().substring(0, 3);
        const horarios = config.clinica.horariosDisponiveis[diaSemana] || [];
        
        showMessage(`Horários disponíveis para ${formatarData(data)}:`, 'assistente');
        showQuickActions(horarios);
    }

    function selecionarHorario(horario) {
        agendamentoEmAndamento.horario = horario;
        agendamentoEmAndamento.etapa = 'confirmacao';
        
        const resposta = knowledgeBase.agendamento.confirmacao(agendamentoEmAndamento);
        showMessage(resposta.message, 'assistente');
        showQuickActions(resposta.options);
    }

    async function confirmarAgendamento() {
        // Coleta informações adicionais
        const telefone = prompt('Por favor, informe seu telefone para contato:');
        const email = prompt('Informe seu email para enviarmos a confirmação:');
        
        if (!telefone || !email) {
            showMessage('❌ É necessário informar telefone e email para confirmar o agendamento.', 'assistente');
            return;
        }

        agendamentoEmAndamento.telefone = telefone;
        agendamentoEmAndamento.email = email;
        agendamentoEmAndamento.codigo = gerarCodigoAgendamento();

        // Mostra mensagem de processamento
        showMessage('<div class="loader"></div><p>Processando seu agendamento...</p>', 'assistente');

        // Simula processamento
        setTimeout(async () => {
            // Integração com Google Calendar
            const googleCalendarLink = await adicionarAoGoogleCalendar(agendamentoEmAndamento);

            // Envio de email
            await enviarEmailConfirmacao(agendamentoEmAndamento, googleCalendarLink);

            // Agendar lembrete
            await agendarLembreteWhatsApp(agendamentoEmAndamento);

            // Salva localmente
            localStorage.setItem('ultimoAgendamento', JSON.stringify(agendamentoEmAndamento));

            // Remove mensagem de processamento
            elements.messages.removeChild(elements.messages.lastChild);

            // Feedback para o usuário
            showMessage(`
                ✅ Agendamento confirmado! 
                <p>Detalhes enviados para: ${agendamentoEmAndamento.email}</p>
                ${googleCalendarLink ? `<p><a href="${googleCalendarLink}" target="_blank">Adicionar ao Google Calendar</a></p>` : ''}
            `, 'assistente');

            // Mostra comprovante
            showMessage(`
                <div class="comprovante">
                    <h4>📋 Comprovante de Agendamento</h4>
                    <p><strong>Código:</strong> ${agendamentoEmAndamento.codigo}</p>
                    <p><strong>Tratamento:</strong> ${agendamentoEmAndamento.tratamento}</p>
                    <p><strong>Data:</strong> ${formatarData(agendamentoEmAndamento.data)} às ${agendamentoEmAndamento.horario}</p>
                    <p><strong>Clínica:</strong> ${config.clinica.nome}</p>
                    <p><strong>Endereço:</strong> ${config.clinica.endereco}</p>
                    <p><strong>Telefone:</strong> ${config.clinica.telefone}</p>
                </div>
            `, 'assistente');

            showQuickActions(["Novo Agendamento", "Reenviar Confirmação", "Compartilhar"]);
            agendamentoEmAndamento = null;
        }, 2000);
    }

    // Funções utilitárias para agendamento
    function gerarOpcoesData(dataInicio, dias) {
        const opcoes = [];
        for (let i = 0; i < dias; i++) {
            const data = new Date(dataInicio);
            data.setDate(data.getDate() + i);
            opcoes.push(data);
        }
        return opcoes;
    }

    function formatarData(data) {
        if (typeof data === 'string') data = new Date(data);
        return data.toLocaleDateString('pt-BR', { 
            weekday: 'short', 
            day: '2-digit', 
            month: 'short' 
        }).replace('.', '');
    }

    function gerarCodigoAgendamento() {
        return 'AG-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    // Funções de integração
    async function adicionarAoGoogleCalendar(agendamento) {
        try {
            const evento = {
                summary: `Consulta: ${agendamento.tratamento}`,
                location: config.clinica.endereco,
                description: `Cliente: ${localStorage.getItem('userName') || 'Novo Cliente'}\nTelefone: ${agendamento.telefone || ''}`,
                start: {
                    dateTime: `${agendamento.data}T${agendamento.horario}:00-03:00`,
                    timeZone: config.clinica.googleCalendar.timeZone
                },
                end: {
                    dateTime: `${agendamento.data}T${adicionarMinutos(agendamento.horario, config.clinica.tempoConsulta)}:00-03:00`,
                    timeZone: config.clinica.googleCalendar.timeZone
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'popup', minutes: 1440 } // 24h antes
                    ]
                }
            };

            const response = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.clinica.googleCalendar.calendarId)}/events?key=${config.clinica.googleCalendar.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(evento)
                }
            );

            const data = await response.json();
            return data.htmlLink; // Retorna o link do evento
        } catch (error) {
            console.error('Erro ao adicionar ao Google Calendar:', error);
            return null;
        }
    }

    async function enviarEmailConfirmacao(agendamento, googleCalendarLink) {
        try {
            const response = await fetch(config.clinica.emailService.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.clinica.emailService.apiKey}`
                },
                body: JSON.stringify({
                    to: agendamento.email,
                    subject: `Confirmação de Agendamento - ${config.clinica.nome}`,
                    html: `
                        <h2>Consulta Agendada com Sucesso!</h2>
                        <p><strong>Tratamento:</strong> ${agendamento.tratamento}</p>
                        <p><strong>Data:</strong> ${formatarData(agendamento.data)} às ${agendamento.horario}</p>
                        <p><strong>Duração:</strong> ${config.clinica.tempoConsulta} minutos</p>
                        <p><strong>Local:</strong> ${config.clinica.endereco}</p>
                        ${googleCalendarLink ? `<p><a href="${googleCalendarLink}">Adicionar ao Google Calendar</a></p>` : ''}
                        <p>Código de confirmação: <strong>${agendamento.codigo}</strong></p>
                        <p>Em caso de dúvidas, entre em contato: ${config.clinica.telefone}</p>
                    `
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return null;
        }
    }

    async function agendarLembreteWhatsApp(agendamento) {
        try {
            const dataEvento = new Date(`${agendamento.data}T${agendamento.horario}:00`);
            dataEvento.setHours(dataEvento.getHours() - 24); // 24h antes
            
            const response = await fetch(config.clinica.whatsappReminder.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.clinica.whatsappReminder.apiKey}`
                },
                body: JSON.stringify({
                    to: agendamento.telefone,
                    message: `📅 Lembrete de Consulta\n\nOlá! Este é um lembrete para sua consulta de ${agendamento.tratamento} amanhã às ${agendamento.horario}.\n\nLocal: ${config.clinica.endereco}\nCódigo: ${agendamento.codigo}\n\nPara reagendar: ${config.clinica.whatsapp}`,
                    schedule: dataEvento.toISOString()
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Erro ao agendar lembrete:', error);
            return null;
        }
    }

    function adicionarMinutos(horario, minutos) {
        const [hora, min] = horario.split(':').map(Number);
        const date = new Date();
        date.setHours(hora, min + minutos, 0, 0);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    // Inicia o assistente
    init();
});