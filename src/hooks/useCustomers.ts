import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { useAuthStore } from '../store/authStore';

type Customer = Database['public']['Tables']['customers']['Row'];

export function useCustomers(filter?: 'expiring' | 'active') {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (!user) return;

    const fetchCustomers = async () => {
      try {
        let query = supabase
          .from('customers')
          .select();

        if (user.role !== 'admin') {
          query = query.eq('created_by', user.id);
        }

        if (filter === 'expiring') {
          const now = new Date();
          const twentyDaysFromNow = new Date();
          twentyDaysFromNow.setDate(now.getDate() + 20);
          
          query = query
            .gte('subscription_end', now.toISOString())
            .lte('subscription_end', twentyDaysFromNow.toISOString());
        } else if (filter === 'active') {
          query = query.gte('subscription_end', new Date().toISOString());
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setCustomers(data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();

    // Set up real-time subscription
    const subscription = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCustomers(prev => [payload.new as Customer, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setCustomers(prev => prev.filter(customer => customer.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setCustomers(prev => prev.map(customer => 
              customer.id === payload.new.id ? payload.new as Customer : customer
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, filter]);

  return { customers, loading };
}