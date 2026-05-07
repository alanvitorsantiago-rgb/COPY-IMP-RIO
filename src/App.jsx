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

  // Handle Supabase Auth Session
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from('profiles')
          .select('plan, full_name')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({ 
              id: session.user.id, 
              name: profile?.full_name || session.user.email.split('@')[0], 
              email: session.user.email, 
              plan: profile?.plan || 'free' 
            });
          });
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan, full_name')
          .eq('id', session.user.id)
          .single();

        setUser({ 
          id: session.user.id, 
          name: profile?.full_name || session.user.email.split('@')[0], 
          email: session.user.email, 
          plan: profile?.plan || 'free' 
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

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
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        {/* Root Route: Landing or Dashboard */}
        <Route path="/" element={!user ? <LandingScreen /> : <Layout><DashboardScreen /></Layout>} />
        
        {/* Auth Route */}
        <Route path="/auth" element={!user ? <AuthScreen /> : <Navigate to="/" />} />
        
        {/* Protected Feature Routes */}
        <Route element={user ? <Layout /> : <Navigate to="/auth" />}>
          <Route path="/generator" element={<GeneratorScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
          <Route path="/templates" element={<TemplatesScreen />} />
          <Route path="/upgrade" element={<UpgradeScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </AnimatePresence>
  );
}
