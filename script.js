// ===== MOBILE TOGGLE =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

// ===== HEADER SCROLL =====
const header = document.getElementById('header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                entry.target.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    entry.target.textContent = target + (target === 98 || target === 99 ? '%' : '+');
                }
            }

            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FAQ TOGGLE =====
function toggleFaq(element) {
    element.classList.toggle('active');
    const answer = element.nextElementSibling;
    if (answer) {
        if (element.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 50 + 'px';
            answer.style.paddingTop = '16px';
            answer.style.paddingBottom = '20px';
            answer.style.opacity = '1';
        } else {
            answer.style.maxHeight = '0';
            answer.style.paddingTop = '0';
            answer.style.paddingBottom = '0';
            answer.style.opacity = '0';
        }
    }
}

// ===== FAQ ACCORDION - CORRIGIDO =====
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todas as perguntas do FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    
    faqQuestions.forEach((question) => {
        // Remove o onclick do HTML para evitar conflitos
        question.removeAttribute('onclick');
        
        // Adiciona event listener
        question.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const currentQuestion = this;
            const currentAnswer = currentQuestion.nextElementSibling;
            
            // Fecha todas as outras perguntas (comportamento de acordeão)
            faqQuestions.forEach(other => {
                if (other !== currentQuestion && other.classList.contains('active')) {
                    other.classList.remove('active');
                    const otherAnswer = other.nextElementSibling;
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.paddingTop = '0';
                        otherAnswer.style.paddingBottom = '0';
                        otherAnswer.style.opacity = '0';
                    }
                }
            });
            
            // Toggle da pergunta clicada
            currentQuestion.classList.toggle('active');
            
            if (currentQuestion.classList.contains('active')) {
                // Abre a resposta com animação
                const height = currentAnswer.scrollHeight;
                currentAnswer.style.maxHeight = height + 50 + 'px';
                currentAnswer.style.paddingTop = '16px';
                currentAnswer.style.paddingBottom = '20px';
                currentAnswer.style.opacity = '1';
            } else {
                // Fecha a resposta
                currentAnswer.style.maxHeight = '0';
                currentAnswer.style.paddingTop = '0';
                currentAnswer.style.paddingBottom = '0';
                currentAnswer.style.opacity = '0';
            }
        });
    });
});

// ===== ANIMAÇÃO DO GRÁFICO DO DASHBOARD =====
const dashboardChart = document.querySelector('.db-chart');

if (dashboardChart) {
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.bar');
                bars.forEach((bar, index) => {
                    const height = bar.style.height;
                    bar.style.height = '4px';
                    setTimeout(() => {
                        bar.style.height = height;
                    }, 150 + (index * 60));
                });
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    chartObserver.observe(dashboardChart);
}

// ===== LIGHTBOX FUNCTIONS =====

/**
 * Abre a imagem em tamanho ampliado (Lightbox)
 * @param {HTMLElement} element - O elemento .testimonial-image clicado
 */
function openLightbox(element) {
    const img = element.querySelector('img');
    const overlay = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    
    if (img && overlay) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Depoimento ampliado';
        
        const card = element.closest('.testimonial-card');
        const author = card ? card.querySelector('.author .info strong') : null;
        const company = card ? card.querySelector('.author .info span') : null;
        
        if (author && company) {
            caption.innerHTML = `<strong>${author.textContent}</strong> — ${company.textContent}`;
        } else {
            caption.textContent = 'Depoimento de cliente';
        }
        
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Fecha o lightbox
 * @param {Event} event - O evento de clique
 */
function closeLightbox(event) {
    const overlay = document.getElementById('lightbox');
    if (event.target === overlay || event.target.closest('.lightbox-close') || event.target.closest('.lightbox-overlay')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Fecha o lightbox com a tecla ESC
 */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const overlay = document.getElementById('lightbox');
        if (overlay && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ===== FORMULÁRIO DE CONTATO VIA WHATSAPP =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome')?.value?.trim() || '';
        const email = document.getElementById('email')?.value?.trim() || '';
        const telefone = document.getElementById('telefone')?.value?.trim() || '';
        const produto = document.getElementById('produto')?.value || '';
        const assunto = document.getElementById('assunto')?.value || '';
        const mensagem = document.getElementById('mensagem')?.value?.trim() || '';

        if (!nome || !email || !produto || !assunto || !mensagem) {
            alert('⚠️ Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            alert('⚠️ Por favor, insira um e-mail válido.');
            return;
        }

        const msg = 
            '🆕 *Novo contato via site SoftPower*%0A%0A' +
            '👤 *Nome:* ' + encodeURIComponent(nome) + '%0A' +
            '📧 *E-mail:* ' + encodeURIComponent(email) + '%0A' +
            (telefone ? '📱 *Telefone:* ' + encodeURIComponent(telefone) + '%0A' : '') +
            '📌 *Produto:* ' + encodeURIComponent(produto) + '%0A' +
            '📌 *Assunto:* ' + encodeURIComponent(assunto) + '%0A%0A' +
            '📝 *Mensagem:*%0A' + encodeURIComponent(mensagem) + '%0A%0A' +
            '---%0A' +
            '📅 ' + new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR');

        window.open('https://wa.me/5583981011900?text=' + msg, '_blank');
        alert('✅ Você será redirecionado para o WhatsApp para enviar sua mensagem.');
    });
}

// ===== MÁSCARA PARA TELEFONE =====
const telefoneInput = document.getElementById('telefone');

if (telefoneInput) {
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length <= 10) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
        
        e.target.value = value;
    });
}

