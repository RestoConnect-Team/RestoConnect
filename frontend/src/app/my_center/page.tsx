"use client";

import Link from "next/link";
import { useFetchData } from "@/hooks/useFetchData";
import {
  fetchMyCenterDetail,
  CenterDetail,
  ContactInfo,
  CenterAlert,
} from "@/lib/api/center_detail_info";
import PageError from "@/components/page_error/page_error";
import Loading from "@/components/loading/loading";
import {
  Home,
  Package,
  AlertTriangle,
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

// helpers

function initials(name: string, lastname: string) {
  return `${name[0] ?? ""}${lastname[0] ?? ""}`.toUpperCase();
}

function formatTime(t: string) {
  const [h, m] = t.split(":");
  return `${parseInt(h)}h${m}`;
}

function getInitialsBg(idx: number) {
  const colors = [
    "bg-pink-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-amber-500",
    "bg-teal-500",
  ];
  return colors[idx % colors.length];
}

// sub-components

function StatCard({
  value,
  label,
  sub,
  accent,
}: {
  value: string | number;
  label: string;
  sub: string;
  accent?: "pink" | "amber";
}) {
  const valueColor =
    accent === "pink"
      ? "text-[rgb(230,0,126)]"
      : accent === "amber"
        ? "text-amber-500"
        : "text-gray-900";
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex-1 min-w-0">
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-[13px] font-semibold text-gray-700 mt-0.5">{label}</p>
      <p className="text-[11px] text-gray-400">{sub}</p>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-1.5 text-[13px]">
      <span className="w-32 shrink-0 text-gray-400">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

function ContactRow({
  contact,
  idx,
  isHead = false,
}: {
  contact: ContactInfo;
  idx: number;
  isHead?: boolean;
}) {
  const bg = getInitialsBg(idx);
  const online = idx % 2 === 0;
  return (
    <div
      className={`${isHead ? "" : "border-t border-gray-100"} pt-3 mt-3 first:pt-0 first:mt-0 first:border-0`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-full ${bg} text-white text-[12px] font-bold flex items-center justify-center shrink-0`}
        >
          {initials(contact.name, contact.lastname)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-gray-900">
              {contact.name} {contact.lastname.toUpperCase()}
            </p>
            <span
              className={`w-2 h-2 rounded-full ${online ? "bg-green-400" : "bg-gray-300"}`}
            />
          </div>
          {isHead && (
            <p className="text-[11px] text-gray-500">
              <span className="text-[rgb(230,0,126)] font-medium">
                {contact.status}
              </span>
            </p>
          )}
          {!isHead && (
            <p className="text-[11px] text-gray-400">{contact.status}</p>
          )}
          <div className="mt-1.5 space-y-0.5 text-[12px] text-gray-500">
            {contact.telephone && <p>{contact.telephone}</p>}
            {contact.email && <p>{contact.email}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertRow({ alert, idx }: { alert: CenterAlert; idx: number }) {
  const icons: Record<string, React.ReactNode> = {
    missing_stock: <Package size={16} className="text-[rgb(230,0,126)]" />,
    inventory: <ClipboardList size={16} className="text-[rgb(230,0,126)]" />,
    info: <AlertTriangle size={16} className="text-amber-500" />,
  };
  const icon = icons[alert.alert_type] ?? icons.info;
  return (
    <div
      className={`flex items-start gap-3 py-3 ${idx > 0 ? "border-t border-gray-100" : ""}`}
    >
      <div className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-gray-800 leading-snug">
          {alert.message}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">{alert.time_ago}</p>
      </div>
      <span className="w-2 h-2 rounded-full bg-[rgb(230,0,126)] shrink-0 mt-1.5" />
    </div>
  );
}

// page

export default function MyCenter() {
  const {
    data: center,
    loading,
    error,
  } = useFetchData<CenterDetail>(fetchMyCenterDetail);

  return (
    <PageLayout>
      {error && <PageError page_error={error} />}
      {loading && (
        <Loading loading_sentence="Chargement des informations du centre..." />
      )}
      {!loading && center && <CenterDetailView center={center} />}
    </PageLayout>
  );
}

function CenterDetailView({ center }: { center: CenterDetail }) {
  const address = [
    center.street_number,
    center.street,
    center.postal_code,
    center.city?.toUpperCase(),
  ]
    .filter(Boolean)
    .join(" ");

  const activityTags = (center.activities ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  const scheduleEntries = Object.entries(
    center.center_schedule.schedule,
  ).filter(([, slots]) => slots.length > 0);

  const headmaster: ContactInfo = {
    id: 0,
    name: center.center_headmaster_name,
    lastname: center.center_headmaster_lastname,
    email: center.center_headmaster_email,
    telephone: center.center_headmaster_telephone,
    status: "Responsable",
    photo_url: null,
  };

  return (
    <div className="p-6">
      <div className="rounded-xl bg-gradient-to-r from-[rgb(230,0,126)] to-[rgb(200,0,100)] p-5 mb-4 relative overflow-hidden">
        <p className="text-[10px] font-bold text-white/80 tracking-widest uppercase mb-1">
          Mon centre
        </p>
        <h1 className="text-[22px] font-bold text-white leading-tight">
          {center.name}
        </h1>
        <div className="flex items-center gap-1 mt-1 text-white/80 text-[13px]">
          <MapPin size={12} />
          <span>{center.city}</span>
        </div>
        <div className="absolute top-4 right-4 w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
          <Home size={18} className="text-white" />
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <StatCard
          value={center.materials_count}
          label="Materiels"
          sub="dans mon centre"
        />
        <StatCard
          value={center.missing_count}
          label="Manquants"
          sub="a retrouver"
          accent="pink"
        />
        <StatCard
          value={
            center.days_since_last_inventory != null
              ? `${center.days_since_last_inventory} j.`
              : "-"
          }
          label="Inventaire"
          sub="depuis le dernier"
          accent="amber"
        />
      </div>
      <SectionCard>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-gray-900">Informations</h2>
          <Link
            href={`/all_centers/${center.center_id}/edit`}
            className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-[rgb(230,0,126)]"
          >
            <ChevronRight size={12} /> Modifier
          </Link>
        </div>
        <Row label="Telephone" value={center.center_headmaster_telephone} />
        <Row label="Adresse email" value={center.center_headmaster_email} />
        <Row label="Adresse" value={address} />
      </SectionCard>

      {activityTags.length > 0 && (
        <SectionCard>
          <h2 className="text-[15px] font-bold text-gray-900 mb-3">
            Activites
          </h2>
          <Row label="Description" value={center.activities} />
          <div className="flex flex-wrap gap-2 mt-3">
            {activityTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-gray-300 text-[12px] text-gray-700 bg-gray-50"
              >
                {tag}
              </span>
            ))}
          </div>
        </SectionCard>
      )}

      {scheduleEntries.length > 0 && (
        <SectionCard>
          <h2 className="text-[15px] font-bold text-gray-900 mb-3">
            Permanence
          </h2>
          <div className="flex gap-4 text-[13px]">
            <span className="w-32 shrink-0 text-gray-400">Horaires</span>
            <div className="space-y-1 text-gray-800">
              {scheduleEntries.map(([day, slots]) =>
                slots.map((slot, i) => (
                  <p key={`${day}-${i}`}>
                    {day}, {formatTime(slot.opening_time)} a{" "}
                    {formatTime(slot.closing_time)}
                  </p>
                )),
              )}
            </div>
          </div>
        </SectionCard>
      )}

      <SectionCard>
        <ContactRow contact={headmaster} idx={0} isHead />
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-[12px] text-gray-500">
          <div className="flex items-center gap-2">
            <Mail size={12} className="shrink-0" />
            <span>{center.center_headmaster_email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={12} className="shrink-0" />
            <span>{center.center_headmaster_telephone}</span>
          </div>
        </div>
      </SectionCard>

      {center.contacts.length > 0 && (
        <SectionCard>
          <h2 className="text-[15px] font-bold text-gray-900 mb-1">
            Contacts ({center.contacts.length})
          </h2>
          {center.contacts.map((contact, idx) => (
            <ContactRow key={contact.id} contact={contact} idx={idx + 1} />
          ))}
        </SectionCard>
      )}

      {center.alerts.length > 0 && (
        <SectionCard>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[15px] font-bold text-gray-900">
              Dernieres alertes
            </h2>
            <button className="text-[12px] text-[rgb(230,0,126)] hover:underline">
              Voir tout
            </button>
          </div>
          {center.alerts.map((alert, idx) => (
            <AlertRow key={idx} alert={alert} idx={idx} />
          ))}
        </SectionCard>
      )}
    </div>
  );
}
