/**
 * ==========================================================================
 * LEXION APP CORE LOGIC - HIGH FIDELITY SPA PROTOTYPE
 * ==========================================================================
 */

// --- CONFIG & STATE INITIALIZATION ---
const STATE_KEYS = {
    SERVICES: 'lexion_services',
    PROFESSIONALS: 'lexion_professionals',
    CLIENTS: 'lexion_clients',
    APPOINTMENTS: 'lexion_appointments',
    LEADS: 'lexion_leads',
    TRANSACTIONS: 'lexion_transactions',
    BUSINESS_INFO: 'lexion_business_info'
};

// Target Date for our Prototype: July 8, 2026
const PROTOTYPE_DATE_STR = '2026-07-08';
let currentSelectedDate = new Date(2026, 6, 8); // 8 de Julho de 2026

// Mock Data Initializer
function initMockDatabase() {
    // 1. SERVICES
    if (!localStorage.getItem(STATE_KEYS.SERVICES)) {
        const defaultServices = [
            { id: 'srv-1', name: 'Corte Degradê', price: 50, duration: 40, active: true },
            { id: 'srv-2', name: 'Barboterapia', price: 40, duration: 30, active: true },
            { id: 'srv-3', name: 'Combo Corte + Barba', price: 80, duration: 70, active: true },
            { id: 'srv-4', name: 'Progressiva Masculina', price: 120, duration: 90, active: true },
            { id: 'srv-5', name: 'Pigmentação', price: 30, duration: 20, active: true }
        ];
        localStorage.setItem(STATE_KEYS.SERVICES, JSON.stringify(defaultServices));
    }

    // 2. PROFESSIONALS
    if (!localStorage.getItem(STATE_KEYS.PROFESSIONALS)) {
        const defaultProfs = [
            { id: 'prof-1', name: 'Carlos Lexion', phone: '(11) 99999-1111', active: true },
            { id: 'prof-2', name: 'Felipe Albuquerque', phone: '(11) 98888-2222', active: true }
        ];
        localStorage.setItem(STATE_KEYS.PROFESSIONALS, JSON.stringify(defaultProfs));
    }

    // 3. CLIENTS
    if (!localStorage.getItem(STATE_KEYS.CLIENTS)) {
        const defaultClients = [
            { id: 'cli-1', name: 'João da Silva', phone: '(11) 98888-1111', instagram: 'joao.silva', birth: '1995-04-12', frequency: 21, lastVisit: '2026-06-13', notes: 'Gosta de cabelo curto nas laterais e tesoura em cima.' }, // Last visit: 25 days ago. Freq: 21 days -> Sumido!
            { id: 'cli-2', name: 'Pedro Santos', phone: '(11) 97777-2222', instagram: 'pedrinho', birth: '1998-09-21', frequency: 30, lastVisit: '2026-06-28', notes: 'Usa barba bem desenhada e alinhada.' }, // Last visit: 10 days ago. Freq: 30 days -> OK
            { id: 'cli-3', name: 'Lucas de Souza', phone: '(11) 99999-3333', instagram: 'lucassouza', birth: '1990-11-05', frequency: 15, lastVisit: '2026-05-24', notes: 'Corte degradê navalhado.' }, // Last visit: 45 days ago. Freq: 15 days -> Sumido!
            { id: 'cli-4', name: 'Marcos Oliveira', phone: '(11) 96666-4444', instagram: 'marquinhos', birth: '2001-02-18', frequency: 20, lastVisit: '2026-07-03', notes: 'Frequenta sempre aos sábados de manhã.' }, // Last visit: 5 days ago. Freq: 20 days -> OK
            { id: 'cli-5', name: 'André Costa', phone: '(11) 95555-5555', instagram: 'andre.costa', birth: '1987-07-30', frequency: 25, lastVisit: '2026-06-06', notes: 'Prefere corte social tradicional na tesoura.' }, // Last visit: 32 days ago. Freq: 25 -> Sumido!
            { id: 'cli-6', name: 'Matheus Lima', phone: '(11) 94444-6666', instagram: 'math.lima', birth: '1993-01-25', frequency: 30, lastVisit: '2026-07-06', notes: 'Usa pigmentação na barba.' }, // Last visit: 2 days ago -> OK
            { id: 'cli-7', name: 'Roberto Alves', phone: '(11) 93333-7777', instagram: 'beto.alves', birth: '1985-05-14', frequency: 30, lastVisit: '2026-05-09', notes: 'Corta cabelo e barba.' }, // Last visit: 60 days ago -> Sumido!
            { id: 'cli-8', name: 'Afonso Dias', phone: '(11) 92222-8888', instagram: 'afonso.dias', birth: '1999-08-08', frequency: 30, lastVisit: '2026-07-07', notes: 'Cliente novo indicado pelo Marcos.' }
        ];
        localStorage.setItem(STATE_KEYS.CLIENTS, JSON.stringify(defaultClients));
    }

    // 4. APPOINTMENTS
    if (!localStorage.getItem(STATE_KEYS.APPOINTMENTS)) {
        const defaultAppts = [
            // Done / Paid Appointments of July 8, 2026
            { id: 'appt-1', clientId: 'cli-1', serviceId: 'srv-3', profId: 'prof-1', date: '2026-07-08', time: '09:00', status: 'done', paymentStatus: 'paid', paymentMethod: 'pix', notes: 'Corte + Barba concluído com sucesso.' }, // R$ 80
            { id: 'appt-2', clientId: 'cli-2', serviceId: 'srv-1', profId: 'prof-2', date: '2026-07-08', time: '10:30', status: 'done', paymentStatus: 'paid', paymentMethod: 'cash', notes: 'Pago em dinheiro.' }, // R$ 50
            { id: 'appt-2-new', clientId: 'cli-8', serviceId: 'srv-1', profId: 'prof-2', date: '2026-07-08', time: '10:00', status: 'done', paymentStatus: 'paid', paymentMethod: 'pix', notes: '' }, // R$ 50
            { id: 'appt-3', clientId: 'cli-4', serviceId: 'srv-4', profId: 'prof-1', date: '2026-07-08', time: '11:30', status: 'done', paymentStatus: 'paid', paymentMethod: 'credit_card', notes: 'Progressiva masculina.' }, // R$ 120
            
            // Confirmed / Pending payment
            { id: 'appt-4', clientId: 'cli-5', serviceId: 'srv-3', profId: 'prof-2', date: '2026-07-08', time: '13:00', status: 'confirmed', paymentStatus: 'pending', notes: '' }, // R$ 80
            { id: 'appt-5', clientId: 'cli-6', serviceId: 'srv-3', profId: 'prof-1', date: '2026-07-08', time: '14:00', status: 'confirmed', paymentStatus: 'pending', notes: '' }, // R$ 80
            
            // Scheduled / Pending
            { id: 'appt-6', clientId: 'cli-3', serviceId: 'srv-1', profId: 'prof-2', date: '2026-07-08', time: '15:30', status: 'scheduled', paymentStatus: 'pending', notes: '' }, // R$ 50
            { id: 'appt-7', clientId: 'cli-7', serviceId: 'srv-3', profId: 'prof-1', date: '2026-07-08', time: '16:30', status: 'scheduled', paymentStatus: 'pending', notes: '' }, // R$ 80
            { id: 'appt-8', clientId: 'cli-8', serviceId: 'srv-1', profId: 'prof-1', date: '2026-07-08', time: '18:00', status: 'scheduled', paymentStatus: 'pending', notes: '' }, // R$ 50
            
            // Other dates for calendar demonstration
            { id: 'appt-9', clientId: 'cli-2', serviceId: 'srv-1', profId: 'prof-1', date: '2026-07-09', time: '10:00', status: 'scheduled', paymentStatus: 'pending', notes: '' },
            { id: 'appt-10', clientId: 'cli-4', serviceId: 'srv-2', profId: 'prof-2', date: '2026-07-09', time: '14:00', status: 'scheduled', paymentStatus: 'pending', notes: '' },
            { id: 'appt-11', clientId: 'cli-1', serviceId: 'srv-3', profId: 'prof-1', date: '2026-07-07', time: '15:00', status: 'done', paymentStatus: 'paid', paymentMethod: 'pix', notes: '' }
        ];
        localStorage.setItem(STATE_KEYS.APPOINTMENTS, JSON.stringify(defaultAppts));
    }

    // 5. LEADS
    if (!localStorage.getItem(STATE_KEYS.LEADS)) {
        const defaultLeads = [
            { id: 'lead-1', name: 'Bruno Souza', phone: '(11) 98222-1111', source: 'instagram', stage: 'new', notes: 'Perguntou preço do combo de corte e se tem horário no sábado de tarde.', date: '2026-07-08' },
            { id: 'lead-2', name: 'Thiago Silva', phone: '(11) 98111-2222', source: 'whatsapp', stage: 'new', notes: 'Quer saber se fazemos progressiva ou selagem capilar.', date: '2026-07-08' },
            { id: 'lead-3', name: 'Rafael Santos', phone: '(11) 97000-3333', source: 'whatsapp', stage: 'talking', notes: 'Em dúvida entre horário das 14h ou 17h na próxima sexta.', date: '2026-07-07' },
            { id: 'lead-4', name: 'Guilherme Lima', phone: '(11) 96999-4444', source: 'instagram', stage: 'talking', notes: 'Perguntou sobre pacotes mensais / assinatura de barba.', date: '2026-07-07' },
            { id: 'lead-5', name: 'Gustavo Oliveira', phone: '(11) 95888-5555', source: 'whatsapp', stage: 'link_sent', notes: 'Link de agendamento enviado às 10:15h após consulta de preços.', date: '2026-07-08' },
            { id: 'lead-6', name: 'Diego Costa', phone: '(11) 94777-6666', source: 'instagram', stage: 'link_sent', notes: 'Pediu horário livre, enviamos o link. Aguardando.', date: '2026-07-08' },
            { id: 'lead-7', name: 'Eduardo Ferreira', phone: '(11) 93666-7777', source: 'website', stage: 'scheduled', notes: 'Entrou pelo site público e marcou sozinho na agenda.', date: '2026-07-08' },
            { id: 'lead-8', name: 'Rodrigo Pereira', phone: '(11) 92555-8888', source: 'whatsapp', stage: 'follow_up', notes: 'Cliente antigo sumido. Mandar mensagem sugerindo retorno de 30 dias.', date: '2026-07-06' },
            { id: 'lead-9', name: 'Fernando Ribeiro', phone: '(11) 91444-9999', source: 'instagram', stage: 'lost', notes: 'Não respondeu à proposta de horários enviada na semana passada.', date: '2026-07-01' }
        ];
        localStorage.setItem(STATE_KEYS.LEADS, JSON.stringify(defaultLeads));
    }

    // 6. TRANSACTIONS
    if (!localStorage.getItem(STATE_KEYS.TRANSACTIONS)) {
        const defaultTrans = [
            // Today's automatic income from appointments (done status + paid paymentStatus)
            { id: 'tr-1', type: 'income', amount: 80, date: '2026-07-08', description: 'Corte + Barba - João da Silva', category: 'Serviço', paymentMethod: 'pix' },
            { id: 'tr-2', type: 'income', amount: 50, date: '2026-07-08', description: 'Corte Degradê - Pedro Santos', category: 'Serviço', paymentMethod: 'cash' },
            { id: 'tr-2-new', type: 'income', amount: 50, date: '2026-07-08', description: 'Corte Degradê - Afonso Dias', category: 'Serviço', paymentMethod: 'pix' },
            { id: 'tr-3', type: 'income', amount: 120, date: '2026-07-08', description: 'Progressiva Masculina - Marcos Oliveira', category: 'Serviço', paymentMethod: 'credit_card' },
            
            // Rest of month mockup cash flow to reach: Entradas = R$ 4.250, Saídas = R$ 1.120, Saldo = R$ 3.130
            { id: 'tr-4', type: 'income', amount: 3900, date: '2026-07-06', description: 'Faturamento acumulado semana anterior', category: 'Serviço', paymentMethod: 'pix' },
            { id: 'tr-5', type: 'income', amount: 50, date: '2026-07-05', description: 'Venda Pomada Modeladora', category: 'Produto', paymentMethod: 'debit_card' },
            
            // Expenses
            { id: 'tr-6', type: 'expense', amount: 650, date: '2026-07-02', description: 'Aluguel do Salão', category: 'Aluguel', paymentMethod: 'pix' },
            { id: 'tr-7', type: 'expense', amount: 280, date: '2026-07-03', description: 'Compra de suprimentos (Pomadas/Géis)', category: 'Estoque', paymentMethod: 'credit_card' },
            { id: 'tr-8', type: 'expense', amount: 190, date: '2026-07-04', description: 'Conta de Energia/Água', category: 'Contas', paymentMethod: 'pix' }
        ];
        localStorage.setItem(STATE_KEYS.TRANSACTIONS, JSON.stringify(defaultTrans));
    }

    // 7. BUSINESS INFO
    if (!localStorage.getItem(STATE_KEYS.BUSINESS_INFO)) {
        const defaultBiz = {
            name: 'Barbearia Lexion & Estilo',
            slug: 'barbearia-lexion',
            phone: '(11) 99999-8888',
            instagram: 'barbearia.lexion',
            address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
            hours: {
                weekdays: { start: '09:00', end: '19:00' },
                saturday: { start: '09:00', end: '15:00' }
            }
        };
        localStorage.setItem(STATE_KEYS.BUSINESS_INFO, JSON.stringify(defaultBiz));
    }
}

