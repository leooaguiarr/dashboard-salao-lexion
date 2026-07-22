// ==========================================
// CONFIGURAÇÃO DO SUPABASE (Fixa no código)
// ==========================================
// Substitua pelos valores do SEU projeto Supabase:
// Painel > Project Settings > API
const SUPABASE_URL = 'https://awrslpvpwazdjyaeogdc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cnNscHZwd2F6ZGp5YWVvZ2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4ODM3NzYsImV4cCI6MjA5OTQ1OTc3Nn0.vsGEDXvjAVgsRDrO-Z9njNx86-9n3ve0HTKgr4JhjZM';

// ==========================================
// Cliente Supabase e estado de autenticação
// ==========================================
let supabaseClient = null;
let authSession = null;

// Inicializa o cliente Supabase (chamado uma vez ao carregar a página)
function initSupabase() {
    if (typeof window.supabase !== 'undefined' && SUPABASE_URL !== 'https://SEU-PROJETO.supabase.co') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
}

const DataService = {
    // -------------------------
    // AUTENTICAÇÃO
    // -------------------------
    async init() {
        initSupabase();
        if (supabaseClient) {
            const { data, error } = await supabaseClient.auth.getSession();
            if (data && data.session) {
                authSession = data.session;
            }
        }
    },

    async login(email, password) {
        if (!supabaseClient) throw new Error("Supabase não configurado. Verifique a URL e a Anon Key no arquivo api.js.");
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        authSession = data.session;
        return data.user;
    },

    async logout() {
        if (supabaseClient) {
            await supabaseClient.auth.signOut();
        }
        authSession = null;
    },

    isAuthenticated() {
        return authSession != null;
    },

    isSupabaseConfigured() {
        return supabaseClient != null;
    },

    // Retorna o user_id do usuário logado (para inserir nos registros)
    getUserId() {
        return authSession?.user?.id || null;
    },

    getUserEmail() {
        return authSession?.user?.email || null;
    },

    // -------------------------
    // DADOS (CRUD)
    // -------------------------
    async loadAll(keys) {
        if (supabaseClient && this.isAuthenticated()) {
            // Busca dados da Nuvem (RLS filtra automaticamente pelo user_id)
            const results = await Promise.all([
                supabaseClient.from('services').select('*'),
                supabaseClient.from('professionals').select('*'),
                supabaseClient.from('clients').select('*'),
                supabaseClient.from('appointments').select('*'),
                supabaseClient.from('leads').select('*'),
                supabaseClient.from('transactions').select('*'),
                supabaseClient.from('business_info').select('*').limit(1)
            ]);

            // Erros do Supabase não são exceções: vêm no campo .error de
            // cada resposta. Sem esta checagem, falhas passam em silêncio.
            const failed = results.find(r => r.error);
            if (failed) {
                console.error("Erro ao carregar dados da nuvem:", failed.error);
                window.showToast?.("Erro ao carregar dados da nuvem: " + failed.error.message, "danger");
            }

            const [services, professionals, clients, appointments, leads, transactions, businessInfoArr] =
                results.map(r => r.data);

            return {
                services: services || [],
                professionals: professionals || [],
                clients: clients || [],
                appointments: appointments || [],
                leads: leads || [],
                transactions: transactions || [],
                businessInfo: (businessInfoArr && businessInfoArr[0]) || {},
                automationRules: JSON.parse(localStorage.getItem(keys.AUTOMATION_RULES)) || [],
                messageJobs: JSON.parse(localStorage.getItem(keys.MESSAGE_JOBS)) || []
            };
        } else {
            // Fallback: Local Storage (modo offline/demo)
            const get = (key) => JSON.parse(localStorage.getItem(key));
            return {
                services: get(keys.SERVICES) || [],
                professionals: get(keys.PROFESSIONALS) || [],
                clients: get(keys.CLIENTS) || [],
                appointments: get(keys.APPOINTMENTS) || [],
                leads: get(keys.LEADS) || [],
                transactions: get(keys.TRANSACTIONS) || [],
                businessInfo: get(keys.BUSINESS_INFO) || {},
                automationRules: get(keys.AUTOMATION_RULES) || [],
                messageJobs: get(keys.MESSAGE_JOBS) || []
            };
        }
    },

    async save(key, value) {
        if (supabaseClient && this.isAuthenticated()) {
            try {
                const keyToTable = {
                    'lexion_services': 'services',
                    'lexion_professionals': 'professionals',
                    'lexion_clients': 'clients',
                    'lexion_appointments': 'appointments',
                    'lexion_leads': 'leads',
                    'lexion_transactions': 'transactions',
                    'lexion_business_info': 'business_info'
                };

                const tableName = keyToTable[key];
                if (tableName) {
                    const userId = this.getUserId();
                    let error = null;
                    if (tableName === 'business_info' && typeof value === 'object' && !Array.isArray(value)) {
                        // Apenas envia colunas que existem na tabela do Supabase.
                        // Campos extras (ex: whatsappBookingMessage) ficam somente no localStorage.
                        const allowedCols = ['id','user_id','name','slug','phone','instagram','address','hours','whatsappRecallMessage','created_at','avatarUrl'];
                        const biz = { user_id: userId };
                        for (const col of allowedCols) {
                            if (value[col] !== undefined) biz[col] = value[col];
                        }
                        if (!biz.id) biz.id = undefined; // let DB generate UUID
                        ({ error } = await supabaseClient.from('business_info').upsert(biz, { onConflict: 'user_id' }));
                    } else if (Array.isArray(value)) {
                        // Injeta user_id em cada item antes de upsert
                        const withUserId = value.map(item => ({ ...item, user_id: userId }));
                        if (withUserId.length > 0) {
                            ({ error } = await supabaseClient.from(tableName).upsert(withUserId));
                        }
                    }
                    // Erros do Supabase vêm no retorno, não como exceção
                    if (error) throw error;
                }
            } catch (err) {
                console.error("Erro salvando no Supabase:", err);
                window.showToast?.("Erro ao salvar na nuvem: " + (err.message || err), "danger");
            }
        }

        // Sempre mantém cópia local para performance
        localStorage.setItem(key, JSON.stringify(value));
    },

    // Migração inicial: envia dados locais para a nuvem
    async migrateToCloud(localData) {
        if (!supabaseClient || !this.isAuthenticated()) throw new Error("Não autenticado.");
        const userId = this.getUserId();

        const addUserId = (arr) => arr.map(item => ({ ...item, user_id: userId }));
        // Erros do Supabase vêm no retorno, não como exceção — converte
        // em exceção para o botão de migração exibir a falha
        const run = async (promise, table) => {
            const { error } = await promise;
            if (error) throw new Error(`${table}: ${error.message}`);
        };

        if (localData.businessInfo && localData.businessInfo.name) {
            const allowedCols = ['id','user_id','name','slug','phone','instagram','address','hours','whatsappRecallMessage','created_at','avatarUrl'];
            const biz = { user_id: userId };
            for (const col of allowedCols) {
                if (localData.businessInfo[col] !== undefined) biz[col] = localData.businessInfo[col];
            }
            if (!biz.id) biz.id = undefined;
            await run(supabaseClient.from('business_info').upsert(biz, { onConflict: 'user_id' }), 'business_info');
        }
        if (localData.services.length) await run(supabaseClient.from('services').upsert(addUserId(localData.services)), 'services');
        if (localData.professionals.length) await run(supabaseClient.from('professionals').upsert(addUserId(localData.professionals)), 'professionals');
        if (localData.clients.length) await run(supabaseClient.from('clients').upsert(addUserId(localData.clients)), 'clients');
        if (localData.appointments.length) await run(supabaseClient.from('appointments').upsert(addUserId(localData.appointments)), 'appointments');
        if (localData.leads.length) await run(supabaseClient.from('leads').upsert(addUserId(localData.leads)), 'leads');
        if (localData.transactions.length) await run(supabaseClient.from('transactions').upsert(addUserId(localData.transactions)), 'transactions');
    },

    // -------------------------
    // LINK PÚBLICO DE AGENDAMENTO (sem login)
    // As duas funções chamam RPCs no Supabase criadas por
    // docs/public_booking_setup.sql
    // -------------------------

    // Retorna { businessInfo, services, professionals, bookedSlots }
    // ou null se o slug não existir
    async getPublicSalon(slug) {
        if (!supabaseClient) return null;
        const { data, error } = await supabaseClient.rpc('get_public_salon', { p_slug: slug });
        if (error) throw error;
        return data;
    },

    // Retorna true se o telefone já existe, false se é novo cliente
    async checkPublicClientExists(slug, phone) {
        if (!supabaseClient) return false;
        const { data, error } = await supabaseClient.rpc('check_client_exists', { p_slug: slug, p_phone: phone });
        if (error) {
            console.error("Erro ao checar cliente público:", error);
            return false;
        }
        return data;
    },

    // Grava cliente + agendamento + lead na conta do salão dono do slug.
    // Retorna { ok: true, appointmentId, profId } ou { ok: false, error }
    async createPublicBooking(slug, booking) {
        if (!supabaseClient) throw new Error("Supabase não configurado.");
        const { data, error } = await supabaseClient.rpc('create_public_booking', {
            p_slug: slug,
            p_name: booking.name,
            p_phone: booking.phone,
            p_service_id: booking.serviceId,
            p_prof_id: booking.profId,
            p_date: booking.date,
            p_time: booking.time,
            p_birth: booking.birth || null
        });
        if (error) throw error;
        return data;
    },

    async upsertItem(table, item) {
        if (supabaseClient && this.isAuthenticated()) {
            const withUser = { ...item, user_id: this.getUserId() };
            const { error } = await supabaseClient.from(table).upsert(withUser);
            if (error) throw error;
        }
    },

    async deleteItem(table, id) {
        if (supabaseClient && this.isAuthenticated()) {
            const { error } = await supabaseClient.from(table).delete().eq('id', id);
            if (error) throw error;
        }
    }
};
