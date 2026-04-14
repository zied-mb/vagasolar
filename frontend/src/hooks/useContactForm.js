import { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('loading');

    const payload = {
      name:    formData.name,
      email:   formData.email,
      phone:   formData.phone,
      content: formData.message,
      type:    'Contact'
    };

    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Échec de l\'envoi');

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Keep success status for 4 seconds for the luxury notification
      setTimeout(() => {
        setStatus('idle');
      }, 4000);
      
    } catch (err) {
      console.error('[CONTACT_ERROR]', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    } finally {
      setLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, loading, status };
};
