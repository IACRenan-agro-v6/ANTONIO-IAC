import { supabase } from '../lib/supabase';
import { Client, Product, Ticket, Quote, Receipt, Cost, Appointment, ChecklistItem, CompanyData } from '../store';

export const supabaseService = {
  // Clients
  async getClients() {
    try {
      const { data, error } = await supabase.from('clients').select('*');
      if (error) {
        if (error.code === '42P01') return []; // Table doesn't exist
        throw error;
      }
      return data.map(c => ({
        id: c.id,
        name: c.name,
        document: c.document,
        contactPerson: c.contact_person,
        phone: c.phone,
        email: c.email,
        address: c.address,
        notes: c.notes
      })) as Client[];
    } catch (e) {
      console.error('Error fetching clients:', e);
      return [];
    }
  },

  async saveClient(client: Client) {
    const { error } = await supabase.from('clients').upsert({
      id: client.id,
      name: client.name,
      document: client.document,
      contact_person: client.contactPerson,
      phone: client.phone,
      email: client.email,
      address: client.address,
      notes: client.notes
    });
    if (error) throw error;
  },

  async deleteClient(id: string) {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  },

  // Products
  async getProducts() {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data as Product[];
    } catch (e) {
      console.error('Error fetching products:', e);
      return [];
    }
  },

  async saveProduct(product: Product) {
    const { error } = await supabase.from('products').upsert(product);
    if (error) throw error;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  // Tickets
  async getTickets() {
    try {
      const { data, error } = await supabase.from('tickets').select('*');
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data.map(t => ({
        id: t.id,
        osNumber: t.os_number,
        title: t.title,
        type: t.type,
        status: t.status,
        maintenanceCategory: t.maintenance_category,
        maintenanceSubcategory: t.maintenance_subcategory,
        clientId: t.client_id,
        date: t.date,
        technician: t.technician,
        observations: t.observations,
        reportedProblem: t.reported_problem,
        productsForQuote: t.products_for_quote,
        serviceReport: t.service_report,
        checklistResults: t.checklist_results,
        images: t.images
      })) as Ticket[];
    } catch (e) {
      console.error('Error fetching tickets:', e);
      return [];
    }
  },

  async saveTicket(ticket: Ticket) {
    const { error } = await supabase.from('tickets').upsert({
      id: ticket.id,
      os_number: ticket.osNumber,
      title: ticket.title,
      type: ticket.type,
      status: ticket.status,
      maintenance_category: ticket.maintenanceCategory,
      maintenance_subcategory: ticket.maintenanceSubcategory,
      client_id: ticket.clientId,
      date: ticket.date,
      technician: ticket.technician,
      observations: ticket.observations,
      reported_problem: ticket.reportedProblem,
      products_for_quote: ticket.productsForQuote,
      service_report: ticket.serviceReport,
      checklist_results: ticket.checklistResults,
      images: ticket.images
    });
    if (error) throw error;
  },

  async deleteTicket(id: string) {
    const { error } = await supabase.from('tickets').delete().eq('id', id);
    if (error) throw error;
  },

  // Quotes
  async getQuotes() {
    try {
      const { data, error } = await supabase.from('quotes').select('*');
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data.map(q => ({
        id: q.id,
        clientId: q.client_id,
        date: q.date,
        totalValue: q.total_value,
        status: q.status,
        items: q.items
      })) as Quote[];
    } catch (e) {
      console.error('Error fetching quotes:', e);
      return [];
    }
  },

  async saveQuote(quote: Quote) {
    const { error } = await supabase.from('quotes').upsert({
      id: quote.id,
      client_id: quote.clientId,
      date: quote.date,
      total_value: quote.totalValue,
      status: quote.status,
      items: quote.items
    });
    if (error) throw error;
  },

  async deleteQuote(id: string) {
    const { error } = await supabase.from('quotes').delete().eq('id', id);
    if (error) throw error;
  },

  // Receipts
  async getReceipts() {
    try {
      const { data, error } = await supabase.from('receipts').select('*');
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data.map(r => ({
        id: r.id,
        clientId: r.client_id,
        date: r.date,
        value: r.value,
        description: r.description
      })) as Receipt[];
    } catch (e) {
      console.error('Error fetching receipts:', e);
      return [];
    }
  },

  async saveReceipt(receipt: Receipt) {
    const { error } = await supabase.from('receipts').upsert({
      id: receipt.id,
      client_id: receipt.clientId,
      date: receipt.date,
      value: receipt.value,
      description: receipt.description
    });
    if (error) throw error;
  },

  async deleteReceipt(id: string) {
    const { error } = await supabase.from('receipts').delete().eq('id', id);
    if (error) throw error;
  },

  // Costs
  async getCosts() {
    try {
      const { data, error } = await supabase.from('costs').select('*');
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data as Cost[];
    } catch (e) {
      console.error('Error fetching costs:', e);
      return [];
    }
  },

  async saveCost(cost: Cost) {
    const { error } = await supabase.from('costs').upsert(cost);
    if (error) throw error;
  },

  async deleteCost(id: string) {
    const { error } = await supabase.from('costs').delete().eq('id', id);
    if (error) throw error;
  },

  // Appointments
  async getAppointments() {
    try {
      const { data, error } = await supabase.from('appointments').select('*');
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data.map(a => ({
        id: a.id,
        title: a.title,
        start: a.start_time,
        end: a.end_time,
        type: a.type,
        ticketId: a.ticket_id,
        notes: a.notes
      })) as Appointment[];
    } catch (e) {
      console.error('Error fetching appointments:', e);
      return [];
    }
  },

  async saveAppointment(appointment: Appointment) {
    const { error } = await supabase.from('appointments').upsert({
      id: appointment.id,
      title: appointment.title,
      start_time: appointment.start,
      end_time: appointment.end,
      type: appointment.type,
      ticket_id: appointment.ticketId,
      notes: appointment.notes
    });
    if (error) throw error;
  },

  async deleteAppointment(id: string) {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
  },

  // Checklist Items
  async getChecklistItems() {
    try {
      const { data, error } = await supabase.from('checklist_items').select('*');
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }
      return data.map(i => ({
        id: i.id,
        task: i.task,
        category: i.category,
        clientIds: i.client_ids
      })) as ChecklistItem[];
    } catch (e) {
      console.error('Error fetching checklist items:', e);
      return [];
    }
  },

  async saveChecklistItem(item: ChecklistItem) {
    const { error } = await supabase.from('checklist_items').upsert({
      id: item.id,
      task: item.task,
      category: item.category,
      client_ids: item.clientIds
    });
    if (error) throw error;
  },

  async deleteChecklistItem(id: string) {
    const { error } = await supabase.from('checklist_items').delete().eq('id', id);
    if (error) throw error;
  },

  // Company Settings
  async getCompanySettings() {
    const { data, error } = await supabase.from('company_settings').select('*').eq('id', 1).single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    if (!data) return null;
    return {
      data: {
        name: data.name,
        document: data.document,
        phone: data.phone,
        email: data.email,
        address: data.address,
        website: data.website
      },
      logo: data.logo_url,
      signature: data.signature_url
    };
  },

  async saveCompanySettings(data: CompanyData, logo: string | null, signature: string | null) {
    const { error } = await supabase.from('company_settings').upsert({
      id: 1,
      name: data.name,
      document: data.document,
      phone: data.phone,
      email: data.email,
      address: data.address,
      website: data.website,
      logo_url: logo,
      signature_url: signature
    });
    if (error) throw error;
  }
};
