import { useEffect, useState } from 'react';
import { db } from '../db/database';
import type { Customer } from '../db/database';
import { useAuthStore } from '../store/authStore';

export function useCustomers(filter?: 'expiring' | 'active') {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (!user) return;

    const fetchCustomers = async () => {
      try {
        let query = db.customers.toCollection();

        if (user.role !== 'admin') {
          query = query.filter(customer => customer.createdBy === user.id);
        }

        if (filter === 'expiring') {
          const now = new Date();
          const twentyDaysFromNow = new Date();
          twentyDaysFromNow.setDate(now.getDate() + 20);
          
          query = query.filter(customer => {
            const subscriptionEnd = new Date(customer.subscriptionEnd);
            return subscriptionEnd >= now && subscriptionEnd <= twentyDaysFromNow;
          });
        } else if (filter === 'active') {
          const now = new Date();
          query = query.filter(customer => {
            const subscriptionEnd = new Date(customer.subscriptionEnd);
            return subscriptionEnd >= now;
          });
        }

        const data = await query.reverse().sortBy('createdAt');
        setCustomers(data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();

    // Set up a polling mechanism to refresh data periodically
    const intervalId = setInterval(fetchCustomers, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [user, filter]);

  const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const newCustomer = {
        ...customerData,
        createdAt: new Date().toISOString()
      };
      
      const id = await db.customers.add(newCustomer);
      const addedCustomer = await db.customers.get(id);
      
      if (addedCustomer) {
        setCustomers(prev => [addedCustomer, ...prev]);
      }
      
      return { data: addedCustomer, error: null };
    } catch (error) {
      console.error('Error creating customer:', error);
      return { data: null, error };
    }
  };

  const updateCustomer = async (id: number, customerData: Partial<Customer>) => {
    try {
      await db.customers.update(id, customerData);
      const updatedCustomer = await db.customers.get(id);
      
      if (updatedCustomer) {
        setCustomers(prev => 
          prev.map(customer => customer.id === id ? updatedCustomer : customer)
        );
      }
      
      return { data: updatedCustomer, error: null };
    } catch (error) {
      console.error('Error updating customer:', error);
      return { data: null, error };
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      await db.customers.delete(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting customer:', error);
      return { error };
    }
  };

  return {
    customers,
    loading,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
}