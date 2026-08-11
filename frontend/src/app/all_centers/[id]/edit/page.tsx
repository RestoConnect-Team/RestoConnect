"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Calendar, Clock, X } from "lucide-react";
import {
  fetchCenterDetail,
  updateCenter,
  Center,
  ClosingPeriod,
} from "@/lib/api/center_detail_info";
import Loading from "@/components/loading/loading";
import PageError from "@/components/page_error/page_error";
import { PageLayout } from "@/components/layout/PageLayout";

// ── types ─────────────────────────────────────────────────────────────────────

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

interface TimeSlotRow {
  opening_time: string;
  closing_time: string;
}
interface DaySchedule {
  open: boolean;
  slots: TimeSlotRow[];
}

// ── helpers ───────────────────────────────────────────────────────────────────

function toHHMM(t: string) {
  // "09:00:00" → "09:00"
  return t.slice(0, 5);
}

function buildScheduleState(
  raw: Record<string, { opening_time: string; closing_time: string }[]>,
): Record<string, DaySchedule> {
  const result: Record<string, DaySchedule> = {};
  for (const day of DAYS) {
    const slots = raw[day] ?? [];
    result[day] = {
      open: slots.length > 0,
      slots:
        slots.length > 0
          ? slots.map((s) => ({
              opening_time: toHHMM(s.opening_time),
              closing_time: toHHMM(s.closing_time),
            }))
          : [{ opening_time: "09:00", closing_time: "17:00" }],
    };
  }
  return result;
}

