"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { EquipmentCategory } from "@/types/categoryStatus";
import { updateEquipment } from "@/lib/api/equipment_crud";

const CATEGORIES = Object.values(EquipmentCategory);

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
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[13px] text-gray-800 focus:outline-none focus:border-[rgb(230,0,126)]"
    />
  );
}

export default function EditEquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [name, setName] = useState("Pc");
  const [category, setCategory] = useState<string>(EquipmentCategory.IT);
  const [reference, setReference] = useState("REF001_c1");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSubmitting(true);
    setError("");
    try {
      await updateEquipment(Number(id), { name, category, reference, description });
      router.push(`/equipment/${id}`);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la modification du matériel");
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-6 flex flex-col gap-4 max-w-2xl">
        <Link
          href={`/equipment/${id}`}
          className="inline-flex items-center gap-1 text-[12px] text-[rgb(230,0,126)] hover:underline"
        >
          <ArrowLeft size={13} /> Retour à la fiche
        </Link>

        <h1 className="text-[20px] font-bold text-gray-900">
          Modifier le matériel
        </h1>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
          <div>
            <FieldLabel required>Nom</FieldLabel>
            <Input value={name} onChange={setName} />
          </div>
          <div>
            <FieldLabel required>Catégorie</FieldLabel>
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
            <FieldLabel required>Référence</FieldLabel>
            <Input value={reference} onChange={setReference} />
          </div>
          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[13px] text-gray-800 focus:outline-none focus:border-[rgb(230,0,126)] resize-none"
            />
          </div>
        </div>

        {error && (
          <p className="text-[13px] text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <Link
            href={`/equipment/${id}`}
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