// Global data objects loaded from localStorage
let data = {
    services: [],
    professionals: [],
    clients: [],
    appointments: [],
    leads: [],
    transactions: [],
    businessInfo: {}
};

function loadData() {
    data.services = JSON.parse(localStorage.getItem(STATE_KEYS.SERVICES)) || [];
    data.professionals = JSON.parse(localStorage.getItem(STATE_KEYS.PROFESSIONALS)) || [];
    data.clients = JSON.parse(localStorage.getItem(STATE_KEYS.CLIENTS)) || [];
    data.appointments = JSON.parse(localStorage.getItem(STATE_KEYS.APPOINTMENTS)) || [];
    data.leads = JSON.parse(localStorage.getItem(STATE_KEYS.LEADS)) || [];
    data.transactions = JSON.parse(localStorage.getItem(STATE_KEYS.TRANSACTIONS)) || [];
    data.businessInfo = JSON.parse(localStorage.getItem(STATE_KEYS.BUSINESS_INFO)) || {};
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    loadData();
}

// --- UTILITY FUNCTIONS ---
function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function formatDateDisplay(date) {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    let formatted = date.toLocaleDateString('pt-BR', options);
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function getLocalDateString(date) {
    // Returns YYYY-MM-DD
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// Calculate days between two dates
function daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Toast Notifications System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'danger') icon = 'fa-circle-exclamation';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove toast
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --- APP NAVIGATION ---
function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const tabItems = document.querySelectorAll('.tab-item');
    const sections = document.querySelectorAll('.page-section');
    const pageTitle = document.getElementById('page-title');

    function switchTab(target) {
        // Update active sidebar item
        menuItems.forEach(m => {
            if (m.getAttribute('data-target') === target) m.classList.add('active');
            else m.classList.remove('active');
        });
        
        // Update active mobile tab bar item
        tabItems.forEach(t => {
            if (t.getAttribute('data-target') === target) t.classList.add('active');
            else t.classList.remove('active');
        });

        // Show active section
        sections.forEach(sec => sec.classList.remove('active'));
        const activeSection = document.getElementById(`page-${target}`);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        // Update header title
        let titleText = target;
        const menuItem = document.querySelector(`.menu-item[data-target="${target}"]`);
        if (menuItem) {
            titleText = menuItem.querySelector('span').innerText;
        } else if (target === 'simulador') {
            titleText = "Simulador de Link Público";
        }
        pageTitle.innerText = titleText;

        // Load section-specific data/rendering
        renderPageData(target);
        
        // Close mobile sidebar if open
        document.getElementById('sidebar').classList.remove('show');
    }

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            switchTab(target);
        });
    });

    tabItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            switchTab(target);
        });
    });

    // Custom links inside dashboard cards/buttons to switch tabs
    document.body.addEventListener('click', (e) => {
        const clickTabEl = e.target.closest('.click-tab');
        if (clickTabEl) {
            const target = clickTabEl.getAttribute('data-target');
            switchTab(target);
        }
    });

    // Mobile Sidebar Toggles
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.getElementById('sidebar');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => sidebar.classList.add('show'));
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => sidebar.classList.remove('show'));
    }
}

function renderPageData(pageId) {
    switch (pageId) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'agenda':
            renderAgenda();
            break;
        case 'clientes':
            renderClients();
            break;
        case 'leads':
            renderLeadsKanban();
            break;
        case 'financeiro':
            renderFinance();
            break;
        case 'configuracoes':
            renderConfig();
            break;
        case 'simulador':
            initPhoneSimulator();
            break;
    }
}