// ── sub-components ────────────────────────────────────────────────────────────

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
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-[13px] text-gray-800 focus:outline-none focus:border-[rgb(230,0,126)] ${className}`}
    />
  );
}

function Textarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[13px] text-gray-800 focus:outline-none focus:border-[rgb(230,0,126)] resize-none"
    />
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <h2 className="text-[15px] font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function EditCenterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [center, setCenter] = useState<Center | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // form state
  const [telephone, setTelephone] = useState("");
  const [emailCenter, setEmailCenter] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});
  const [closingPeriods, setClosingPeriods] = useState<ClosingPeriod[]>([]);
  const [headFirstname, setHeadFirstname] = useState("");
  const [headLastname, setHeadLastname] = useState("");
  const [headTelephone, setHeadTelephone] = useState("");
  const [headEmail, setHeadEmail] = useState("");

  useEffect(() => {
    fetchCenterDetail(Number(id))()
      .then((data) => {
        setCenter(data);
        setTelephone(data.telephone ?? "");
        setEmailCenter(data.email ?? "");
        const addr = [
          data.street_number,
          data.street,
          data.postal_code,
          data.city,
        ]
          .filter(Boolean)
          .join(" ");
        setAddress(addr);
        setDescription(data.description ?? "");
        setTags(
          data.activities
            ? data.activities
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        );
        setSchedule(buildScheduleState(data.center_schedule.schedule));
        setClosingPeriods(data.closing_periods ?? []);
        setHeadFirstname(data.center_headmaster_name);
        setHeadLastname(data.center_headmaster_lastname);
        setHeadTelephone(data.center_headmaster_telephone);
        setHeadEmail(data.center_headmaster_email);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // ── schedule helpers ────────────────────────────────────────────────────────

  function toggleDay(day: string) {
    setSchedule((s) => ({ ...s, [day]: { ...s[day], open: !s[day].open } }));
  }

  function updateSlot(
    day: string,
    idx: number,
    field: keyof TimeSlotRow,
    value: string,
  ) {
    setSchedule((s) => {
      const slots = s[day].slots.map((sl, i) =>
        i === idx ? { ...sl, [field]: value } : sl,
      );
      return { ...s, [day]: { ...s[day], slots } };
    });
  }

  function addSlot(day: string) {
    setSchedule((s) => ({
      ...s,
      [day]: {
        ...s[day],
        slots: [
          ...s[day].slots,
          { opening_time: "09:00", closing_time: "17:00" },
        ],
      },
    }));
  }

  function removeSlot(day: string, idx: number) {
    setSchedule((s) => {
      const slots = s[day].slots.filter((_, i) => i !== idx);
      return {
        ...s,
        [day]: {
          ...s[day],
          slots:
            slots.length > 0
              ? slots
              : [{ opening_time: "09:00", closing_time: "17:00" }],
        },
      };
    });
  }

  // ── closing period helpers ──────────────────────────────────────────────────

  function addClosingPeriod() {
    setClosingPeriods((p) => [...p, { start_date: "", end_date: "" }]);
  }

  function removeClosingPeriod(idx: number) {
    setClosingPeriods((p) => p.filter((_, i) => i !== idx));
  }

  function updateClosingPeriod(
    idx: number,
    field: keyof ClosingPeriod,
    value: string,
  ) {
    setClosingPeriods((p) =>
      p.map((cp, i) => (i === idx ? { ...cp, [field]: value } : cp)),
    );
  }

  // ── save ────────────────────────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    try {
      const schedulePayload: Record<
        string,
        { opening_time: string; closing_time: string }[]
      > = {};
      for (const [day, ds] of Object.entries(schedule)) {
        if (ds.open) schedulePayload[day] = ds.slots;
      }
      await updateCenter(Number(id), {
        telephone,
        email: emailCenter,
        address,
        description,
        activities: tags.join(", "),
        schedule: schedulePayload,
        closing_periods: closingPeriods.filter(
          (cp) => cp.start_date && cp.end_date,
        ),
        headmaster_firstname: headFirstname,
        headmaster_lastname: headLastname,
        headmaster_telephone: headTelephone,
        headmaster_email: headEmail,
      });
      router.push(`/all_centers/${id}`);
    } catch (e) {
      setSaveError(
        e instanceof Error ? e.message : "Erreur lors de la sauvegarde",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="p-8">
        <Loading loading_sentence="Chargement..." />
      </div>
    );
  if (error)
    return (
      <div className="p-8">
        <PageError page_error={error} />
      </div>
    );
  if (!center) return null;

  return (
    <PageLayout>
      <div className="p-6">
        {/* Back link */}
        <Link
          href={`/all_centers/${id}`}
          className="inline-flex items-center gap-1 text-[12px] text-[rgb(230,0,126)] mb-4 hover:underline"
        >
          <ArrowLeft size={13} /> Retour au tableau de bord
        </Link>

        <h1 className="text-[20px] font-bold text-gray-900 mb-5">
          Modifier le centre
        </h1>

        {/* Center name badge */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
            <span className="text-[rgb(230,0,126)] text-lg font-bold">🏠</span>
          </div>
          <div>
            <p className="text-[14px] font-bold text-gray-900">{center.name}</p>
            <p className="text-[12px] text-gray-500">@ {center.city}</p>
          </div>
        </div>

        {saveError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-700">
            {saveError}
          </div>
        )}

        {/* Informations */}
        <Section title="Informations">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <FieldLabel required>Téléphone</FieldLabel>
              <Input
                value={telephone}
                onChange={setTelephone}
                placeholder="01 00 00 00 00"
              />
            </div>
            <div>
              <FieldLabel required>Adresse email</FieldLabel>
              <Input
                value={emailCenter}
                onChange={setEmailCenter}
                placeholder="centre@resto.org"
              />
            </div>
          </div>
          <div className="mb-3">
            <FieldLabel>Adresse</FieldLabel>
            <Input
              value={address}
              onChange={setAddress}
              placeholder="12 Rue de la Paix 75000 Paris"
            />
          </div>
          <div className="mb-3">
            <FieldLabel>Description</FieldLabel>
            <Textarea value={description} onChange={setDescription} />
          </div>
          <div>
            <FieldLabel>Tags</FieldLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 text-[12px] text-gray-700 bg-gray-50"
                >
                  {tag}
                  <button
                    onClick={() => setTags((t) => t.filter((x) => x !== tag))}
                    className="text-gray-400 hover:text-red-500 ml-1"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              <button
                onClick={() => {
                  if (newTag.trim()) {
                    setTags((t) => [...t, newTag.trim()]);
                    setNewTag("");
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-gray-300 text-[12px] text-gray-500 hover:border-[rgb(230,0,126)] hover:text-[rgb(230,0,126)]"
              >
                <Plus size={11} /> Ajouter
              </button>
            </div>
            {tags.length === 0 && (
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (newTag.trim()) {
                      setTags((t) => [...t, newTag.trim()]);
                      setNewTag("");
                    }
                  }
                }}
                placeholder="Nouveau tag…"
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-[12px] focus:outline-none focus:border-[rgb(230,0,126)]"
              />
            )}
          </div>
        </Section>

        {/* Horaires */}
        <Section title="Horaires et jours d'ouverture">
          {DAYS.map((day) => {
            const ds = schedule[day];
            if (!ds) return null;
            return (
              <div key={day} className="mb-3">
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-24 text-[13px] text-gray-700 font-medium">
                    {day}
                  </span>
                  <label className="flex items-center gap-1.5 text-[12px] text-gray-500 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!ds.open}
                      onChange={() => toggleDay(day)}
                      className="accent-[rgb(230,0,126)]"
                    />
                    Fermé
                  </label>
                </div>
                {ds.open && (
                  <div className="ml-24 space-y-2">
                    {ds.slots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[11px] text-gray-400 mb-0.5">
                              Ouverture
                            </p>
                            <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1.5">
                              <Clock
                                size={12}
                                className="text-[rgb(230,0,126)]"
                              />
                              <input
                                type="time"
                                value={slot.opening_time}
                                onChange={(e) =>
                                  updateSlot(
                                    day,
                                    idx,
                                    "opening_time",
                                    e.target.value,
                                  )
                                }
                                className="text-[13px] text-gray-800 focus:outline-none flex-1 bg-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] text-gray-400 mb-0.5">
                              Fermeture
                            </p>
                            <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1.5">
                              <Clock
                                size={12}
                                className="text-[rgb(230,0,126)]"
                              />
                              <input
                                type="time"
                                value={slot.closing_time}
                                onChange={(e) =>
                                  updateSlot(
                                    day,
                                    idx,
                                    "closing_time",
                                    e.target.value,
                                  )
                                }
                                className="text-[13px] text-gray-800 focus:outline-none flex-1 bg-transparent"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => addSlot(day)}
                          className="p-1.5 text-gray-400 hover:text-[rgb(230,0,126)]"
                        >
                          <Plus size={16} />
                        </button>
                        {ds.slots.length > 1 && (
                          <button
                            onClick={() => removeSlot(day, idx)}
                            className="p-1.5 text-gray-300 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </Section>

        {/* Closing periods */}
        <Section title="Période de fermeture">
          {closingPeriods.map((cp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[13px] font-semibold text-gray-700">
                  Période {String(idx + 1).padStart(2, "0")}
                </p>
                <button
                  onClick={() => removeClosingPeriod(idx)}
                  className="text-gray-300 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Début</FieldLabel>
                  <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-2">
                    <Calendar size={13} className="text-[rgb(230,0,126)]" />
                    <input
                      type="date"
                      value={cp.start_date}
                      onChange={(e) =>
                        updateClosingPeriod(idx, "start_date", e.target.value)
                      }
                      className="text-[13px] text-gray-800 focus:outline-none flex-1 bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>Fin</FieldLabel>
                  <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-2">
                    <Calendar size={13} className="text-[rgb(230,0,126)]" />
                    <input
                      type="date"
                      value={cp.end_date}
                      onChange={(e) =>
                        updateClosingPeriod(idx, "end_date", e.target.value)
                      }
                      className="text-[13px] text-gray-800 focus:outline-none flex-1 bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addClosingPeriod}
            className="flex items-center gap-1 text-[12px] text-[rgb(230,0,126)] hover:underline"
          >
            <Plus size={13} /> Ajouter une période
          </button>
        </Section>

        {/* Responsable */}
        <Section title="Responsable">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <FieldLabel required>Prénom</FieldLabel>
              <Input value={headFirstname} onChange={setHeadFirstname} />
            </div>
            <div>
              <FieldLabel required>Nom</FieldLabel>
              <Input value={headLastname} onChange={setHeadLastname} />
            </div>
          </div>
          <div className="mb-3">
            <FieldLabel>Téléphone</FieldLabel>
            <Input value={headTelephone} onChange={setHeadTelephone} />
          </div>
          <div>
            <FieldLabel required>Adresse email</FieldLabel>
            <Input value={headEmail} onChange={setHeadEmail} />
          </div>
        </Section>

        {/* Contact (placeholder) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-gray-900">Contact</h2>
          <button className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-[rgb(230,0,126)] hover:text-[rgb(230,0,126)]">
            <Plus size={14} />
          </button>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3">
          <Link
            href={`/all_centers/${id}`}
            className="flex-1 py-3 text-center border-2 border-[rgb(230,0,126)] text-[rgb(230,0,126)] rounded-lg text-[14px] font-semibold hover:bg-pink-50 transition-colors"
          >
            Annuler
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 bg-[rgb(230,0,126)] text-white rounded-lg text-[14px] font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
          >
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : null}
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
