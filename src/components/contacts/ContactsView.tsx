import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Mail, 
  Star, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  X,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmergencyContact, LanguageCode } from '../../types';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';

export interface ContactsViewProps {
  language: LanguageCode;
  onBack: () => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({ language, onBack }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest_user';
  const isHindi = language === 'hi';

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Campus Advisor');
  const [isPrimary, setIsPrimary] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, [userId]);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const data = await dbService.getContacts(userId);
      setContacts(data);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingContact(null);
    setName('');
    setEmail('');
    setPhone('');
    setRelationship('Campus Advisor');
    setIsPrimary(contacts.length === 0);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
    setRelationship(contact.relationship);
    setIsPrimary(contact.is_primary);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError(isHindi ? 'कृपया संपर्क का नाम दर्ज करें।' : 'Please enter contact name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError(isHindi ? 'कृपया वैध ईमेल पता दर्ज करें।' : 'Please enter a valid email.');
      return;
    }
    if (!phone.trim()) {
      setFormError(isHindi ? 'कृपया फोन नंबर दर्ज करें।' : 'Please enter a phone number.');
      return;
    }

    try {
      if (editingContact) {
        await dbService.updateContact(
          editingContact.id,
          {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            relationship,
            is_primary: isPrimary,
          },
          userId
        );
      } else {
        await dbService.addContact({
          user_id: userId,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          relationship,
          is_primary: isPrimary,
        });
      }
      setIsModalOpen(false);
      loadContacts();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save contact.');
    }
  };

  const handleSetPrimary = async (contact: EmergencyContact) => {
    await dbService.updateContact(contact.id, { is_primary: true }, userId);
    loadContacts();
  };

  const handleDeleteContact = async (id: string) => {
    await dbService.deleteContact(id);
    setDeleteConfirmId(null);
    loadContacts();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              onClick={onBack}
            >
              {isHindi ? 'वापस' : 'Back'}
            </Button>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isHindi ? 'आपातकालीन संपर्क प्रबंधन' : 'Designated Emergency Contacts'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {isHindi
              ? 'आपात स्थिति में केवल आपकी स्पष्ट पुष्टि के बाद ही इन संपर्कों को अलर्ट भेजा जाता है।'
              : 'Alerts are dispatched only with your explicit confirmation during escalated incidents.'}
          </p>
        </div>

        <Button
          id="add-contact-btn"
          variant="primary"
          size="md"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          {isHindi ? 'नया संपर्क जोड़ें' : 'Add Emergency Contact'}
        </Button>
      </div>

      {/* RLS Security Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {isHindi
              ? 'गोपनीयता सुरक्षा: संपर्क जानकारी आपके छात्र खाते में सुरक्षित है और दूसरों से साझा नहीं होती।'
              : 'Protected under Row Level Security (RLS). Only your authenticated account can access these contacts.'}
          </span>
        </div>
        <Badge variant="success" size="sm">RLS Active</Badge>
      </div>

      {/* Contacts List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-medium">Loading emergency contacts...</p>
        </div>
      ) : contacts.length === 0 ? (
        <Card className="border-dashed border-2 text-center p-8 bg-slate-50">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800">
            {isHindi ? 'कोई आपातकालीन संपर्क नहीं मिला' : 'No Emergency Contacts Configured'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {isHindi
              ? 'कैंपस सुरक्षा, आरए, या अभिभावक को जोड़ें ताकि आपात स्थिति में त्वरित अलर्ट भेजा जा सके।'
              : 'Add a dorm RA, campus security escort, or parent to enable 1-click verified alert escalation.'}
          </p>
          <div className="mt-4">
            <Button size="sm" variant="primary" onClick={handleOpenAdd}>
              {isHindi ? 'पहला संपर्क जोड़ें' : 'Add Primary Contact'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((c) => (
            <Card
              key={c.id}
              className={`transition-all ${
                c.is_primary ? 'border-emerald-500 bg-emerald-50/20 shadow-xs' : 'hover:border-slate-300'
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{c.name}</CardTitle>
                      {c.is_primary && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-current" /> Primary
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-500">{c.relationship}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      title="Edit Contact"
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      title="Delete Contact"
                      onClick={() => setDeleteConfirmId(c.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 text-xs text-slate-600 pt-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{c.phone}</span>
                </div>

                {!c.is_primary && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(c)}
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold underline cursor-pointer"
                    >
                      {isHindi ? 'प्राथमिक संपर्क बनाएं' : 'Make Primary Contact'}
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-lg">
              {isHindi ? 'संपर्क हटाएं?' : 'Delete Emergency Contact?'}
            </h3>
            <p className="text-xs text-slate-600">
              {isHindi
                ? 'क्या आप निश्चित रूप से इस संपर्क को हटाना चाहते हैं? यह कार्रवाई अपरिवर्तनीय है।'
                : 'Are you sure you want to remove this emergency contact? This action cannot be undone.'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setDeleteConfirmId(null)}>
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleDeleteContact(deleteConfirmId)}>
                {isHindi ? 'हटाएं' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingContact 
                  ? (isHindi ? 'संपर्क संपादित करें' : 'Edit Emergency Contact')
                  : (isHindi ? 'नया संपर्क जोड़ें' : 'Add Emergency Contact')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveContact} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {isHindi ? 'नाम (Name)' : 'Contact Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Vance or Dorm RA"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {isHindi ? 'ईमेल (Email for Alerts)' : 'Email Address (For Verified Alerts)'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="safety@university.edu"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {isHindi ? 'फोन नंबर (Phone)' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 019-2834"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {isHindi ? 'संबंध / भूमिका (Relationship)' : 'Relationship / Campus Role'}
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Campus Security">Campus Security & Escort</option>
                  <option value="Dorm RA">Dorm Resident Advisor (RA)</option>
                  <option value="Campus Advisor">Academic / Campus Advisor</option>
                  <option value="Parent / Guardian">Parent / Guardian</option>
                  <option value="Roommate">Roommate / Peer</option>
                  <option value="Other">Other Contact</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primary-checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="primary-checkbox" className="text-xs font-medium text-slate-700 cursor-pointer">
                  {isHindi ? 'इस संपर्क को प्राथमिक आपातकालीन संपर्क बनाएं' : 'Designate as Primary Emergency Alert Contact'}
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" size="sm" variant="outline" onClick={() => setIsModalOpen(false)}>
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button type="submit" size="sm" variant="primary">
                  {editingContact ? (isHindi ? 'अपडेट करें' : 'Update') : (isHindi ? 'सुरक्षित करें' : 'Save Contact')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