// --- MODAL ENGINE ---
function initModals() {
    // Select all close triggers
    const closeButtons = document.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-close-modal');
            closeModal(modalId);
        });
    });

    // Backdrop click closures
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(bd => {
        bd.addEventListener('click', (e) => {
            if (e.target === bd) {
                closeModal(bd.id);
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Reset form if modal contains one
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            const hiddenId = form.querySelector('input[type="hidden"]');
            if (hiddenId) hiddenId.value = '';
            
            // Hide delete buttons by default in edit forms
            const delBtn = form.querySelector('.btn-danger');
            if (delBtn) delBtn.style.display = 'none';
        }
    }
}

// --- 1. DASHBOARD COMPONENT ---
function renderDashboard() {
    const todayStr = getLocalDateString(currentSelectedDate); // '2026-07-08'
    const todayAppts = data.appointments.filter(a => a.date === todayStr && a.status !== 'cancelled');

    // 1. Calculate values
    let revenueExpected = 0;
    let revenueReceived = 0;
    let totalDoneOrConfirmed = 0;

    todayAppts.forEach(appt => {
        const service = data.services.find(s => s.id === appt.serviceId);
        const price = service ? service.price : 0;
        
        revenueExpected += price;
        if (appt.paymentStatus === 'paid') {
            revenueReceived += price;
        }
        if (appt.status === 'done' || appt.status === 'confirmed' || appt.status === 'scheduled') {
            totalDoneOrConfirmed++;
        }
    });

    // Update Indicators
    document.getElementById('dash-total-appts').innerText = todayAppts.length;
    document.getElementById('dash-expected-revenue').innerText = formatCurrency(revenueExpected);
    document.getElementById('dash-actual-revenue').innerText = formatCurrency(revenueReceived);

    // Clients recall counts
    const recallClients = getRecallClients();
    document.getElementById('dash-recall-count').innerText = recallClients.length;
    
    // Update red badge for CRM menu item
    const badgeRecall = document.getElementById('badge-recall');
    if (recallClients.length > 0) {
        badgeRecall.innerText = recallClients.length;
        badgeRecall.style.display = 'block';
    } else {
        badgeRecall.style.display = 'none';
    }

    // Leads indicators
    const activeLeads = data.leads.filter(l => l.stage !== 'scheduled' && l.stage !== 'lost');
    const badgeLeads = document.getElementById('badge-leads');
    if (activeLeads.length > 0) {
        badgeLeads.innerText = activeLeads.length;
        badgeLeads.style.display = 'block';
    } else {
        badgeLeads.style.display = 'none';
    }
    
    const pendingLeadsCount = data.leads.filter(l => l.stage === 'new' || l.stage === 'talking' || l.stage === 'link_sent').length;
    document.getElementById('dash-leads-pending-count').innerText = `${pendingLeadsCount} leads`;
    // Conversion progress bar (percentage of scheduled vs total)
    const totalLeads = data.leads.length;
    const convertedLeads = data.leads.filter(l => l.stage === 'scheduled').length;
    const leadConversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
    document.getElementById('dash-leads-progress-bar').style.width = `${leadConversionRate}%`;

    // 2. Render Today's Agenda List
    const atendimentosList = document.getElementById('dash-atendimentos-list');
    atendimentosList.innerHTML = '';

    if (todayAppts.length === 0) {
        atendimentosList.innerHTML = `
            <div style="text-align: center; padding: 30px; color: var(--text-muted);">
                <i class="fa-regular fa-calendar-minus" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                Nenhum agendamento para hoje.
            </div>
        `;
    } else {
        // Sort appointments by hour
        todayAppts.sort((a,b) => a.time.localeCompare(b.time));
        
        todayAppts.forEach(appt => {
            const client = data.clients.find(c => c.id === appt.clientId) || { name: 'Cliente Desconhecido', phone: '' };
            const service = data.services.find(s => s.id === appt.serviceId) || { name: 'Serviço Desconhecido', price: 0, duration: 30 };
            const professional = data.professionals.find(p => p.id === appt.profId) || { name: 'Profissional' };
            
            const card = document.createElement('div');
            card.className = `atendimento-card status-${appt.status}`;
            card.innerHTML = `
                <div class="appt-time-box">
                    <span class="appt-time">${appt.time}</span>
                    <span class="appt-duration">${service.duration} min</span>
                </div>
                <div class="appt-client-info">
                    <strong class="appt-client-name">${client.name}</strong>
                    <span class="appt-service-tag">${service.name} • c/ <strong>${professional.name}</strong></span>
                </div>
                <div class="appt-meta-tags">
                    <span class="status-badge ${appt.status}">${translateStatus(appt.status)}</span>
                </div>
                <div class="appt-price">${formatCurrency(service.price)}</div>
                <div class="appt-actions">
                    <button class="btn-card-action" onclick="openEditAppointment('${appt.id}')" title="Editar Atendimento">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </div>
            `;
            atendimentosList.appendChild(card);
        });
    }

    // 3. Render CRM Recommended Actions (suggest return)
    const crmList = document.getElementById('dash-crm-list');
    crmList.innerHTML = '';

    const limitRecallList = recallClients.slice(0, 3); // top 3 for dashboard
    if (limitRecallList.length === 0) {
        crmList.innerHTML = `
            <div style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 15px;">
                Todos os clientes estão com retornos em dia!
            </div>
        `;
    } else {
        limitRecallList.forEach(client => {
            const card = document.createElement('div');
            card.className = 'crm-alert-card';
            card.innerHTML = `
                <div class="crm-alert-text">
                    <strong>${client.name}</strong>
                    <span class="crm-alert-subtext">Corte habitual a cada ${client.frequency} dias. Último há ${client.daysSinceLast} dias.</span>
                </div>
                <button class="btn btn-primary btn-sm" onclick="openWhatsAppCRMSimulator('${client.id}')">
                    <i class="fa-brands fa-whatsapp"></i> Chamar
                </button>
            `;
            crmList.appendChild(card);
        });
    }

    // 4. Render Recent Leads panel
    const recentLeadsPanel = document.getElementById('dash-recent-leads');
    recentLeadsPanel.innerHTML = '';
    const limitLeads = data.leads.filter(l => l.stage !== 'scheduled' && l.stage !== 'lost').slice(0, 3);
    
    if (limitLeads.length === 0) {
        recentLeadsPanel.innerHTML = `
            <div style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 15px;">
                Nenhum lead em aberto no momento.
            </div>
        `;
    } else {
        limitLeads.forEach(lead => {
            const row = document.createElement('div');
            row.className = 'recent-lead-row';
            row.innerHTML = `
                <div>
                    <span class="recent-lead-name">${lead.name}</span>
                    <span class="recent-lead-source"><i class="fa-brands fa-${lead.source} lead-source-icon ${lead.source}"></i> ${lead.phone}</span>
                </div>
                <span class="status-badge" style="background-color: var(--bg-tertiary); color: var(--text-muted); font-size: 9px;">${translateLeadStage(lead.stage)}</span>
            `;
            recentLeadsPanel.appendChild(row);
        });
    }
}

// Calculates which clients are overdue for return based on lastVisit and frequency
function getRecallClients() {
    const today = new Date(2026, 6, 8); // July 8, 2026
    return data.clients.filter(client => {
        if (!client.lastVisit) return false;
        const daysSinceLast = daysBetween(client.lastVisit, today);
        client.daysSinceLast = daysSinceLast;
        // Client is overdue if days since last visit exceeds frequency
        return daysSinceLast > client.frequency;
    }).sort((a,b) => b.daysSinceLast - a.daysSinceLast); // biggest delay first
}

// Translators
function translateStatus(st) {
    const match = {
        scheduled: 'Agendado',
        confirmed: 'Confirmado',
        done: 'Concluído',
        no_show: 'Faltou',
        cancelled: 'Cancelado'
    };
    return match[st] || st;
}

function translateLeadStage(st) {
    const match = {
        new: 'Novo Lead',
        talking: 'Conversando',
        link_sent: 'Link Enviado',
        scheduled: 'Agendado',
        follow_up: 'Retorno',
        lost: 'Perdido'
    };
    return match[st] || st;
}

// --- 2. AGENDA COMPONENT ---
function renderAgenda() {
    // Current display title
    document.getElementById('agenda-current-date-title').innerText = formatDateDisplay(currentSelectedDate);
    
    // Set value in appointment modal date field to current selected date
    document.getElementById('appt-date').value = getLocalDateString(currentSelectedDate);

    // Populate professional columns headers
    const headerCols = document.getElementById('calendar-header-cols');
    const colsContainer = document.getElementById('calendar-columns-container');
    headerCols.innerHTML = '';
    colsContainer.innerHTML = '';

    const activeProfs = data.professionals.filter(p => p.active);
    
    // Mobile professional switcher list populate
    const profSwitcher = document.getElementById('mobile-prof-switcher');
    if (profSwitcher) {
        profSwitcher.innerHTML = '';
        if (!window.mobileSelectedProfId && activeProfs.length > 0) {
            window.mobileSelectedProfId = activeProfs[0].id;
        }
        activeProfs.forEach(prof => {
            const btn = document.createElement('button');
            btn.className = `prof-switch-btn ${window.mobileSelectedProfId === prof.id ? 'active' : ''}`;
            btn.innerText = prof.name.split(' ')[0];
            btn.addEventListener('click', () => {
                window.mobileSelectedProfId = prof.id;
                renderAgenda();
            });
            profSwitcher.appendChild(btn);
        });
    }

    // Time Axis Rendering (9:00 to 19:00)
    const timeAxis = document.getElementById('calendar-time-axis');
    timeAxis.innerHTML = '';
    for (let hour = 9; hour < 19; hour++) {
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-axis-label';
        timeLabel.innerText = `${String(hour).padStart(2,'0')}:00`;
        timeAxis.appendChild(timeLabel);
    }

    if (activeProfs.length === 0) {
        headerCols.innerHTML = `<div class="calendar-header-col" style="border:none;">Cadastre profissionais ativos nas Configurações.</div>`;
        return;
    }

    activeProfs.forEach(prof => {
        // 1. Render column header
        const colHeader = document.createElement('div');
        colHeader.className = 'calendar-header-col';
        if (window.mobileSelectedProfId === prof.id) {
            colHeader.classList.add('active-mobile-col');
        }
        colHeader.innerText = prof.name;
        headerCols.appendChild(colHeader);

        // 2. Render column body
        const col = document.createElement('div');
        col.className = 'calendar-col';
        if (window.mobileSelectedProfId === prof.id) {
            col.classList.add('active-mobile-col');
        }
        col.setAttribute('data-prof-id', prof.id);
        
        // Render dashed background grid lines
        const gridLines = document.createElement('div');
        gridLines.className = 'calendar-grid-lines';
        for (let i = 9; i < 19; i++) {
            const line = document.createElement('div');
            line.className = 'grid-line';
            gridLines.appendChild(line);
        }
        col.appendChild(gridLines);

        // 3. Filter and position appointments for this professional & selected date
        const dateStr = getLocalDateString(currentSelectedDate);
        const profAppts = data.appointments.filter(a => a.profId === prof.id && a.date === dateStr && a.status !== 'cancelled');

        profAppts.forEach(appt => {
            const client = data.clients.find(c => c.id === appt.clientId) || { name: 'Cliente', phone: '' };
            const service = data.services.find(s => s.id === appt.serviceId) || { name: 'Serviço', price: 0, duration: 30 };
            
            // Calculate absolute position based on start time
            // Calendar starts at 09:00. Every hour is 60px height. 1px = 1 minute.
            const [startHour, startMin] = appt.time.split(':').map(Number);
            const totalMinutesFromStart = (startHour - 9) * 60 + startMin;
            const topPosition = totalMinutesFromStart; // 1px per min
            const height = service.duration;

            // Only show if within calendar range (09:00 to 19:00 = 600px total height)
            if (topPosition >= 0 && topPosition < 600) {
                const eventEl = document.createElement('div');
                eventEl.className = `calendar-appt-event ${appt.status}`;
                eventEl.style.top = `${topPosition}px`;
                eventEl.style.height = `${height}px`;
                
                eventEl.innerHTML = `
                    <div class="event-title">${client.name}</div>
                    <div class="event-desc">${service.name} (${service.duration}m)</div>
                    <div class="event-time">${appt.time}</div>
                `;
                
                // Clicking event opens edit modal
                eventEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEditAppointment(appt.id);
                });
                
                col.appendChild(eventEl);
            }
        });

        // Click column space to create quick appointment at that approximate hour
        col.addEventListener('click', (e) => {
            const rect = col.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            // 60px = 1 hour. Calculate hour.
            const clickedHour = Math.floor(clickY / 60) + 9;
            const clickedMinute = Math.floor((clickY % 60) / 10) * 10; // Round to nearest 10 mins
            
            const timeStr = `${String(clickedHour).padStart(2,'0')}:${String(clickedMinute).padStart(2,'0')}`;
            openNewAppointmentModal(prof.id, timeStr);
        });

        colsContainer.appendChild(col);
    });
}

// Navigation helpers for agenda
document.getElementById('btn-agenda-prev').addEventListener('click', () => {
    currentSelectedDate.setDate(currentSelectedDate.getDate() - 1);
    renderAgenda();
});

document.getElementById('btn-agenda-next').addEventListener('click', () => {
    currentSelectedDate.setDate(currentSelectedDate.getDate() + 1);
    renderAgenda();
});