// ===== MODAL DE CADASTRO (para a landing page) =====
function openModal() {
    const modal = document.getElementById('modalCadastro');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const logoPreview = document.getElementById('logoPreview');
        const logomarcaInput = document.getElementById('logomarcaInput');
        if (logoPreview) logoPreview.style.display = 'none';
        if (logomarcaInput) logomarcaInput.value = '';
    }
}

function closeModal() {
    const modal = document.getElementById('modalCadastro');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

window.openModal = openModal;
window.closeModal = closeModal;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.toggleFaq = toggleFaq;

const modal = document.getElementById('modalCadastro');
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ===== PREVIEW DA LOGOMARCA =====
const logomarcaInput = document.getElementById('logomarcaInput');
const logoPreview = document.getElementById('logoPreview');
const logoPreviewImg = document.getElementById('logoPreviewImg');

if (logomarcaInput) {
    logomarcaInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                alert('⚠️ Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG)');
                this.value = '';
                logoPreview.style.display = 'none';
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                alert('⚠️ A imagem deve ter no máximo 2MB');
                this.value = '';
                logoPreview.style.display = 'none';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                logoPreviewImg.src = event.target.result;
                logoPreview.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        } else {
            logoPreview.style.display = 'none';
            logoPreviewImg.src = '';
        }
    });
}

// ===== CONTROLE DE HORÁRIOS DE FUNCIONAMENTO =====
function setupHorarios() {
    const fechadoCheckboxes = document.querySelectorAll('.fechado-checkbox');
    
    fechadoCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const diaHorario = this.closest('.dia-horario');
            const timeInputs = diaHorario.querySelectorAll('input[type="time"]');
            
            if (this.checked) {
                timeInputs.forEach(input => {
                    input.disabled = true;
                    input.value = '';
                });
            } else {
                timeInputs.forEach(input => {
                    input.disabled = false;
                });
            }
        });
    });
}

// ===== VALIDAÇÃO DE HORÁRIOS =====
function validarHorarios() {
    const dias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
    let erros = [];
    let peloMenosUmHorario = false;
    
    for (let dia of dias) {
        const fechadoCheckbox = document.querySelector(`input[name="${dia}_fechado"]`);
        const abertura = document.querySelector(`input[name="horario_${dia}_abertura"]`);
        const fechamento = document.querySelector(`input[name="horario_${dia}_fechamento"]`);
        
        if (fechadoCheckbox && !fechadoCheckbox.checked) {
            if ((abertura?.value && !fechamento?.value) || (!abertura?.value && fechamento?.value)) {
                erros.push(`⚠️ Preencha ambos os horários para ${getNomeDia(dia)} ou marque como fechado`);
            }
            
            if (abertura?.value && fechamento?.value) {
                peloMenosUmHorario = true;
                if (abertura.value >= fechamento.value) {
                    erros.push(`⚠️ Horário de abertura deve ser menor que fechamento para ${getNomeDia(dia)}`);
                }
            }
        } else if (fechadoCheckbox && fechadoCheckbox.checked) {
            // Dia fechado, não precisa de horários
        } else {
            if (abertura?.value && fechamento?.value) {
                peloMenosUmHorario = true;
            }
        }
    }
    
    if (!peloMenosUmHorario) {
        erros.push('⚠️ Informe pelo menos um dia e horário de funcionamento');
    }
    
    if (erros.length > 0) {
        alert(erros.join('\n'));
        return false;
    }
    return true;
}

