import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabaseService } from './services/supabaseService';

export type Client = {
  id: string;
  name: string;
  document?: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address: string;
  notes?: string;
};

export type ChecklistItem = {
  id: string;
  task: string;
  category: string;
  clientId?: string; // Legacy: If undefined, it's a global checklist item
  clientIds?: string[]; // New: Array of client IDs. If empty or undefined, and clientId is also undefined, it's global.
};

export type TicketType = 'PREVENTIVA' | 'CORRETIVA';

export type TicketStatus = 'APROVADO' | 'AGUARDANDO_MATERIAL' | 'REALIZANDO' | 'CONCLUIDO';

export type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Quote = {
  id: string;
  clientId: string;
  date: string;
  items: QuoteItem[];
  totalValue: number;
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED';
};

export type Receipt = {
  id: string;
  clientId: string;
  date: string;
  value: number;
  description: string;
};

export type Cost = {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
};

export type Appointment = {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'TICKET' | 'MEETING' | 'OTHER';
  ticketId?: string;
  notes?: string;
};

export type Ticket = {
  id: string;
  osNumber?: string;
  title?: string;
  type: TicketType;
  status?: TicketStatus;
  maintenanceCategory?: string;
  maintenanceSubcategory?: string;
  clientId: string;
  date: string;
  technician: string;
  observations: string;
  
  // Corretiva fields
  reportedProblem?: string;
  productsForQuote?: string;
  serviceReport?: string;
  
  // Preventiva fields
  checklistResults?: {
    taskId: string;
    status: 'OK' | 'NOK' | 'NA';
    notes: string;
  }[];
  images?: string[];
};

export type CompanyData = {
  name: string;
  document: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
};

export type Product = {
  id: string;
  code?: string;
  name: string;
  description?: string;
  price: number;
  unit?: string;
};

interface AppState {
  clients: Client[];
  checklistItems: ChecklistItem[];
  tickets: Ticket[];
  quotes: Quote[];
  receipts: Receipt[];
  costs: Cost[];
  appointments: Appointment[];
  products: Product[];
  companyLogo: string | null;
  companySignature: string | null;
  companyData: CompanyData | null;
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  menuOrder: string[];
  isLoading: boolean;
  
