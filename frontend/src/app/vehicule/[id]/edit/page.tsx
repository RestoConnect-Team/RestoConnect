"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { updateVehicule } from "@/lib/api/vehicule_crud";

const CATEGORIES = [
  "frigorifique",
  "plateau",
  "fourgon",
  "voiture",
  "camion",
  "utilitaire",
  "benne",
  "citerne",
  "remorque",
  "semi-remorque",
];

const STATUSES = [
  "en service",
  "en maintenance",
  "en réparation",
  "hors service",
];

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-[12px] font-semibold text-gray-700 mb-1">
      {children}
      {required && <span className="text-[rgb(230,0,126)] ml-0.5">*</span>}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[13px] text-gray-800 focus:outline-none focus:border-[rgb(230,0,126)]"
    />
  );
}

export default function EditVehiculePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [name, setName] = useState("Véhicule 1");
  const [immatriculation, setImmatriculation] = useState("AA-123-AA");
  const [category, setCategory] = useState<string>("voiture");
  const [status, setStatus] = useState<string>("en service");
  const [nbKm, setNbKm] = useState("120000");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSubmitting(true);
    setError("");
    try {
      await updateVehicule(Number(id), {
        name,
        immatriculation,
        category,
        status,
        nb_km: nbKm ? Number(nbKm) : 0,
      });
      router.push(`/vehicule/${id}`);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la modification du véhicule");
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-6 flex flex-col gap-4 max-w-2xl">
        <Link
          href={`/vehicule/${id}`}
          className="inline-flex items-center gap-1 text-[12px] text-[rgb(230,0,126)] hover:underline"
        >
          <ArrowLeft size={13} /> Retour à la fiche
        </Link>

        <h1 className="text-[20px] font-bold text-gray-900">
          Modifier le véhicule
        </h1>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
          <div>
            <FieldLabel required>Nom</FieldLabel>
            <Input value={name} onChange={setName} />
          </div>
          <div>
            <FieldLabel required>Immatriculation</FieldLabel>
            <Input value={immatriculation} onChange={setImmatriculation} />
          </div>
          <div>
            <FieldLabel required>Type</FieldLabel>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[13px] text-gray-800 focus:outline-none focus:border-[rgb(230,0,126)]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel required>Statut</FieldLabel>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[13px] text-gray-800 focus:outline-none focus:border-[rgb(230,0,126)]"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Kilométrage</FieldLabel>
            <Input value={nbKm} onChange={setNbKm} type="number" />
          </div>
        </div>

        {error && (
          <p className="text-[13px] text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <Link
            href={`/vehicule/${id}`}
            className="flex-1 py-3 text-center border-2 border-[rgb(230,0,126)] text-[rgb(230,0,126)] rounded-lg text-[14px] font-semibold hover:bg-pink-50 transition-colors"
          >
            Annuler
          </Link>
          <Button className="flex-1" disabled={submitting} onClick={handleSave}>
            {submitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