function getNomeDia(dia) {
    const diasMap = {
        'seg': 'Segunda-feira',
        'ter': 'Terça-feira',
        'qua': 'Quarta-feira',
        'qui': 'Quinta-feira',
        'sex': 'Sexta-feira',
        'sab': 'Sábado',
        'dom': 'Domingo'
    };
    return diasMap[dia] || dia;
}

// ===== CENTRAL DE AJUDA =====

// ==================== BUSCAR ARTIGOS ====================
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const artigosCards = document.querySelectorAll('.artigo-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            artigosCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const text = card.querySelector('p')?.textContent.toLowerCase() || '';
                if (title.includes(searchTerm) || text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ==================== FILTRO POR CATEGORIA ====================
    const categoriaCards = document.querySelectorAll('.categoria-card');
    categoriaCards.forEach(cat => {
        cat.addEventListener('click', () => {
            const category = cat.getAttribute('data-category');
            artigosCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === cardCategory) {
                    card.style.display = 'block';
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    card.style.display = 'none';
                }
            });
            if (searchInput) searchInput.value = '';
        });
    });

    // ==================== ARTIGOS MODAL ====================
    const artigos = {
        'como-criar-conta': {
            titulo: 'Como criar sua conta',
            conteudo: `
                <h4 style="color:#2199EF; margin:20px 0 10px;">Passo 1: Acesse o site</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Acesse o site oficial e clique em "Teste Grátis" ou "Começar Agora".</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Passo 2: Preencha seus dados</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Informe seu nome completo, e-mail e WhatsApp. Escolha a quantidade de barbeiros e como conheceu o sistema.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Passo 3: Confirme seu e-mail</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Você receberá um e-mail de confirmação. Clique no link para ativar sua conta.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Dicas importantes:</h4>
                <ul style="color:#cbd5e1; padding-left:20px; margin-bottom:15px;">
                    <li style="margin-bottom:8px;">Use um e-mail válido que você tenha acesso</li>
                    <li style="margin-bottom:8px;">Salve sua senha em local seguro</li>
                    <li style="margin-bottom:8px;">Em caso de dúvidas, entre em contato com nosso suporte</li>
                </ul>
            `
        },
        'configurar-barbearia': {
            titulo: 'Configurando sua barbearia',
            conteudo: `
                <h4 style="color:#2199EF; margin:20px 0 10px;">Cadastrar Serviços</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Acesse o módulo "Serviços" e clique em "Novo Serviço". Informe nome, descrição, preço e duração.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Cadastrar Produtos</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">No módulo "Produtos", cadastre os itens que você vende, com nome, preço e quantidade em estoque.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Cadastrar Profissionais</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">No módulo "Equipes", adicione os profissionais com nome, especialidade e comissão.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Configurar Horários</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Defina os horários de funcionamento e os horários disponíveis para agendamento.</p>
            `
        },
        'gerenciar-agendamentos': {
            titulo: 'Gerenciar agendamentos',
            conteudo: `
                <h4 style="color:#2199EF; margin:20px 0 10px;">Criar um agendamento</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">No módulo Agenda, clique em um horário vago ou no botão "Novo Agendamento". Preencha os dados do cliente, serviço e profissional.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Editar um agendamento</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Clique no agendamento desejado e edite as informações necessárias. Clique em "Salvar" para confirmar.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Cancelar um agendamento</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">No agendamento, clique em "Cancelar" e informe o motivo. O horário ficará disponível novamente.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Lembretes automáticos</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">O sistema envia lembretes automáticos por WhatsApp para reduzir faltas.</p>
            `
        },
        'fluxo-caixa': {
            titulo: 'Fluxo de caixa',
            conteudo: `
                <h4 style="color:#2199EF; margin:20px 0 10px;">Abrir o caixa</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">No início do expediente, clique em "Abrir Caixa" e informe o saldo inicial.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Registrar movimentações</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Para cada venda ou despesa, clique em "Nova Movimentação" e preencha os dados.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Finalizar atendimentos</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Os atendimentos finalizados são automaticamente registrados como entradas no caixa.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Fechar o caixa</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">No final do expediente, clique em "Fechar Caixa" e confira o resumo do dia.</p>
            `
        },
        'sistema-comandas': {
            titulo: 'Sistema de comandas',
            conteudo: `
                <h4 style="color:#2199EF; margin:20px 0 10px;">Criar uma comanda</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Acesse o módulo Comandas e clique em "Nova Comanda". Selecione o cliente e barbeiro.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Adicionar itens</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Adicione serviços, produtos e pacotes à comanda. Acompanhe o subtotal em tempo real.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Aplicar desconto</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Você pode aplicar descontos percentuais ou fixos na comanda.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Finalizar comanda</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Escolha a forma de pagamento e finalize. O valor será registrado no caixa automaticamente.</p>
            `
        },
        'comissoes': {
            titulo: 'Comissões automáticas',
            conteudo: `
                <h4 style="color:#2199EF; margin:20px 0 10px;">Configurar comissões</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Acesse o módulo Comissões e configure a porcentagem para cada serviço ou profissional.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Comissões por serviço</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Defina uma porcentagem padrão para cada serviço. Ex: Corte de cabelo - 40%.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Comissões por profissional</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Configure porcentagens diferentes para cada profissional, se necessário.</p>
                <h4 style="color:#2199EF; margin:20px 0 10px;">Relatórios</h4>
                <p style="color:#cbd5e1; line-height:1.6; margin-bottom:15px;">Gere relatórios de comissões por período, profissional ou serviço.</p>
            `
        }
    };

    // ==================== ABRIR MODAL DO ARTIGO ====================
    document.querySelectorAll('.btn-leia').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const artigoId = btn.getAttribute('data-artigo');
            const artigo = artigos[artigoId];
            if (artigo) {
                const modal = document.createElement('div');
                modal.className = 'artigo-modal';
                modal.style.cssText = 'display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); backdrop-filter:blur(10px); z-index:2000; align-items:center; justify-content:center;';
                modal.innerHTML = `
                    <div class="artigo-modal-content" style="background:#0a0a0a; border:1px solid rgba(255,255,255,0.1); border-radius:24px; max-width:800px; width:90%; max-height:85vh; overflow-y:auto; position:relative; animation:modalFadeIn 0.3s ease;">
                        <div class="artigo-modal-header" style="padding:24px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:#0a0a0a;">
                            <h3 style="font-size:1.3rem; color:white;">${artigo.titulo}</h3>
                            <button class="modal-close" style="background:none; border:none; color:#94a3b8; font-size:1.5rem; cursor:pointer; transition:color 0.3s ease;">&times;</button>
                        </div>
                        <div class="artigo-modal-body" style="padding:24px;">
                            ${artigo.conteudo}
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                document.body.style.overflow = 'hidden';

                modal.querySelector('.modal-close').addEventListener('click', () => {
                    modal.remove();
                    document.body.style.overflow = '';
                });

                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                        document.body.style.overflow = '';
                    }
                });

                document.addEventListener('keydown', function closeModal(e) {
                    if (e.key === 'Escape') {
                        modal.remove();
                        document.body.style.overflow = '';
                        document.removeEventListener('keydown', closeModal);
                    }
                });
            }
        });
    });
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    setupHorarios();
    
});

// ============================================
// EDUCAÇÃO - FILTROS DE PRODUTOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const filtroBtns = document.querySelectorAll('.filtro-btn-custom');
    const produtoCards = document.querySelectorAll('.produto-card-custom');

    if (filtroBtns.length > 0) {
        filtroBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active de todos os botões
                filtroBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                produtoCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                        // Animação suave
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ============================================
    // EDUCAÇÃO - MODAL DE IMAGENS
    // ============================================
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.image-modal-close-custom');

    // Abrir modal ao clicar nas imagens dos produtos
    document.querySelectorAll('.produto-card-custom img').forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            if (modal && modalImg) {
                modalImg.src = this.src;
                modalImg.alt = this.alt || 'Imagem do material educativo';
                
                // Caption com o título do produto
                const card = this.closest('.produto-card-custom');
                const title = card ? card.querySelector('h3')?.textContent : '';
                if (modalCaption) {
                    modalCaption.textContent = title || 'Material Educativo';
                }
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Fechar modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // GARANTIR QUE OS CARDS APAREÇAM INICIALMENTE
    // ============================================
    produtoCards.forEach(card => {
        card.style.display = 'flex';
    });
});