  fetchInitialData: () => Promise<void>;
  setCompanyLogo: (logo: string | null) => void;
  setCompanySignature: (signature: string | null) => void;
  setCompanyData: (data: CompanyData) => void;
  setMenuOrder: (order: string[]) => void;
  toggleTheme: () => void;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Omit<Client, 'id'>) => void;
  deleteClient: (id: string) => void;
  
  addChecklistItem: (item: Omit<ChecklistItem, 'id'>) => void;
  updateChecklistItem: (id: string, item: Omit<ChecklistItem, 'id'>) => void;
  deleteChecklistItem: (id: string) => void;
  
  addTicket: (ticket: Omit<Ticket, 'id'>) => void;
  updateTicket: (id: string, ticket: Omit<Ticket, 'id'>) => void;
  deleteTicket: (id: string) => void;

  addQuote: (quote: Omit<Quote, 'id'>) => void;
  updateQuote: (id: string, quote: Omit<Quote, 'id'>) => void;
  deleteQuote: (id: string) => void;

  addReceipt: (receipt: Omit<Receipt, 'id'>) => void;
  deleteReceipt: (id: string) => void;

  addCost: (cost: Omit<Cost, 'id'>) => void;
  deleteCost: (id: string) => void;

  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Omit<Appointment, 'id'>) => void;
  deleteAppointment: (id: string) => void;

  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  importProducts: (products: Omit<Product, 'id'>[]) => void;
  restoreData: (data: Partial<AppState>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      clients: [],
      checklistItems: [
        { id: uuidv4(), task: 'Verificar extintores', category: 'Segurança' },
        { id: uuidv4(), task: 'Limpeza da caixa d\'água', category: 'Hidráulica' },
        { id: uuidv4(), task: 'Revisão do quadro elétrico', category: 'Elétrica' },
        { id: uuidv4(), task: 'Lubrificação de portões', category: 'Mecânica' },
      ],
      tickets: [],
      quotes: [],
      receipts: [],
      costs: [],
      appointments: [],
      products: [],
      companyLogo: null,
      companySignature: null,
      companyData: null,
      theme: 'light',
      isAuthenticated: false,
      menuOrder: ['dashboard', 'clients', 'products', 'tickets', 'kanban', 'quotes', 'receipts', 'financial', 'calendar', 'settings'],
      isLoading: false,
      
      fetchInitialData: async () => {
        set({ isLoading: true });
        try {
          const [clients, products, checklistItems, tickets, quotes, receipts, costs, appointments, settings] = await Promise.all([
            supabaseService.getClients(),
            supabaseService.getProducts(),
            supabaseService.getChecklistItems(),
            supabaseService.getTickets(),
            supabaseService.getQuotes(),
            supabaseService.getReceipts(),
            supabaseService.getCosts(),
            supabaseService.getAppointments(),
            supabaseService.getCompanySettings()
          ]);

          set({
            clients,
            products,
            checklistItems,
            tickets,
            quotes,
            receipts,
            costs,
            appointments,
            companyData: settings?.data || null,
            companyLogo: settings?.logo || null,
            companySignature: settings?.signature || null
          });
        } catch (error) {
          console.error('Error fetching initial data from Supabase:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      setCompanyLogo: async (logo) => {
        set({ companyLogo: logo });
        const state = (useStore.getState() as AppState);
        if (state.companyData) {
          await supabaseService.saveCompanySettings(state.companyData, logo, state.companySignature);
        }
      },
      setCompanySignature: async (signature) => {
        set({ companySignature: signature });
        const state = (useStore.getState() as AppState);
        if (state.companyData) {
          await supabaseService.saveCompanySettings(state.companyData, state.companyLogo, signature);
        }
      },
      setCompanyData: async (data) => {
        set({ companyData: data });
        const state = (useStore.getState() as AppState);
        await supabaseService.saveCompanySettings(data, state.companyLogo, state.companySignature);
      },
      setMenuOrder: (order) => set({ menuOrder: order }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      login: (user, pass) => {
        if (user === 'admin' && pass === '123') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      
      addClient: async (client) => {
        const newClient = { ...client, id: uuidv4() };
        set((state) => ({ clients: [...state.clients, newClient] }));
        await supabaseService.saveClient(newClient);
      },
      updateClient: async (id, updatedClient) => {
        const client = { ...updatedClient, id };
        set((state) => ({
          clients: state.clients.map(c => c.id === id ? client : c)
        }));
        await supabaseService.saveClient(client);
      },
      deleteClient: async (id) => {
        set((state) => ({ clients: state.clients.filter(c => c.id !== id) }));
        await supabaseService.deleteClient(id);
      },
      
      addChecklistItem: async (item) => {
        const newItem = { ...item, id: uuidv4() };
        set((state) => ({ checklistItems: [...state.checklistItems, newItem] }));
        await supabaseService.saveChecklistItem(newItem);
      },
      updateChecklistItem: async (id, updatedItem) => {
        const item = { ...updatedItem, id };
        set((state) => ({
          checklistItems: state.checklistItems.map(i => i.id === id ? item : i)
        }));
        await supabaseService.saveChecklistItem(item);
      },
      deleteChecklistItem: async (id) => {
        set((state) => ({ checklistItems: state.checklistItems.filter(i => i.id !== id) }));
        await supabaseService.deleteChecklistItem(id);
      },
      
      addTicket: async (ticket) => {
        const state = (useStore.getState() as AppState);
        let maxOs = 0;
        state.tickets.forEach(t => {
          if (t.osNumber && t.osNumber.startsWith('OS-')) {
            const num = parseInt(t.osNumber.replace('OS-', ''), 10);
            if (!isNaN(num) && num > maxOs) {
              maxOs = num;
            }
          }
        });
        const nextOsNumber = `OS-${String(maxOs + 1).padStart(4, '0')}`;
        const newTicket = { ...ticket, id: uuidv4(), osNumber: ticket.osNumber || nextOsNumber };
        set((state) => ({ tickets: [...state.tickets, newTicket] }));
        await supabaseService.saveTicket(newTicket);
      },
      updateTicket: async (id, updatedTicket) => {
        const ticket = { ...updatedTicket, id };
        set((state) => ({
          tickets: state.tickets.map(t => t.id === id ? ticket : t)
        }));
        await supabaseService.saveTicket(ticket);
      },
      deleteTicket: async (id) => {
        set((state) => ({ tickets: state.tickets.filter(t => t.id !== id) }));
        await supabaseService.deleteTicket(id);
      },

      addQuote: async (quote) => {
        const newQuote = { ...quote, id: uuidv4() };
        set((state) => ({ quotes: [...state.quotes, newQuote] }));
        await supabaseService.saveQuote(newQuote);
      },
      updateQuote: async (id, updatedQuote) => {
        const quote = { ...updatedQuote, id };
        set((state) => ({
          quotes: state.quotes.map(q => q.id === id ? quote : q)
        }));
        await supabaseService.saveQuote(quote);
      },
      deleteQuote: async (id) => {
        set((state) => ({ quotes: state.quotes.filter(q => q.id !== id) }));
        await supabaseService.deleteQuote(id);
      },

      addReceipt: async (receipt) => {
        const newReceipt = { ...receipt, id: uuidv4() };
        set((state) => ({ receipts: [...state.receipts, newReceipt] }));
        await supabaseService.saveReceipt(newReceipt);
      },
      deleteReceipt: async (id) => {
        set((state) => ({ receipts: state.receipts.filter(r => r.id !== id) }));
        await supabaseService.deleteReceipt(id);
      },

      addCost: async (cost) => {
        const newCost = { ...cost, id: uuidv4() };
        set((state) => ({ costs: [...state.costs, newCost] }));
        await supabaseService.saveCost(newCost);
      },
      deleteCost: async (id) => {
        set((state) => ({ costs: state.costs.filter(c => c.id !== id) }));
        await supabaseService.deleteCost(id);
      },

      addAppointment: async (appointment) => {
        const newAppointment = { ...appointment, id: uuidv4() };
        set((state) => ({ appointments: [...state.appointments, newAppointment] }));
        await supabaseService.saveAppointment(newAppointment);
      },
      updateAppointment: async (id, updatedAppointment) => {
        const appointment = { ...updatedAppointment, id };
        set((state) => ({
          appointments: state.appointments.map(a => a.id === id ? appointment : a)
        }));
        await supabaseService.saveAppointment(appointment);
      },
      deleteAppointment: async (id) => {
        set((state) => ({ appointments: state.appointments.filter(a => a.id !== id) }));
        await supabaseService.deleteAppointment(id);
      },

      addProduct: async (product) => {
        const newProduct = { ...product, id: uuidv4() };
        set((state) => ({ products: [...state.products, newProduct] }));
        await supabaseService.saveProduct(newProduct);
      },
      updateProduct: async (id, updatedProduct) => {
        const product = { ...updatedProduct, id };
        set((state) => ({
          products: state.products.map(p => p.id === id ? product : p)
        }));
        await supabaseService.saveProduct(product);
      },
      deleteProduct: async (id) => {
        set((state) => ({ products: state.products.filter(p => p.id !== id) }));
        await supabaseService.deleteProduct(id);
      },
      importProducts: async (newProducts) => {
        const productsWithIds = newProducts.map(p => ({ ...p, id: uuidv4() }));
        set((state) => ({ 
          products: [...state.products, ...productsWithIds]
        }));
        for (const p of productsWithIds) {
          await supabaseService.saveProduct(p);
        }
      },
      restoreData: (data) => set((state) => ({
        ...state,
        ...data,
        // Ensure we don't accidentally overwrite functions if they were included in JSON
        clients: data.clients || state.clients,
        checklistItems: data.checklistItems || state.checklistItems,
        tickets: data.tickets || state.tickets,
        quotes: data.quotes || state.quotes,
        receipts: data.receipts || state.receipts,
        costs: data.costs || state.costs,
        appointments: data.appointments || state.appointments,
        products: data.products || state.products,
        companyLogo: data.companyLogo !== undefined ? data.companyLogo : state.companyLogo,
        companySignature: data.companySignature !== undefined ? data.companySignature : state.companySignature,
        companyData: data.companyData !== undefined ? data.companyData : state.companyData,
        theme: data.theme || state.theme,
        menuOrder: data.menuOrder || state.menuOrder,
      })),
    }),
    {
      name: 'manutencao-storage',
    }
  )
);
