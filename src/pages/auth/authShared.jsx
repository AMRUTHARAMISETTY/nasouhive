import { useMemo, useState } from 'react';

export const ROLE_OPTIONS = ['manufacturer', 'retailer', 'customer'];

export const defaultForm = {
  email: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  storeName: '',
  gst: '',
  phone: '',
  address: '',
  fullName: '',
};

export const useAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('manufacturer');
  const [formData, setFormData] = useState(defaultForm);

  const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return false;
    }
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert('Authentication flow captured. Dashboard access is disabled in this build.');
  };

  const registerFields = useMemo(() => {
    if (role === 'manufacturer') return ['companyName', 'gst', 'phone', 'address'];
    if (role === 'retailer') return ['storeName', 'gst', 'phone', 'address'];
    return ['fullName', 'phone'];
  }, [role]);

  return {
    isLogin,
    setIsLogin,
    role,
    setRole,
    formData,
    onChange,
    submit,
    registerFields,
  };
};

export const fieldMeta = {
  companyName: { label: 'Company Name', type: 'text' },
  storeName: { label: 'Store Name', type: 'text' },
  gst: { label: 'GST Number', type: 'text' },
  phone: { label: 'Phone', type: 'tel' },
  address: { label: 'Address', type: 'text' },
  fullName: { label: 'Full Name', type: 'text' },
};
