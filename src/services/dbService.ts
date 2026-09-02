import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { EmergencyContact, IncidentReport, GuidanceData, AlertLog } from '../types';

// Local storage backup keys for offline / preview sandbox
const CONTACTS_KEY = 'medai_contacts_db';
const INCIDENTS_KEY = 'medai_incidents_db';
const GUIDANCE_KEY = 'medai_guidance_db';
const ALERTS_KEY = 'medai_alerts_db';

export const dbService = {
  // -------------------------------------------------------------
  // Emergency Contacts
  // -------------------------------------------------------------
  async getContacts(userId: string): Promise<EmergencyContact[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching contacts from Supabase:', error);
        return this.getLocalContacts(userId);
      }
      return data || [];
    }
    return this.getLocalContacts(userId);
  },

  async addContact(contact: Omit<EmergencyContact, 'id' | 'created_at'>): Promise<EmergencyContact> {
    const newContact: EmergencyContact = {
      ...contact,
      id: 'contact_' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      // If marking as primary, reset other primary contacts first
      if (contact.is_primary) {
        await supabase
          .from('emergency_contacts')
          .update({ is_primary: false })
          .eq('user_id', contact.user_id);
      }

      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert(newContact)
        .select()
        .single();

      if (!error && data) {
        return data;
      }
      console.error('Supabase contact insert fallback:', error);
    }

    // Local fallback
    const all = this.getAllLocalContacts();
    if (contact.is_primary) {
      all.forEach((c) => {
        if (c.user_id === contact.user_id) c.is_primary = false;
      });
    }
    all.push(newContact);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(all));
    return newContact;
  },

  async updateContact(id: string, updates: Partial<EmergencyContact>, userId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      if (updates.is_primary) {
        await supabase
          .from('emergency_contacts')
          .update({ is_primary: false })
          .eq('user_id', userId);
      }
      const { error } = await supabase
        .from('emergency_contacts')
        .update(updates)
        .eq('id', id);
      return !error;
    }

    const all = this.getAllLocalContacts();
    const idx = all.findIndex((c) => c.id === id);
    if (idx >= 0) {
      if (updates.is_primary) {
        all.forEach((c) => {
          if (c.user_id === userId) c.is_primary = false;
        });
      }
      all[idx] = { ...all[idx], ...updates };
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(all));
      return true;
    }
    return false;
  },

  async deleteContact(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);
      return !error;
    }

    const all = this.getAllLocalContacts().filter((c) => c.id !== id);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(all));
    return true;
  },

  // -------------------------------------------------------------
  // Incidents & Guidance Persistence
  // -------------------------------------------------------------
  async saveIncidentWithGuidance(
    incident: Omit<IncidentReport, 'id' | 'created_at'>,
    guidance: Omit<GuidanceData, 'id' | 'incident_id' | 'created_at'>
  ): Promise<{ incident: IncidentReport; guidance: GuidanceData }> {
    const incidentId = 'inc_' + Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toISOString();

    const fullIncident: IncidentReport = {
      ...incident,
      id: incidentId,
      created_at: timestamp,
    };

    const fullGuidance: GuidanceData = {
      ...guidance,
      id: 'guid_' + Math.random().toString(36).substring(2, 9),
      incident_id: incidentId,
      created_at: timestamp,
    };

    if (isSupabaseConfigured && supabase) {
      const { data: incData, error: incErr } = await supabase
        .from('incidents')
        .insert(fullIncident)
        .select()
        .single();

      if (!incErr && incData) {
        await supabase
          .from('guidance')
          .insert({ ...fullGuidance, incident_id: incData.id });
        return { incident: incData, guidance: fullGuidance };
      }
    }

    // Local Storage save
    const incidents = this.getAllLocalIncidents();
    incidents.unshift(fullIncident);
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));

    const guidances = this.getAllLocalGuidance();
    guidances.unshift(fullGuidance);
    localStorage.setItem(GUIDANCE_KEY, JSON.stringify(guidances));

    return { incident: fullIncident, guidance: fullGuidance };
  },

  async getIncidents(userId: string): Promise<Array<IncidentReport & { guidance?: GuidanceData }>> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('incidents')
        .select('*, guidance(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((item: any) => ({
          ...item,
          guidance: Array.isArray(item.guidance) ? item.guidance[0] : item.guidance,
        }));
      }
    }

    // Local Storage query
    const allIncidents = this.getAllLocalIncidents().filter((i) => i.user_id === userId);
    const allGuidance = this.getAllLocalGuidance();

    return allIncidents.map((inc) => ({
      ...inc,
      guidance: allGuidance.find((g) => g.incident_id === inc.id),
    }));
  },

  // -------------------------------------------------------------
  // Alert Logs
  // -------------------------------------------------------------
  async logAlert(alert: Omit<AlertLog, 'id' | 'sent_at'>): Promise<AlertLog> {
    const newLog: AlertLog = {
      ...alert,
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      sent_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('alert_logs')
        .insert(newLog)
        .select()
        .single();
      if (!error && data) return data;
    }

    const all = this.getAllLocalAlerts();
    all.unshift(newLog);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(all));
    return newLog;
  },

  async getAlertLogs(incidentId: string): Promise<AlertLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('alert_logs')
        .select('*')
        .eq('incident_id', incidentId)
        .order('sent_at', { ascending: false });
      if (!error && data) return data;
    }

    return this.getAllLocalAlerts().filter((a) => a.incident_id === incidentId);
  },

  // -------------------------------------------------------------
  // Internal Local Storage Helpers
  // -------------------------------------------------------------
  getLocalContacts(userId: string): EmergencyContact[] {
    const list = this.getAllLocalContacts().filter((c) => c.user_id === userId);
    // If user has no contacts yet, seed default campus security and RA contact
    if (list.length === 0) {
      const initialSeed: EmergencyContact[] = [
        {
          id: 'contact_seed_campus_sec',
          user_id: userId,
          name: 'Campus Safety & Escort Service',
          email: 'safety-escort@university.edu',
          phone: '(555) 019-2834',
          relationship: 'Campus Security',
          is_primary: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 'contact_seed_dorm_ra',
          user_id: userId,
          name: 'Resident Advisor (East Hall)',
          email: 'ra-easthall@university.edu',
          phone: '(555) 019-5821',
          relationship: 'Dorm RA',
          is_primary: false,
          created_at: new Date().toISOString(),
        },
      ];
      const all = this.getAllLocalContacts();
      all.push(...initialSeed);
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(all));
      return initialSeed;
    }
    return list;
  },

  getAllLocalContacts(): EmergencyContact[] {
    try {
      const raw = localStorage.getItem(CONTACTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getAllLocalIncidents(): IncidentReport[] {
    try {
      const raw = localStorage.getItem(INCIDENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getAllLocalGuidance(): GuidanceData[] {
    try {
      const raw = localStorage.getItem(GUIDANCE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getAllLocalAlerts(): AlertLog[] {
    try {
      const raw = localStorage.getItem(ALERTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
};