// View switch placeholders (simulated alert info)
const agendaViewButtons = document.querySelectorAll('.agenda-filters button');
agendaViewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        agendaViewButtons.forEach(b => b.classList.remove('btn-active'));
        btn.classList.add('btn-active');
        
        const wrapper = document.querySelector('.calendar-wrapper');
        const altView = document.getElementById('calendar-alternate-view');
        
        if (btn.id === 'btn-agenda-view-day') {
            wrapper.style.display = 'flex';
            altView.style.display = 'none';
            renderAgenda();
        } else {
            wrapper.style.display = 'none';
            altView.style.display = 'block';
            altView.innerHTML = `
                <div style="padding: 50px 20px;">
                    <i class="fa-solid fa-circle-nodes" style="font-size: 40px; color: var(--primary); margin-bottom: 20px;"></i>
                    <h4>Visualização de ${btn.innerText}</h4>
                    <p style="color: var(--text-muted); max-width: 400px; margin: 8px auto 0;">
                        No protótipo funcional, a tela de <strong>Dia</strong> é interativa por colunas de profissionais. As telas de Semana/Mês usam a mesma lógica agregada por blocos.
                    </p>
                </div>
            `;
        }
    });
});

// Appt CRUD Triggers
function openNewAppointmentModal(profId = '', timeVal = '09:00') {
    populateApptFormSelects();
    
    document.getElementById('appointment-modal-title').innerText = 'Novo Agendamento';
    document.getElementById('appt-id').value = '';
    document.getElementById('appt-date').value = getLocalDateString(currentSelectedDate);
    document.getElementById('appt-time').value = timeVal;
    
    if (profId) {
        document.getElementById('appt-prof-select').value = profId;
    }
    
    document.getElementById('btn-delete-appointment').style.display = 'none';
    openModal('modal-appointment');
}

document.getElementById('btn-new-appointment').addEventListener('click', () => openNewAppointmentModal());
document.getElementById('btn-quick-appointment').addEventListener('click', () => openNewAppointmentModal());

// Select elements populate helper
function populateApptFormSelects() {
    const clientSelect = document.getElementById('appt-client-select');
    const serviceSelect = document.getElementById('appt-service-select');
    const profSelect = document.getElementById('appt-prof-select');

    // Populate Clients
    clientSelect.innerHTML = '<option value="">-- Selecione o Cliente --</option>';
    data.clients.forEach(cli => {
        clientSelect.innerHTML += `<option value="${cli.id}">${cli.name} (${cli.phone})</option>`;
    });

    // Populate Services
    serviceSelect.innerHTML = '<option value="">-- Selecione o Serviço --</option>';
    data.services.filter(s => s.active).forEach(srv => {
        serviceSelect.innerHTML += `<option value="${srv.id}">${srv.name} (${formatCurrency(srv.price)})</option>`;
    });

    // Populate Professionals
    profSelect.innerHTML = '<option value="">-- Selecione o Profissional --</option>';
    data.professionals.filter(p => p.active).forEach(prof => {
        profSelect.innerHTML += `<option value="${prof.id}">${prof.name}</option>`;
    });
}

function openEditAppointment(apptId) {
    const appt = data.appointments.find(a => a.id === apptId);
    if (!appt) return;

    populateApptFormSelects();
    
    document.getElementById('appointment-modal-title').innerText = 'Editar Agendamento';
    document.getElementById('appt-id').value = appt.id;
    document.getElementById('appt-client-select').value = appt.clientId;
    document.getElementById('appt-service-select').value = appt.serviceId;
    document.getElementById('appt-prof-select').value = appt.profId;
    document.getElementById('appt-date').value = appt.date;
    document.getElementById('appt-time').value = appt.time;
    document.getElementById('appt-status').value = appt.status;
    document.getElementById('appt-payment').value = appt.paymentStatus;
    document.getElementById('appt-payment-method').value = appt.paymentMethod || 'pix';
    document.getElementById('appt-notes').value = appt.notes || '';
    
    // Show delete button
    document.getElementById('btn-delete-appointment').style.display = 'block';
    openModal('modal-appointment');
}

// Appt form submission
document.getElementById('form-appointment').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('appt-id').value;
    const clientId = document.getElementById('appt-client-select').value;
    const serviceId = document.getElementById('appt-service-select').value;
    const profId = document.getElementById('appt-prof-select').value;
    const date = document.getElementById('appt-date').value;
    const time = document.getElementById('appt-time').value;
    const status = document.getElementById('appt-status').value;
    const paymentStatus = document.getElementById('appt-payment').value;
    const paymentMethod = document.getElementById('appt-payment-method').value;
    const notes = document.getElementById('appt-notes').value;

    const newAppt = { id, clientId, serviceId, profId, date, time, status, paymentStatus, paymentMethod, notes };
    
    // Conflit validation simulation: Check if professional has another appt in same slots
    // For prototype simplicity, just notify and check if times match exactly.
    const conflict = data.appointments.find(a => 
        a.profId === profId && 
        a.date === date && 
        a.time === time && 
        a.id !== id &&
        a.status !== 'cancelled'
    );
    
    if (conflict) {
        const otherClient = data.clients.find(c => c.id === conflict.clientId) || {name: 'Outro'};
        showToast(`Conflito: Profissional ocupado com ${otherClient.name} às ${time}!`, 'danger');
        return;
    }

    if (id) {
        // Update
        const idx = data.appointments.findIndex(a => a.id === id);
        // check if changed to done and paid to automatically log financial income
        const prevAppt = data.appointments[idx];
        
        data.appointments[idx] = newAppt;
        showToast("Agendamento atualizado com sucesso!", "success");

        // Financial automatic trigger
        triggerFinancialLogging(prevAppt, newAppt);
    } else {
        // Create
        newAppt.id = 'appt-' + Date.now();
        data.appointments.push(newAppt);
        showToast("Horário agendado com sucesso!", "success");
        
        // Trigger finance if logged as completed directly
        triggerFinancialLogging(null, newAppt);
    }

    // Save
    saveData(STATE_KEYS.APPOINTMENTS, data.appointments);
    closeModal('modal-appointment');
    
    // Update CRM / Last Visit on client completion
    if (status === 'done') {
        const clientIdx = data.clients.findIndex(c => c.id === clientId);
        if (clientIdx !== -1) {
            data.clients[clientIdx].lastVisit = date;
            saveData(STATE_KEYS.CLIENTS, data.clients);
        }
    }

    // Re-render
    const activeMenuItem = document.querySelector('.menu-item.active');
    const target = activeMenuItem ? activeMenuItem.getAttribute('data-target') : 'agenda';
    renderPageData(target);
});

// Auto Financial Record Sync
function triggerFinancialLogging(prev, current) {
    // If status changed to 'done' and paymentStatus changed to 'paid' (or created as such), log as transaction
    const wasPaid = prev ? (prev.status === 'done' && prev.paymentStatus === 'paid') : false;
    const isPaid = (current.status === 'done' && current.paymentStatus === 'paid');

    if (!wasPaid && isPaid) {
        const service = data.services.find(s => s.id === current.serviceId);
        const client = data.clients.find(c => c.id === current.clientId);
        const price = service ? service.price : 50;
        const desc = `${service ? service.name : 'Serviço'} - ${client ? client.name : 'Cliente'}`;

        const newTrans = {
            id: 'tr-' + Date.now(),
            type: 'income',
            amount: price,
            date: current.date,
            description: desc,
            category: 'Serviço',
            paymentMethod: current.paymentMethod || 'pix'
        };
        data.transactions.push(newTrans);
        saveData(STATE_KEYS.TRANSACTIONS, data.transactions);
        showToast(`Rendimento de ${formatCurrency(price)} registrado nas finanças!`, 'success');
    }
}

// Appt Delete trigger
document.getElementById('btn-delete-appointment').addEventListener('click', () => {
    const id = document.getElementById('appt-id').value;
    if (id) {
        const idx = data.appointments.findIndex(a => a.id === id);
        if (idx !== -1) {
            data.appointments[idx].status = 'cancelled';
            saveData(STATE_KEYS.APPOINTMENTS, data.appointments);
            showToast("Agendamento cancelado.", "warning");
        }
        closeModal('modal-appointment');
        renderAgenda();
    }
});

// Quick client creator inside Appointment Modal
document.getElementById('btn-quick-add-client-from-appt').addEventListener('click', () => {
    document.getElementById('client-modal-title').innerText = 'Adicionar Cliente Rápido';
    document.getElementById('client-id').value = '';
    // Hide standard close or override modal stacking
    openModal('modal-client');
});

