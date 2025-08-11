import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const supabase = createClientComponentClient();

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Auth
        supabaseClient={supabase}
        appearance=https://operator.chatgpt.com/c/689a40675c108191bd2afe025c1adfbd#cua_citation-{{ theme:ThemeSupa }}
        providers={['github']}
        magicLink={false}
      />
      <p className="mt-4 text-sm text-center text-gray-500">
        Sign up with your email and password, or continue with GitHub.
      </p>
    </div>
  );
}
