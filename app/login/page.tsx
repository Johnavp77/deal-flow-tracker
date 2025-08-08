'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
<Auth
  supabaseClient={supabase}
  appearance=https://operator.chatgpt.com/c/68963bf441b48190a76819205010355e#cua_citation-%20theme:%20ThemeSupa%20
  providers={['github']}
/>
         </div>
