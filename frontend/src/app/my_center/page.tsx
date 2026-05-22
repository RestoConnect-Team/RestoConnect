"use client"; 

import Navbar from "@/components/navbar/navbar";
import { useEffect, useState } from 'react';

export default function MyCenter() {
  

  return (
    <div className="main">
      <Navbar />
      <div className="title">
        <h1>Centre d'accueil</h1>
        Tableau de bord et aperçu général
      </div>
      <div className="nb-benevol">
      </div>
      <div className="nb-réassort">
      </div>
      <div className="nb-vehicule">
      </div>
    </div>
  );
}
