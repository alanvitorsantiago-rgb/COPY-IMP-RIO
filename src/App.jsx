import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./styles/globals.css";
import useAppStore from "./store/useAppStore";
import useUIStore from "./store/useUIStore";
import { supabase } from "./utils/supabase";

import Layout from "./layouts/Layout";
import AuthScreen from "./screens/AuthScreen";
import DashboardScreen from "./screens/DashboardScreen";
import GeneratorScreen from "./screens/GeneratorScreen";
import LibraryScreen from "./screens/LibraryScreen";
import TemplatesScreen from "./screens/TemplatesScreen";
import UpgradeScreen from "./screens/UpgradeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LandingScreen from "./screens/LandingScreen";
import BootSequence from "./components/BootSequence";

import { useState } from "react";

import { AnimatePresence } from 'framer-motion';

export default function App() {
  const [booting, setBooting] = useState(true);
  const setUser = useAppStore((state) => state.setUser);
  const user = useAppStore((state) => state.user);
  const updateUserPlan = useAppStore((state) => state.updateUserPlan);
  const showToast = useUIStore((state) => state.showToast);
  const location = useLocation();

  const fetchProfile = async (sessionUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('plan, full_name')
        .eq('id', sessionUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error);
      }

      setUser({ 
        id: sessionUser.id, 
        name: profile?.full_name || sessionUser.email?.split('@')[0] || 'Operador', 
        email: sessionUser.email, 
        plan: profile?.plan || 'free' 
      });
    } catch (err) {
      console.error('Erro na sincronização:', err);
      // Fallback para garantir que o usuário consiga entrar
      setUser({ 
        id: sessionUser.id, 
        name: sessionUser.email?.split('@')[0] || 'Operador', 
        email: sessionUser.email, 
        plan: 'free' 
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && mounted) {
        // Set otimista inicial
        setUser({ 
          id: session.user.id, 
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Operador',
          plan: 'free'
        });
        // Busca perfil completo em background
        fetchProfile(session.user);
      }
      // Pequeno delay para garantir que a animação de boot seja vista se for muito rápido
      if (mounted) setTimeout(() => setBooting(false), 1500);
    };


    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Primeiro set otimista para garantir redirecionamento imediato
        setUser({ 
          id: session.user.id, 
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Operador',
          plan: 'free'
        });
        
        // Depois busca o perfil completo (plano PRO, nome real, etc)
        await fetchProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });


    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);


  // Handle Mercado Pago return
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment');
    
    if (paymentStatus === 'success') {
      updateUserPlan('pro');
      showToast('Upgrade realizado com sucesso! Bem-vindo ao time PRO. 👑', 'success');
    }
  }, [updateUserPlan, showToast, location.search]);

  return (
    <>
      <AnimatePresence>
        {booting && (
          <BootSequence key="boot" onComplete={() => setBooting(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>

        <Routes key={location.pathname + (user?.id ? '_auth' : '_public')} location={location}>
          {!user?.id ? (
            /* Rotas Públicas */
            <>
              <Route path="/" element={<LandingScreen />} />
              <Route path="/auth" element={<AuthScreen />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            /* Rotas Protegidas */
            <Route element={<Layout />}>
              <Route index element={<DashboardScreen />} />
              <Route path="/generator" element={<GeneratorScreen />} />
              <Route path="/library" element={<LibraryScreen />} />
              <Route path="/templates" element={<TemplatesScreen />} />
              <Route path="/upgrade" element={<UpgradeScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          )}
        </Routes>

      </AnimatePresence>

    </>
  );
}

