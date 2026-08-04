import { useState, useCallback, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateRole,
  sanitize,
} from '../utils/validation';
import { authApi } from '../api/auth';

export interface SignupFormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

type FieldKey = keyof SignupFormState;
type FormErrors = Partial<Record<FieldKey, string>>;

function validate(form: SignupFormState): FormErrors {
  const errs: FormErrors = {
    firstName: validateName(form.firstName, 'First name') ?? undefined,
    lastName: validateName(form.lastName, 'Last name') ?? undefined,
    email: validateEmail(form.email) ?? undefined,
    password: validatePassword(form.password) ?? undefined,
    role: validateRole(form.role) ?? undefined,
  };
  if (!form.confirmPassword) {
    errs.confirmPassword = 'Please confirm your password.';
  } else if (form.password !== form.confirmPassword) {
    errs.confirmPassword = 'Passwords do not match.';
  }
  return errs;
}

export function useSignupForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupFormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const clean = e.target.tagName === 'SELECT' ? value : sanitize(value);
      setForm((prev) => ({ ...prev, [name]: clean }));

      if (touched[name as FieldKey]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validate({ ...form, [name]: clean })[name as FieldKey],
        }));
      }
    },
    [form, touched],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({
        ...prev,
        [name]: validate(form)[name as FieldKey],
      }));
    },
    [form],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({
      firstName: true, lastName: true, email: true,
      password: true, confirmPassword: true, role: true,
    });
    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.values(fieldErrors).some(Boolean)) return;

    setLoading(true);
    setServerError('');
    try {
      await authApi.signUp({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });
      navigate('/login', { replace: true });
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: FieldKey) =>
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
