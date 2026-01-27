import { supabase } from './supabaseClient';
import type { Colonia } from '../types';

export const coloniaService = {
  // Obtener todas las colonias (para el mapa)
  async getAllColonias(): Promise<Colonia[]> {
    const { data, error } = await supabase
      .from('colonias')
      .select('*')
      .order('codigo_postal')
      .limit(5000);
    
    if (error) {
      console.error('Error fetching colonias:', error);
      throw error;
    }
    
    return data || [];
  },

  // Buscar por código postal
  async getColoniaByCP(codigoPostal: string): Promise<Colonia | null> {
    // Normalizar a 5 dígitos
    const cpNormalizado = codigoPostal.padStart(5, '0');
    
    const { data, error } = await supabase
      .from('colonias')
      .select('*')
      .eq('codigo_postal', cpNormalizado)
      .single();
    
    if (error) {
      console.error('Error fetching colonia:', error);
      return null;
    }
    
    return data;
  },

  // Filtrar por categoría de riesgo
  async getColoniasByRiesgo(categoria: 'bajo' | 'medio' | 'alto'): Promise<Colonia[]> {
    const { data, error } = await supabase
      .from('colonias')
      .select('*')
      .eq('categoria_riesgo', categoria)
      .limit(5000);
    
    if (error) {
      console.error('Error fetching colonias:', error);
      throw error;
    }
    
    return data || [];
  },

  // Filtrar por estado
  async getColoniasByEstado(estado: string): Promise<Colonia[]> {
    const { data, error } = await supabase
      .from('colonias')
      .select('*')
      .eq('estado', estado)
      .limit(5000);
    
    if (error) {
      console.error('Error fetching colonias:', error);
      throw error;
    }
    
    return data || [];
  },

  // Filtrar por municipio
  async getColoniasByMunicipio(municipio: string): Promise<Colonia[]> {
    const { data, error } = await supabase
      .from('colonias')
      .select('*')
      .eq('municipio', municipio)
      .limit(5000);
    
    if (error) {
      console.error('Error fetching colonias:', error);
      throw error;
    }
    
    return data || [];
  }
};