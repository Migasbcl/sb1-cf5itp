import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { PartyPopper } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/types";
import { OrganizerDashboard } from "@/components/dashboard/OrganizerDashboard";
import { PromoterDashboard } from "@/components/dashboard/PromoterDashboard";
import { CreateEventPage } from "@/pages/CreateEventPage";
import { PublicEventPage } from "@/pages/PublicEventPage";

function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
          alt="Evento"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="relative z-20 p-12 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PartyPopper className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-white">GuestList</span>
            </div>
          </div>
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">
              Gerencie seus eventos com facilidade
            </h1>
            <p className="text-lg text-gray-300">
              A plataforma definitiva para organizadores e promotores de eventos. 
              Crie, gerencie e acompanhe suas listas de convidados sem esforço.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <PartyPopper className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">GuestList</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {isLogin
                ? "Digite suas credenciais para acessar sua conta"
                : "Comece a gerenciar seus eventos hoje"}
            </p>
          </div>

          {isLogin ? (
            <>
              <LoginForm onSuccess={() => {}} />
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Não tem uma conta? </span>
                <Button variant="link" className="p-0" onClick={toggleForm}>
                  Cadastre-se
                </Button>
              </div>
            </>
          ) : (
            <>
              <RegisterForm onSuccess={() => setIsLogin(true)} />
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Já tem uma conta? </span>
                <Button variant="link" className="p-0" onClick={toggleForm}>
                  Entrar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser(userId: string) {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          role,
          organization_id,
          created_at
        `)
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user:', userError);
        setUser(null);
        return;
      }

      if (userData) {
        setUser({
          uid: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          organization: userData.organization_id,
          createdAt: new Date(userData.created_at).getTime(),
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error in fetchUser:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <PartyPopper className="h-8 w-8 animate-spin" />
    </div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={user.role === 'organizer' ? '/dashboard' : '/promoter'}
                replace
              />
            ) : (
              <AuthPages />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user?.role === 'organizer' ? (
              <OrganizerDashboard user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/criar-evento"
          element={
            user?.role === 'organizer' ? (
              <CreateEventPage user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/promoter"
          element={
            user?.role === 'promoter' ? (
              <PromoterDashboard user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/evento/:eventId" element={<PublicEventPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;