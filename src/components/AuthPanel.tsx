import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function AuthPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured || !supabase) return null;

  async function runAuth(action: 'signin' | 'signup' | 'magic') {
    setIsLoading(true);
    setMessage('');

    try {
      if (action === 'magic') {
        const { error } = await supabase!.auth.signInWithOtp({ email });
        if (error) throw error;
        setMessage('登录链接已发送，请检查邮箱。');
        return;
      }

      const payload = { email, password };
      const { error } =
        action === 'signin'
          ? await supabase!.auth.signInWithPassword(payload)
          : await supabase!.auth.signUp(payload);

      if (error) throw error;
      setMessage(action === 'signin' ? '登录成功。' : '注册完成；如开启邮箱确认，请先验证邮箱。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '认证操作失败。');
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    setIsLoading(true);
    await supabase!.auth.signOut();
    setMessage('已退出登录。');
    setIsLoading(false);
  }

  if (user) {
    return (
      <div className="auth-panel is-signed-in">
        <span className="panel-label">Authenticated</span>
        <strong>{user.email}</strong>
        <button type="button" className="button secondary compact" onClick={signOut} disabled={isLoading}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-panel">
      <span className="panel-label">Supabase Auth</span>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <div className="auth-actions">
        <button type="button" className="button primary compact" onClick={() => runAuth('signin')} disabled={isLoading || !email || !password}>
          Sign in
        </button>
        <button type="button" className="button secondary compact" onClick={() => runAuth('signup')} disabled={isLoading || !email || !password}>
          Sign up
        </button>
      </div>
      <button type="button" className="button ghost compact" onClick={() => runAuth('magic')} disabled={isLoading || !email}>
        Send magic link
      </button>
      {message && <small className="auth-message">{message}</small>}
    </div>
  );
}