// --- 3. CLIENTS COMPONENT ---
function renderClients() {
    const searchQuery = document.getElementById('input-search-clients').value.toLowerCase();
    const filterStatus = document.getElementById('select-filter-clients-status').value;
    const tbody = document.getElementById('tbody-clients');
    tbody.innerHTML = '';

    const today = new Date(2026, 6, 8); // July 8, 2026

    // Filtering clients
    let filteredClients = data.clients.filter(cli => {
        const matchesSearch = cli.name.toLowerCase().includes(searchQuery) || cli.phone.includes(searchQuery);
        
        if (!matchesSearch) return false;
        
        const daysSinceLast = cli.lastVisit ? daysBetween(cli.lastVisit, today) : 999;
        const isSumido = daysSinceLast > cli.frequency;

        if (filterStatus === 'sumido') return isSumido && cli.lastVisit;
        if (filterStatus === 'reco') return !isSumido && cli.lastVisit && daysSinceLast <= 60;
        if (filterStatus === 'novo') return !cli.lastVisit || daysSinceLast <= 7;

        return true;
    });

    if (filteredClients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
                    Nenhum cliente correspondente encontrado.
                </td>
            </tr>
        `;
        return;
    }

    filteredClients.forEach(cli => {
        const daysSinceLast = cli.lastVisit ? daysBetween(cli.lastVisit, today) : null;
        const isSumido = daysSinceLast ? (daysSinceLast > cli.frequency) : false;
        
        // Calculate total spent
        const clientAppts = data.appointments.filter(a => a.clientId === cli.id && a.status === 'done' && a.paymentStatus === 'paid');
        let totalSpent = 0;
        clientAppts.forEach(a => {
            const srv = data.services.find(s => s.id === a.serviceId);
            if (srv) totalSpent += srv.price;
        });

        // Status Retorno HTML
        let statusBadgeHTML = '';
        if (daysSinceLast === null) {
            statusBadgeHTML = `<span class="status-badge" style="background-color: var(--info-light); color: var(--info);">Novo</span>`;
        } else if (isSumido) {
            statusBadgeHTML = `<span class="status-badge" style="background-color: var(--danger-light); color: var(--danger);">Atrasado (${daysSinceLast} dias)</span>`;
        } else {
            statusBadgeHTML = `<span class="status-badge" style="background-color: var(--success-light); color: var(--success);">Em Dia (${daysSinceLast} dias)</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Nome">
                <strong>${cli.name}</strong>
                ${cli.instagram ? `<span style="font-size: 11px; color: var(--text-muted); display: block;">@${cli.instagram}</span>` : ''}
            </td>
            <td data-label="WhatsApp">${cli.phone}</td>
            <td data-label="Frequência">A cada ${cli.frequency} dias</td>
            <td data-label="Último Corte">${cli.lastVisit ? formatDateStringToBR(cli.lastVisit) : 'Sem registros'}</td>
            <td data-label="Status Retorno">${statusBadgeHTML}</td>
            <td data-label="Total Gasto" style="font-weight: 700;">${formatCurrency(totalSpent)}</td>
            <td data-label="Ações" style="text-align: right;">
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    ${isSumido ? `
                        <button class="btn btn-secondary btn-sm" onclick="openWhatsAppCRMSimulator('${cli.id}')" title="Mensagem de Retorno">
                            <i class="fa-brands fa-whatsapp text-success"></i> Chamar
                        </button>
                    ` : ''}
                    <button class="btn btn-icon btn-sm" onclick="openEditClient('${cli.id}')"><i class="fa-solid fa-pen"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function formatDateStringToBR(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

// Search and filters client events
document.getElementById('input-search-clients').addEventListener('input', renderClients);
document.getElementById('select-filter-clients-status').addEventListener('change', renderClients);

document.getElementById('btn-add-client').addEventListener('click', () => {
    document.getElementById('client-modal-title').innerText = 'Cadastrar Cliente';
    document.getElementById('client-id').value = '';
    openModal('modal-client');
});

function openEditClient(id) {
    const cli = data.clients.find(c => c.id === id);
    if (!cli) return;

    document.getElementById('client-modal-title').innerText = 'Editar Cliente';
    document.getElementById('client-id').value = cli.id;
    document.getElementById('client-name').value = cli.name;
    document.getElementById('client-phone').value = cli.phone;
    document.getElementById('client-instagram').value = cli.instagram || '';
    document.getElementById('client-birth').value = cli.birth || '';
    document.getElementById('client-frequency').value = cli.frequency;
    document.getElementById('client-notes').value = cli.notes || '';

    openModal('modal-client');
}

// Client Form submit
document.getElementById('form-client').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('client-id').value;
    const name = document.getElementById('client-name').value;
    const phone = document.getElementById('client-phone').value;
    const instagram = document.getElementById('client-instagram').value;
    const birth = document.getElementById('client-birth').value;
    const frequency = parseInt(document.getElementById('client-frequency').value) || 30;
    const notes = document.getElementById('client-notes').value;

    if (id) {
        // edit
        const idx = data.clients.findIndex(c => c.id === id);
        data.clients[idx] = { ...data.clients[idx], name, phone, instagram, birth, frequency, notes };
        showToast("Cliente atualizado!", "success");
    } else {
        // create
        const newCli = {
            id: 'cli-' + Date.now(),
            name, phone, instagram, birth, frequency, notes,
            lastVisit: null
        };
        data.clients.push(newCli);
        showToast("Cliente cadastrado com sucesso!", "success");
    }

    saveData(STATE_KEYS.CLIENTS, data.clients);
    closeModal('modal-client');
    
    // Reload active page data
    const activePage = document.querySelector('.menu-item.active').getAttribute('data-target');
    renderPageData(activePage);
});

// --- WhatsApp CRM Simulator Modal ---
function openWhatsAppCRMSimulator(clientId) {
    const client = data.clients.find(c => c.id === clientId);
    if (!client) return;

    document.getElementById('wa-chat-name').innerText = client.name;
    
    // Generate customizable message suggestion
    const draftText = `Olá, ${client.name}! Faz uns ${client.daysSinceLast || 30} dias desde o seu último corte aqui na Barbearia Lexion.
Que tal agendar um horário para esta semana e dar um trato no visual? 

Você pode marcar direto pelo nosso link inteligente:
lexion.com.br/agendar/${data.businessInfo.slug}

Aguardo você!`;

    document.getElementById('wa-message-draft').innerText = draftText;
    document.getElementById('wa-link-placeholder').innerText = `lexion.com.br/agendar/${data.businessInfo.slug}`;
    
    // Set link for WhatsApp Web
    const whatsappPhone = client.phone.replace(/\D/g, ''); // leave only numbers
    const encodedMsg = encodeURIComponent(draftText);
    document.getElementById('btn-send-real-whatsapp').href = `https://wa.me/55${whatsappPhone}?text=${encodedMsg}`;

    openModal('modal-whatsapp-crm');
}

// --- 4. KANBAN LEADS BOARD ---
function renderLeadsKanban() {
    const searchQuery = document.getElementById('input-search-leads').value.toLowerCase();
    const stages = ['new', 'talking', 'link_sent', 'scheduled', 'follow_up', 'lost'];
    
    // Track active mobile stage tab
    if (!window.mobileSelectedLeadStage) {
        window.mobileSelectedLeadStage = 'new';
    }

    // Populate mobile leads tabs header
    const mobileLeadsTabs = document.getElementById('mobile-leads-tabs');
    if (mobileLeadsTabs) {
        mobileLeadsTabs.innerHTML = '';
        const stageNames = {
            new: 'Novos',
            talking: 'Conversa',
            link_sent: 'Enviados',
            scheduled: 'Agendados',
            follow_up: 'Retorno',
            lost: 'Perdidos'
        };
        stages.forEach(stage => {
            const count = data.leads.filter(l => l.stage === stage && 
                (l.name.toLowerCase().includes(searchQuery) || l.phone.includes(searchQuery))
            ).length;
            
            const btn = document.createElement('button');
            btn.className = `kanban-tab-btn ${window.mobileSelectedLeadStage === stage ? 'active' : ''}`;
            btn.innerHTML = `${stageNames[stage]} <span class="tab-badge">${count}</span>`;
            btn.addEventListener('click', () => {
                window.mobileSelectedLeadStage = stage;
                renderLeadsKanban();
            });
            mobileLeadsTabs.appendChild(btn);
        });
    }

    // Reset columns HTML and counters
    stages.forEach(stage => {
        const container = document.getElementById(`container-stage-${stage}`);
        container.innerHTML = '';
        document.getElementById(`badge-stage-${stage.replace(/_/g, '-')}`).innerText = '0';
    });

    let counts = { new: 0, talking: 0, link_sent: 0, scheduled: 0, follow_up: 0, lost: 0 };

    // Filter and distribute leads
    const filteredLeads = data.leads.filter(l => l.name.toLowerCase().includes(searchQuery) || l.phone.includes(searchQuery));

    filteredLeads.forEach(lead => {
        const container = document.getElementById(`container-stage-${lead.stage}`);
        if (!container) return;

        counts[lead.stage]++;
        document.getElementById(`badge-stage-${lead.stage.replace(/_/g, '-')}`).innerText = counts[lead.stage];

        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.draggable = true;
        card.setAttribute('data-lead-id', lead.id);

        card.innerHTML = `
            <div class="lead-card-header">
                <span class="lead-card-title">${lead.name}</span>
                <i class="fa-brands fa-${lead.source} lead-source-icon ${lead.source}" title="Origem: ${lead.source}"></i>
            </div>
            <div class="lead-card-body">${lead.notes || 'Sem observações.'}</div>
            <div class="lead-card-footer">
                <span class="lead-card-date">${formatDateStringToBR(lead.date)}</span>
                <div class="lead-card-actions">
                    <button class="btn-card-action" onclick="openEditLead('${lead.id}')" title="Editar Lead"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-card-action" onclick="moveLeadRight('${lead.id}')" title="Avançar coluna"><i class="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
        `;

        // HTML5 Drag and Drop events
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', lead.id);
            card.style.opacity = '0.5';
        });

        card.addEventListener('dragend', () => {
            card.style.opacity = '1';
        });

        container.appendChild(card);
    });

    // Add dragover and drop events to columns, and apply mobile visibility toggles
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(col => {
        const colStage = col.getAttribute('data-stage');
        
        // Mobile layout visibility
        if (window.mobileSelectedLeadStage === colStage) {
            col.classList.add('active-mobile-col');
        } else {
            col.classList.remove('active-mobile-col');
        }

        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            col.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
        });

        col.addEventListener('dragleave', () => {
            col.style.backgroundColor = '';
        });

        col.addEventListener('drop', (e) => {
            e.preventDefault();
            col.style.backgroundColor = '';
            const leadId = e.dataTransfer.getData('text/plain');
            const targetStage = col.getAttribute('data-stage');
            if (leadId && targetStage) {
                changeLeadStage(leadId, targetStage);
            }
        });
    });
}

// Search leads event
document.getElementById('input-search-leads').addEventListener('input', renderLeadsKanban);

function changeLeadStage(leadId, targetStage) {
    const idx = data.leads.findIndex(l => l.id === leadId);
    if (idx !== -1) {
        const oldStage = data.leads[idx].stage;
        data.leads[idx].stage = targetStage;
        saveData(STATE_KEYS.LEADS, data.leads);
        
        // Show success alert
        showToast(`Lead "${data.leads[idx].name}" movido para ${translateLeadStage(targetStage)}!`, 'info');
        
        // Render
        renderLeadsKanban();
    }
}

// Easy move button helper
function moveLeadRight(id) {
    const lead = data.leads.find(l => l.id === id);
    if (!lead) return;

    const stages = ['new', 'talking', 'link_sent', 'scheduled', 'follow_up', 'lost'];
    const currentIdx = stages.indexOf(lead.stage);
    
    if (currentIdx !== -1 && currentIdx < stages.length - 1) {
        changeLeadStage(id, stages[currentIdx + 1]);
    }
}

