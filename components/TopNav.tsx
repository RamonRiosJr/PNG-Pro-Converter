import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { AuthModal } from './AuthModal';

export const TopNav: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <>
            <nav className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-end items-center z-40">
                {user ? (
                    <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-full shadow-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-slate-200 hidden md:block">
                                {user.email}
                            </span>
                        </div>
                        <div className="w-px h-4 bg-slate-700"></div>
                        <button
                            onClick={handleSignOut}
                            className="text-slate-400 hover:text-white transition-colors flex items-center justify-center p-1"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setAuthModalOpen(true)}
                        className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-cyan-500 hover:bg-slate-800 text-slate-200 px-6 py-2 rounded-full transition-all text-sm font-semibold shadow-xl hover:shadow-cyan-500/20"
                    >
                        <LogIn className="w-4 h-4" />
                        Sign In
                    </button>
                )}
            </nav>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
};
