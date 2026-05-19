"use client"; 

import Navbar from "@/components/navbar/navbar";
import { useEffect, useState } from 'react';

export default function Profil() {
  interface Profil {
    id: number;
    name: string;
    lastname: string;
    email: string;
    telephone: string;
    street: string;
    city: string;
    postal_code: string;
    status: string;
    created_at: string;
    updated_at: string;
    center: string;
  }
  const [profil, setProfil] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
      const fetchProfil = async () => {
          try {
              const response = await fetch('http://localhost:8000/api/profil', {
                  method: 'GET',
                  credentials: 'include', 
                  headers: { 'Content-Type': 'application/json' },
              });
              const data = await response.json();
              if (!response.ok) throw new Error(data.detail || 'Failed to fetch');
              setProfil(data);
              console.log('Profil:', data);
          } catch (err) {
              setError(err instanceof Error ? err.message : 'Une erreur est survenue');
              console.error('Error:', err);
          } finally {
              setLoading(false);
          }
      };

      fetchProfil();
  }, []);

  return (
    <div className="main">
      <Navbar />
      <div className="title">
        <h1>Mon profil</h1>
        Gérer vos informations personnelles
      </div>
      <div className="nb-personal-information">
        {profil && (
          <div>
            <p><strong>Nom:</strong> {profil.name}</p>
            <p><strong>Prénom:</strong> {profil.lastname}</p>
            <p><strong>Email:</strong> {profil.email}</p>
            <p><strong>Téléphone:</strong> {profil.telephone}</p>
            <p><strong>Rue:</strong> {profil.street}</p>
            <p><strong>Ville:</strong> {profil.city}</p>
            <p><strong>Code postal:</strong> {profil.postal_code}</p>
            <p><strong>Statut:</strong> {profil.status}</p>
            <p><strong>Date de création:</strong> {profil.created_at}</p>
            <p><strong>Date de mise à jour:</strong> {profil.updated_at}</p>
            <p><strong>Centre:</strong> {profil.center}</p>
          </div>
        )}
      </div>
      <div className="nb-réassort">
      </div>
      <div className="nb-vehicule">
      </div>
    </div>
  );
}