document.getElementById('btn-add-lead').addEventListener('click', () => {
    document.getElementById('lead-modal-title').innerText = 'Novo Lead';
    document.getElementById('lead-id').value = '';
    document.getElementById('btn-delete-lead').style.display = 'none';
    openModal('modal-lead');
});

function openEditLead(id) {
    const lead = data.leads.find(l => l.id === id);
    if (!lead) return;

    document.getElementById('lead-modal-title').innerText = 'Editar Lead';
    document.getElementById('lead-id').value = lead.id;
    document.getElementById('lead-name').value = lead.name;
    document.getElementById('lead-phone').value = lead.phone;
    document.getElementById('lead-source').value = lead.source;
    document.getElementById('lead-stage').value = lead.stage;
    document.getElementById('lead-notes').value = lead.notes || '';
    
    document.getElementById('btn-delete-lead').style.display = 'block';
    openModal('modal-lead');
}

// Lead form submit
document.getElementById('form-lead').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('lead-id').value;
    const name = document.getElementById('lead-name').value;
    const phone = document.getElementById('lead-phone').value;
    const source = document.getElementById('lead-source').value;
    const stage = document.getElementById('lead-stage').value;
    const notes = document.getElementById('lead-notes').value;

    if (id) {
        // edit
        const idx = data.leads.findIndex(l => l.id === id);
        data.leads[idx] = { ...data.leads[idx], name, phone, source, stage, notes };
        showToast("Lead atualizado!", "success");
    } else {
        // create
        const newLead = {
            id: 'lead-' + Date.now(),
            name, phone, source, stage, notes,
            date: getLocalDateString(currentSelectedDate)
        };
        data.leads.push(newLead);
        showToast("Novo lead adicionado!", "success");
    }

    saveData(STATE_KEYS.LEADS, data.leads);
    closeModal('modal-lead');
    renderLeadsKanban();
});

// Delete lead
document.getElementById('btn-delete-lead').addEventListener('click', () => {
    const id = document.getElementById('lead-id').value;
    if (id) {
        data.leads = data.leads.filter(l => l.id !== id);
        saveData(STATE_KEYS.LEADS, data.leads);
        showToast("Lead excluído.", "warning");
        closeModal('modal-lead');
        renderLeadsKanban();
    }
});

// --- 5. FINANCE COMPONENT ---
function renderFinance() {
    // 1. Calculate values
    let totalIn = 0;
    let totalOut = 0;
    
    data.transactions.forEach(t => {
        if (t.type === 'income') totalIn += t.amount;
        else totalOut += t.amount;
    });

    const netProfit = totalIn - totalOut;

    // Calculate ticket medio (done appts total spent / done appts count)
    const paidAppts = data.appointments.filter(a => a.status === 'done' && a.paymentStatus === 'paid');
    let ticketSum = 0;
    paidAppts.forEach(a => {
        const srv = data.services.find(s => s.id === a.serviceId);
        if (srv) ticketSum += srv.price;
    });
    const ticketMedio = paidAppts.length > 0 ? (ticketSum / paidAppts.length) : 0;

    // Update displays
    document.getElementById('fin-total-income').innerText = formatCurrency(totalIn);
    document.getElementById('fin-total-expenses').innerText = formatCurrency(totalOut);
    
    const profitEl = document.getElementById('fin-net-profit');
    profitEl.innerText = formatCurrency(netProfit);
    if (netProfit >= 0) {
        profitEl.className = 'metric-value text-green';
    } else {
        profitEl.className = 'metric-value text-danger';
    }

    document.getElementById('fin-ticket-medio').innerText = formatCurrency(ticketMedio);

    // 2. Render Transaction List
    const tbody = document.getElementById('tbody-transactions');
    tbody.innerHTML = '';

    // Sort transactions by date descending
    const sortedTrans = [...data.transactions].sort((a,b) => b.date.localeCompare(a.date));

    sortedTrans.forEach(t => {
        const tr = document.createElement('tr');
        const sign = t.type === 'income' ? '+' : '-';
        const cssClass = t.type === 'income' ? 'text-success' : 'text-danger';
        
        tr.innerHTML = `
            <td data-label="Data">${formatDateStringToBR(t.date)}</td>
            <td data-label="Tipo"><span class="status-badge ${t.type === 'income' ? 'done' : 'no_show'}">${t.type === 'income' ? 'Entrada' : 'Saída'}</span></td>
            <td data-label="Descrição">${t.description}</td>
            <td data-label="Categoria">${t.category}</td>
            <td data-label="Forma de Pagto">${t.paymentMethod.toUpperCase()}</td>
            <td data-label="Valor" class="${cssClass}" style="font-weight: 700;">${sign} ${formatCurrency(t.amount)}</td>
            <td data-label="Ação" style="text-align: right;">
                <button class="btn-card-action" onclick="deleteTransaction('${t.id}')" title="Excluir Transação">
                    <i class="fa-solid fa-trash-can text-danger"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // 3. Render HTML Custom Graphs (No canvas library needed, raw CSS layouts)
    renderServiceRevenueChart();
    renderPaymentMethodsChart();
}

function renderServiceRevenueChart() {
    const chartBox = document.getElementById('chart-service-revenue');
    chartBox.innerHTML = '';

    // Calculate revenue per service
    let serviceRevenue = {};
    data.services.forEach(s => {
        serviceRevenue[s.name] = 0;
    });

    data.appointments.filter(a => a.status === 'done' && a.paymentStatus === 'paid').forEach(a => {
        const srv = data.services.find(s => s.id === a.serviceId);
        if (srv) {
            serviceRevenue[srv.name] += srv.price;
        }
    });

    // Find max value to calibrate bar widths
    const maxVal = Math.max(...Object.values(serviceRevenue), 1);
    
    // Sort services by revenue
    const sortedServices = Object.entries(serviceRevenue).sort((a,b) => b[1] - a[1]);

    sortedServices.forEach(([name, val], index) => {
        const pct = Math.round((val / maxVal) * 100);
        // Colors gradient index-based
        const colors = ['var(--primary)', 'var(--info)', '#6366f1', 'var(--warning)', 'var(--success)'];
        const barColor = colors[index % colors.length];

        const row = document.createElement('div');
        row.className = 'chart-bar-row';
        row.innerHTML = `
            <div class="chart-bar-labels">
                <span>${name}</span>
                <strong>${formatCurrency(val)}</strong>
            </div>
            <div class="chart-bar-bg">
                <div class="chart-bar-fill" style="width: ${pct}%; background-color: ${barColor};"></div>
            </div>
        `;
        chartBox.appendChild(row);
    });
}

function renderPaymentMethodsChart() {
    const container = document.getElementById('chart-payment-methods');
    container.innerHTML = '';

    let payments = { pix: 0, cash: 0, credit_card: 0, debit_card: 0 };
    let totalPayments = 0;

    data.transactions.filter(t => t.type === 'income').forEach(t => {
        if (payments[t.paymentMethod] !== undefined) {
            payments[t.paymentMethod] += t.amount;
            totalPayments += t.amount;
        }
    });

    const labels = {
        pix: 'Pix',
        cash: 'Dinheiro',
        credit_card: 'Cartão de Crédito',
        debit_card: 'Cartão de Débito'
    };

    const colors = {
        pix: 'var(--success)',
        cash: 'var(--warning)',
        credit_card: 'var(--primary)',
        debit_card: 'var(--info)'
    };

    Object.entries(payments).forEach(([method, val]) => {
        const pct = totalPayments > 0 ? Math.round((val / totalPayments) * 100) : 0;
        
        const row = document.createElement('div');
        row.className = 'payment-method-row';
        row.innerHTML = `
            <span class="payment-method-label">
                <span class="payment-method-indicator" style="background-color: ${colors[method]};"></span>
                ${labels[method]} (${pct}%)
            </span>
            <strong>${formatCurrency(val)}</strong>
        `;
        container.appendChild(row);
    });
}

// Financial Add manual entries trigger
document.getElementById('btn-add-income').addEventListener('click', () => {
    openTransactionModal('income');
});

document.getElementById('btn-add-expense').addEventListener('click', () => {
    openTransactionModal('expense');
});

function openTransactionModal(type) {
    document.getElementById('trans-type').value = type;
    document.getElementById('transaction-modal-title').innerText = type === 'income' ? 'Registrar Entrada' : 'Registrar Saída';
    
    // Category select options depending on type
    const categorySelect = document.getElementById('trans-category');
    categorySelect.innerHTML = '';
    
    if (type === 'income') {
        categorySelect.innerHTML = `
            <option value="Serviço">Serviço</option>
            <option value="Produto">Venda de Produto</option>
            <option value="Outro">Outro</option>
        `;
    } else {
        categorySelect.innerHTML = `
            <option value="Aluguel">Aluguel</option>
            <option value="Estoque">Estoque / Suprimentos</option>
            <option value="Contas">Contas de Consumo</option>
            <option value="Comissão">Comissão de Parcerias</option>
            <option value="Marketing">Marketing / Tráfego</option>
            <option value="Outro">Outro</option>
        `;
    }

    document.getElementById('trans-date').value = getLocalDateString(currentSelectedDate);
    openModal('modal-transaction');
}

document.getElementById('form-transaction').addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('trans-type').value;
    const amount = parseFloat(document.getElementById('trans-amount').value);
    const date = document.getElementById('trans-date').value;
    const description = document.getElementById('trans-description').value;
    const category = document.getElementById('trans-category').value;
    const paymentMethod = document.getElementById('trans-method').value;

    const newTrans = {
        id: 'tr-' + Date.now(),
        type, amount, date, description, category, paymentMethod
    };

    data.transactions.push(newTrans);
    saveData(STATE_KEYS.TRANSACTIONS, data.transactions);
    showToast("Transação registrada!", "success");
    closeModal('modal-transaction');
    renderFinance();
});

function deleteTransaction(id) {
    if (confirm("Deseja realmente excluir esta transação?")) {
        data.transactions = data.transactions.filter(t => t.id !== id);
        saveData(STATE_KEYS.TRANSACTIONS, data.transactions);
        showToast("Transação excluída.", "warning");
        renderFinance();
    }
}

// --- 6. CONFIGURATIONS COMPONENT ---
function renderConfig() {
    // 1. Services Tab
    const servicesGrid = document.getElementById('services-config-grid');
    servicesGrid.innerHTML = '';
    
    data.services.forEach(srv => {
        const card = document.createElement('div');
        card.className = 'item-config-card';
        card.innerHTML = `
            <div class="item-config-header">
                <div>
                    <span class="item-config-title">${srv.name}</span>
                    <span class="item-config-subtitle"><i class="fa-regular fa-clock"></i> Duração: ${srv.duration} min</span>
                </div>
                <button class="btn btn-icon btn-sm" onclick="openEditService('${srv.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
            </div>
            <div class="item-config-meta">
                <span class="item-price-tag">${formatCurrency(srv.price)}</span>
                <span class="item-status-tag ${srv.active ? 'active' : 'inactive'}">${srv.active ? 'Ativo' : 'Inativo'}</span>
            </div>
        `;
        servicesGrid.appendChild(card);
    });

    // 2. Professionals Tab
    const profsGrid = document.getElementById('professionals-config-grid');
    profsGrid.innerHTML = '';

    data.professionals.forEach(prof => {
        const card = document.createElement('div');
        card.className = 'item-config-card';
        card.innerHTML = `
            <div class="item-config-header">
                <div>
                    <span class="item-config-title">${prof.name}</span>
                    <span class="item-config-subtitle"><i class="fa-solid fa-phone"></i> ${prof.phone}</span>
                </div>
                <button class="btn btn-icon btn-sm" onclick="openEditProfessional('${prof.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
            </div>
            <div class="item-config-meta">
                <span></span>
                <span class="item-status-tag ${prof.active ? 'active' : 'inactive'}">${prof.active ? 'Ativo' : 'Inativo'}</span>
            </div>
        `;
        profsGrid.appendChild(card);
    });

    // 3. Establishments Tab load fields
    document.getElementById('biz-name').value = data.businessInfo.name;
    document.getElementById('biz-slug').value = data.businessInfo.slug;
    document.getElementById('biz-phone').value = data.businessInfo.phone;
    document.getElementById('biz-instagram').value = data.businessInfo.instagram;
    document.getElementById('biz-address').value = data.businessInfo.address;
}

// Subnavigation within config tabs
const configTabButtons = document.querySelectorAll('.config-subnav button');
configTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        configTabButtons.forEach(b => b.classList.remove('btn-active'));
        btn.classList.add('btn-active');

        const targetTab = btn.getAttribute('data-config-tab');
        const contents = document.querySelectorAll('.config-tab-content');
        
        contents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(`config-tab-${targetTab}`);
        if (activeContent) {
            activeContent.style.display = 'block';
            activeContent.classList.add('active');
        }
    });
});

// Config Form Submissions
// Biz Info
document.getElementById('form-business-info').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('biz-name').value;
    const slug = document.getElementById('biz-slug').value.replace(/\s+/g, '-').toLowerCase(); // sanitise slug
    const phone = document.getElementById('biz-phone').value;
    const instagram = document.getElementById('biz-instagram').value;
    const address = document.getElementById('biz-address').value;

    data.businessInfo = { ...data.businessInfo, name, slug, phone, instagram, address };
    saveData(STATE_KEYS.BUSINESS_INFO, data.businessInfo);
    showToast("Dados do estabelecimento atualizados!", "success");
    
    // Update booking link label in Simulator
    document.getElementById('biz-link-url').innerText = `https://lexion.com.br/agendar/${slug}`;
});

// Services CRUD
document.getElementById('btn-add-service').addEventListener('click', () => {
    document.getElementById('service-id').value = '';
    document.getElementById('form-service').reset();
    document.getElementById('btn-delete-service').style.display = 'none';
    openModal('modal-service');
});

function openEditService(id) {
    const srv = data.services.find(s => s.id === id);
    if (!srv) return;

    document.getElementById('service-id').value = srv.id;
    document.getElementById('service-name').value = srv.name;
    document.getElementById('service-price').value = srv.price;
    document.getElementById('service-duration').value = srv.duration;
    document.getElementById('service-active').checked = srv.active;

    document.getElementById('btn-delete-service').style.display = 'block';
    openModal('modal-service');
}

document.getElementById('form-service').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('service-id').value;
    const name = document.getElementById('service-name').value;
    const price = parseFloat(document.getElementById('service-price').value);
    const duration = parseInt(document.getElementById('service-duration').value);
    const active = document.getElementById('service-active').checked;

    if (id) {
        const idx = data.services.findIndex(s => s.id === id);
        data.services[idx] = { id, name, price, duration, active };
        showToast("Serviço atualizado!", "success");
    } else {
        const newSrv = { id: 'srv-' + Date.now(), name, price, duration, active };
        data.services.push(newSrv);
        showToast("Serviço cadastrado com sucesso!", "success");
    }

    saveData(STATE_KEYS.SERVICES, data.services);
    closeModal('modal-service');
    renderConfig();
});

