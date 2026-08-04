import { useState, useCallback, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { validateEmail, validatePassword, sanitize } from '../utils/validation';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

interface FormState {
  email: string;
  password: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  return {
    email: validateEmail(form.email) ?? undefined,
    password: validatePassword(form.password) ?? undefined,
  };
}

export function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/profile';

  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
    //   console.log('Form submitted:', name, value);
      const clean = sanitize(value);
      setForm((prev) => ({ ...prev, [name]: clean }));

      if (touched[name as keyof FormState]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validate({ ...form, [name]: clean })[name as keyof FormState],
        }));
      }
    },
    [form, touched],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({
        ...prev,
        [name]: validate(form)[name as keyof FormState],
      }));
    },
    [form],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.values(fieldErrors).some(Boolean)) return;

    setLoading(true);
    setServerError('');
    try {
      const res = await authApi.signIn({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      login(res.token);
      navigate(from, { replace: true });
    } catch (err) {
        console.log('Error during login:', err);
      setServerError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof FormState) =>
    `input${touched[field] && errors[field] ? ' input--error' : ''}`;

  return {
    form,
    errors,
    touched,
    showPw,
    setShowPw,
    loading,
    serverError,
    handleChange,
    handleBlur,
    handleSubmit,
    inputClass,
  };
}
