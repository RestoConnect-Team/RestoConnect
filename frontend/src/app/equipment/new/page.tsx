"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { EquipmentCategory } from "@/types/categoryStatus";

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

export default function NewEquipmentPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");

  const canNext = step === 1 ? name.trim() !== "" && reference.trim() !== "" : true;

  return (
    <PageLayout>
      <div className="p-6 flex flex-col gap-4 max-w-2xl">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-1 text-[12px] text-[rgb(230,0,126)] hover:underline"
        >
          <ArrowLeft size={13} /> Retour à la liste
        </Link>

        <h1 className="text-[20px] font-bold text-gray-900">
          Ajouter un matériel
        </h1>

        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? "bg-[rgb(230,0,126)] text-white" : "bg-gray-200 text-gray-500"}`}
          >
            1
          </span>
          <span className={step >= 1 ? "text-gray-800 font-medium" : ""}>
            Informations
          </span>
          <span className="flex-1 h-px bg-gray-200" />
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? "bg-[rgb(230,0,126)] text-white" : "bg-gray-200 text-gray-500"}`}
          >
            2
          </span>
          <span className={step >= 2 ? "text-gray-800 font-medium" : ""}>
            Étiquette
          </span>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
            <div>
              <FieldLabel required>Nom</FieldLabel>
              <Input
                value={name}
                onChange={setName}
                placeholder="Ex : Réfrigérateur"
              />
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
              <Input
                value={reference}
                onChange={setReference}
                placeholder="Ex : REF001_c1"
              />
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
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
            <p className="text-[13px] text-gray-600">
              Une étiquette QR sera générée à partir de la référence{" "}
              <span className="font-mono font-semibold">{reference}</span>.
            </p>
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-400 text-[13px]">
              Aperçu de l'étiquette QR
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {step === 2 && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Précédent
            </Button>
          )}
          {step === 1 ? (
            <Button
              className="flex-1"
              disabled={!canNext}
              onClick={() => setStep(2)}
            >
              Suivant
            </Button>
          ) : (
            <Button className="flex-1" onClick={() => {}}>
              Créer le matériel
            </Button>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