document.getElementById('btn-delete-service').addEventListener('click', () => {
    const id = document.getElementById('service-id').value;
    if (id) {
        data.services = data.services.filter(s => s.id !== id);
        saveData(STATE_KEYS.SERVICES, data.services);
        showToast("Serviço excluído.", "warning");
        closeModal('modal-service');
        renderConfig();
    }
});

// Professionals CRUD
document.getElementById('btn-add-professional').addEventListener('click', () => {
    document.getElementById('prof-id').value = '';
    document.getElementById('form-professional').reset();
    document.getElementById('btn-delete-professional').style.display = 'none';
    openModal('modal-professional');
});

function openEditProfessional(id) {
    const prof = data.professionals.find(p => p.id === id);
    if (!prof) return;

    document.getElementById('prof-id').value = prof.id;
    document.getElementById('prof-name').value = prof.name;
    document.getElementById('prof-phone').value = prof.phone;
    document.getElementById('prof-active').checked = prof.active;

    document.getElementById('btn-delete-professional').style.display = 'block';
    openModal('modal-professional');
}

document.getElementById('form-professional').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('prof-id').value;
    const name = document.getElementById('prof-name').value;
    const phone = document.getElementById('prof-phone').value;
    const active = document.getElementById('prof-active').checked;

    if (id) {
        const idx = data.professionals.findIndex(p => p.id === id);
        data.professionals[idx] = { id, name, phone, active };
        showToast("Profissional atualizado!", "success");
    } else {
        const newProf = { id: 'prof-' + Date.now(), name, phone, active };
        data.professionals.push(newProf);
        showToast("Profissional cadastrado!", "success");
    }

    saveData(STATE_KEYS.PROFESSIONALS, data.professionals);
    closeModal('modal-professional');
    renderConfig();
});

document.getElementById('btn-delete-professional').addEventListener('click', () => {
    const id = document.getElementById('prof-id').value;
    if (id) {
        data.professionals = data.professionals.filter(p => p.id !== id);
        saveData(STATE_KEYS.PROFESSIONALS, data.professionals);
        showToast("Profissional excluído.", "warning");
        closeModal('modal-professional');
        renderConfig();
    }
});


// --- 7. PUBLIC BOOKING LINK SIMULATOR ---
let simulationStep = 1;
let simSelection = {
    serviceId: '',
    profId: '',
    date: '',
    time: '',
    clientName: '',
    clientPhone: ''
};

// Copy link action helper
document.getElementById('btn-copy-link').addEventListener('click', () => {
    const url = document.getElementById('biz-link-url').innerText;
    navigator.clipboard.writeText(url).then(() => {
        showToast("Link copiado para a área de transferência!", "success");
    });
});

function initPhoneSimulator() {
    simulationStep = 1;
    simSelection = { serviceId: '', profId: '', date: '', time: '', clientName: '', clientPhone: '' };
    
    // Update link code text
    document.getElementById('biz-link-url').innerText = `https://lexion.com.br/agendar/${data.businessInfo.slug}`;
    
    renderPhoneScreen();
}

document.getElementById('btn-reset-phone').addEventListener('click', () => {
    initPhoneSimulator();
    showToast("Navegador simulado reiniciado.", "info");
});

function renderPhoneScreen() {
    const phoneScreen = document.getElementById('phone-booking-content');
    phoneScreen.innerHTML = '';

    // Step 1: Select Service
    if (simulationStep === 1) {
        phoneScreen.innerHTML = `
            <div class="pub-header">
                <div class="pub-logo">L</div>
                <h4 class="pub-title">${data.businessInfo.name}</h4>
                <p class="pub-subtitle"><i class="fa-solid fa-location-dot"></i> ${data.businessInfo.address}</p>
            </div>
            <div class="pub-section">
                <h5 class="pub-section-title">Passo 1: Selecione o Serviço</h5>
                <div class="pub-services-list">
                    ${data.services.filter(s => s.active).map(srv => `
                        <div class="pub-service-card ${simSelection.serviceId === srv.id ? 'selected' : ''}" onclick="selectSimService('${srv.id}')">
                            <div>
                                <span class="pub-service-name">${srv.name}</span>
                                <span class="pub-service-dur"><i class="fa-regular fa-clock"></i> ${srv.duration} min</span>
                            </div>
                            <span class="pub-service-price">${formatCurrency(srv.price)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Step 2: Select Professional
    else if (simulationStep === 2) {
        phoneScreen.innerHTML = `
            <div class="pub-header">
                <div class="pub-logo">L</div>
                <h4 class="pub-title">${data.businessInfo.name}</h4>
                <p class="pub-subtitle">Passo 2: Escolha o Profissional</p>
            </div>
            <div class="pub-section">
                <div class="pub-select-grid">
                    <!-- Option 1: Qualquer um (auto assign to first free) -->
                    <div class="pub-select-card ${simSelection.profId === 'any' ? 'selected' : ''}" onclick="selectSimProf('any')">
                        <div class="pub-logo" style="width:36px; height:36px; font-size:14px; margin-bottom:6px;"><i class="fa-solid fa-users"></i></div>
                        <span class="pub-select-name">Qualquer Um</span>
                    </div>
                    ${data.professionals.filter(p => p.active).map(prof => `
                        <div class="pub-select-card ${simSelection.profId === prof.id ? 'selected' : ''}" onclick="selectSimProf('${prof.id}')">
                            <div class="pub-logo" style="width:36px; height:36px; font-size:14px; margin-bottom:6px; background: #64748b;"><i class="fa-solid fa-user"></i></div>
                            <span class="pub-select-name">${prof.name.split(' ')[0]}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-secondary btn-sm btn-full" onclick="changeSimStep(1)" style="margin-top: 15px;"><i class="fa-solid fa-chevron-left"></i> Voltar</button>
            </div>
        `;
    }
    
    // Step 3: Date & Time selection
    else if (simulationStep === 3) {
        // compute availability grid
        // default working hours are 9:00 to 19:00, 30 min increments.
        // filter out slots where professional has existing booking
        const activeProfs = data.professionals.filter(p => p.active);
        const assignedProf = simSelection.profId === 'any' ? activeProfs[0] : activeProfs.find(p => p.id === simSelection.profId);
        
        let availableSlots = [];
        const testDate = simSelection.date || getLocalDateString(currentSelectedDate);
        
        if (assignedProf) {
            // Generate slots
            for (let hour = 9; hour < 19; hour++) {
                ['00', '30'].forEach(min => {
                    const slotTime = `${String(hour).padStart(2,'0')}:${min}`;
                    // verify conflict
                    const hasConflict = data.appointments.find(a => 
                        a.profId === assignedProf.id && 
                        a.date === testDate && 
                        a.time === slotTime && 
                        a.status !== 'cancelled'
                    );
                    
                    availableSlots.push({ time: slotTime, available: !hasConflict });
                });
            }
        }

        phoneScreen.innerHTML = `
            <div class="pub-header">
                <div class="pub-logo">L</div>
                <h4 class="pub-title">${data.businessInfo.name}</h4>
                <p class="pub-subtitle">Passo 3: Data e Horário</p>
            </div>
            <div class="pub-section">
                <div class="form-group" style="margin-bottom:12px;">
                    <label style="color:#94a3b8; font-size:10px;">SELECIONE A DATA:</label>
                    <input type="date" id="pub-sim-date" class="pub-input" value="${testDate}" onchange="changeSimDate(this.value)">
                </div>
                <h5 class="pub-section-title" style="margin-bottom:8px;">Horários Disponíveis:</h5>
                <div class="pub-slots-grid">
                    ${availableSlots.map(slot => `
                        <button class="pub-slot-btn ${simSelection.time === slot.time ? 'selected' : ''} ${!slot.available ? 'disabled' : ''}" 
                                ${!slot.available ? 'disabled' : ''} 
                                onclick="selectSimTime('${slot.time}')">
                            ${slot.time}
                        </button>
                    `).join('')}
                </div>
                <div style="display:flex; gap:8px; margin-top: 15px;">
                    <button class="btn btn-secondary btn-sm flex-1" onclick="changeSimStep(2)"><i class="fa-solid fa-chevron-left"></i> Voltar</button>
                    <button class="btn btn-primary btn-sm flex-1" onclick="submitSimDateTimeStep()" ${!simSelection.time ? 'disabled' : ''}>Avançar <i class="fa-solid fa-chevron-right"></i></button>
                </div>
            </div>
        `;
    }
    
    // Step 4: Client contact details
    else if (simulationStep === 4) {
        phoneScreen.innerHTML = `
            <div class="pub-header">
                <div class="pub-logo">L</div>
                <h4 class="pub-title">${data.businessInfo.name}</h4>
                <p class="pub-subtitle">Passo 4: Seus dados</p>
            </div>
            <div class="pub-section">
                <form class="pub-form" onsubmit="submitSimBooking(event)">
                    <div class="form-group">
                        <label style="color:#94a3b8; font-size:10px;">SEU NOME COMPLETO:</label>
                        <input type="text" class="pub-input" id="pub-sim-name" placeholder="Ex: Rogério Ceni" required value="${simSelection.clientName}">
                    </div>
                    <div class="form-group" style="margin-bottom:12px;">
                        <label style="color:#94a3b8; font-size:10px;">SEU WHATSAPP:</label>
                        <input type="text" class="pub-input" id="pub-sim-phone" placeholder="Ex: (11) 98888-7777" required value="${simSelection.clientPhone}">
                    </div>
                    <button type="submit" class="pub-btn-submit">Confirmar Agendamento <i class="fa-solid fa-check"></i></button>
                </form>
                <button class="btn btn-secondary btn-sm btn-full" onclick="changeSimStep(3)" style="margin-top: 15px;"><i class="fa-solid fa-chevron-left"></i> Voltar</button>
            </div>
        `;
    }

    // Step 5: Success screen
    else if (simulationStep === 5) {
        const srv = data.services.find(s => s.id === simSelection.serviceId) || {name: 'Serviço'};
        const activeProfs = data.professionals.filter(p => p.active);
        const assignedProf = simSelection.profId === 'any' ? activeProfs[0] : activeProfs.find(p => p.id === simSelection.profId);

        phoneScreen.innerHTML = `
            <div class="pub-success-screen">
                <div class="success-icon-wrapper">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h4 class="success-title">Agendado com Sucesso!</h4>
                <p class="success-desc">Seu horário foi reservado e inserido na agenda da barbearia. Não é necessária nenhuma outra ação.</p>
                
                <div class="pub-summary-box">
                    <div class="pub-summary-row">
                        <span class="pub-summary-label">Serviço:</span>
                        <span class="pub-summary-val">${srv.name}</span>
                    </div>
                    <div class="pub-summary-row">
                        <span class="pub-summary-label">Profissional:</span>
                        <span class="pub-summary-val">${assignedProf ? assignedProf.name : 'Qualquer Um'}</span>
                    </div>
                    <div class="pub-summary-row">
                        <span class="pub-summary-label">Data:</span>
                        <span class="pub-summary-val">${formatDateStringToBR(simSelection.date)}</span>
                    </div>
                    <div class="pub-summary-row">
                        <span class="pub-summary-label">Horário:</span>
                        <span class="pub-summary-val">${simSelection.time}h</span>
                    </div>
                    <div class="pub-summary-row" style="border-top:1px dashed rgba(255,255,255,0.08); padding-top:8px; margin-top:8px;">
                        <span class="pub-summary-label">Valor:</span>
                        <span class="pub-summary-val" style="color:var(--success);">${formatCurrency(srv.price)}</span>
                    </div>
                </div>

                <button class="pub-btn-submit btn-full" onclick="resetSimToStep1()">Novo Agendamento</button>
            </div>
        `;
    }
}

// Phone interaction routing functions (must be global to match string HTML events)
window.selectSimService = function(id) {
    simSelection.serviceId = id;
    simulationStep = 2;
    renderPhoneScreen();
};

window.selectSimProf = function(id) {
    simSelection.profId = id;
    simulationStep = 3;
    renderPhoneScreen();
};

window.changeSimStep = function(step) {
    simulationStep = step;
    renderPhoneScreen();
};

window.changeSimDate = function(val) {
    simSelection.date = val;
    simSelection.time = ''; // Reset selected slot
    renderPhoneScreen();
};

window.selectSimTime = function(timeStr) {
    simSelection.time = timeStr;
    renderPhoneScreen();
};

window.submitSimDateTimeStep = function() {
    if (!simSelection.date) {
        simSelection.date = getLocalDateString(currentSelectedDate);
    }
    simulationStep = 4;
    renderPhoneScreen();
};

window.submitSimBooking = function(event) {
    event.preventDefault();
    
    const name = document.getElementById('pub-sim-name').value;
    const phone = document.getElementById('pub-sim-phone').value;
    
    simSelection.clientName = name;
    simSelection.clientPhone = phone;

    // 1. Check or Create Client in DB
    let client = data.clients.find(c => c.phone === phone);
    if (!client) {
        client = {
            id: 'cli-' + Date.now(),
            name: name,
            phone: phone,
            instagram: '',
            birth: '',
            frequency: 30,
            lastVisit: simSelection.date,
            notes: 'Cliente cadastrado automaticamente pelo link público.'
        };
        data.clients.push(client);
        saveData(STATE_KEYS.CLIENTS, data.clients);
    }

    // 2. Assign professional if 'any' selected
    const activeProfs = data.professionals.filter(p => p.active);
    const profId = simSelection.profId === 'any' ? activeProfs[0].id : simSelection.profId;

    // 3. Create Appointment
    const newAppt = {
        id: 'appt-' + Date.now(),
        clientId: client.id,
        serviceId: simSelection.serviceId,
        profId: profId,
        date: simSelection.date,
        time: simSelection.time,
        status: 'scheduled',
        paymentStatus: 'pending',
        notes: 'Agendado pelo link público do cliente.'
    };
    
    data.appointments.push(newAppt);
    saveData(STATE_KEYS.APPOINTMENTS, data.appointments);

    // 4. Create Lead conversion in Kanban
    const newLead = {
        id: 'lead-' + Date.now(),
        name: name,
        phone: phone,
        source: 'website',
        stage: 'scheduled',
        notes: `Agendou corte automático para dia ${formatDateStringToBR(simSelection.date)} às ${simSelection.time}h.`,
        date: getLocalDateString(new Date())
    };
    data.leads.push(newLead);
    saveData(STATE_KEYS.LEADS, data.leads);

    // 5. Advance simulator screen to success
    simulationStep = 5;
    renderPhoneScreen();

    // 6. Alert admin with Toast
    showToast(`Novo agendamento recebido pelo link! (${name})`, 'success');
};

window.resetSimToStep1 = function() {
    initPhoneSimulator();
};

// --- INITIALIZER ON LOAD ---
window.addEventListener('DOMContentLoaded', () => {
    initMockDatabase();
    loadData();
    initNavigation();
    initModals();
    
    // Set display header date
    document.getElementById('current-date-display').querySelector('span').innerText = formatDateDisplay(currentSelectedDate);
    
    // Set document initial render
    renderDashboard();
    
    showToast("Bem-vindo ao protótipo da Barbearia Lexion!", "info");
});
