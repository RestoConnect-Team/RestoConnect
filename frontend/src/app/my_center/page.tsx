"use client";

import { AlertRow } from "@/components/dashboard/AlertRow";
import {
  ContactRow,
  renderMail,
  renderPhone,
} from "@/components/dashboard/ContactRow";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageLayout } from "@/components/layout/PageLayout";
import Loading from "@/components/loading/loading";
import PageError from "@/components/page_error/page_error";
import { Button } from "@/components/ui/Button";
import { useFetchData } from "@/hooks/useFetchData";
import {
  CenterDetail,
  ContactInfo,
  fetchMyCenterDetail,
} from "@/lib/api/center_detail_info";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { Home, MapPin, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col bg-white rounded-xl border border-gray-200 ${className} `}
    >
      {children}
    </div>
  );
}

export function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 py-1.5 text-[13px] ml-12">
      <span className="w-35 shrink-0 text-gray-400">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

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
  const router = useRouter();
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
    <div className="p-6 flex flex-col gap-4">
      <div className="flex gap-3">
        <StatCard
          value={center.materials_count}
          label="Matériels"
          sub="dans mon centre"
        />
        <StatCard
          value={center.missing_count}
          label="Manquants"
          sub="à retrouver"
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
          accent="amber" //TODO déterminer à partir de quel niveau on passe d'orange à rouge
        />
      </div>
      <SectionCard>
        <div className="rounded-t-xl bg-gradient-to-r from-[rgb(230,0,126)] to-[rgb(200,0,100)] p-5 overflow-hidden">
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

        <div className="p-5 flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-bold text-gray-900">
                Informations
              </h2>
              <Button
                variant="discreet"
                onClick={() =>
                  router.push(`/all_centers/${center.center_id}/edit`)
                }
              >
                <SquarePen className="w-4 h-4 min-w-4 min-h-4" />
                Modifier
              </Button>
            </div>
            {center.center_headmaster_telephone && (
              <Row
                label="Téléphone"
                value={renderPhone(center.center_headmaster_telephone)}
              />
            )}
            {center.center_headmaster_email && (
              <Row
                label="Adresse email"
                value={renderMail(center.center_headmaster_email)}
              />
            )}
            <Row label="Adresse" value={address} />
          </div>

          {activityTags.length > 0 && (
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 mb-3">
                Activités
              </h2>
              <Row label="Description" value={center.activities} />
              <div className="flex flex-wrap gap-2 mt-3">
                {activityTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full font-medium border border-[#75BDD5] text-[12px] text-[#1A6A82] bg-[#EAF5FA]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            {scheduleEntries.length > 0 && (
              <>
                <h2 className="text-[15px] font-bold text-gray-900 mb-3">
                  Permanence
                </h2>
                <div className="flex gap-4 text-[13px]">
                  <Row
                    label="Horaires"
                    value={
                      <div className="space-y-1 text-gray-800">
                        {scheduleEntries.map(([day, slots]) =>
                          slots.map((slot, i) => (
                            <div key={`${day}-${i}`} className="flex">
                              <p className="w-25">{day}</p>{" "}
                              <p>
                                {formatTime(slot.opening_time)} -{" "}
                                {formatTime(slot.closing_time)}
                              </p>
                            </div>
                          )),
                        )}
                      </div>
                    }
                  />
                </div>
              </>
            )}
            {center.closing_periods.length > 0 && (
              <Row
                label="Période de fermeture"
                value={
                  <div className="space-y-1">
                    {center.closing_periods.map((period) => (
                      <p
                        key={period.id}
                        className="text-[#e6007e] font-semibold"
                      >
                        du {formatDate(period.start_date, true)} au{" "}
                        {formatDate(period.end_date, true)}
                      </p>
                    ))}
                  </div>
                }
              />
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <ContactRow
          contact={headmaster}
          idx={0}
          isHead
          centerName={center.name}
        />
      </SectionCard>

      {center.contacts.length > 0 && (
        <SectionCard className="p-5 gap-3">
          <h2 className="text-[15px] font-bold text-gray-900 mb-1">
            Contacts ({center.contacts.length})
          </h2>
          <div className="flex flex-col gap-3">
            {center.contacts.map((contact, idx) => (
              <ContactRow key={contact.id} contact={contact} idx={idx + 1} />
            ))}
          </div>
        </SectionCard>
      )}

      {center.alerts.length > 0 && (
        <SectionCard className="p-5 gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-gray-900">
              Dernieres alertes
            </h2>
            <button className="cursor-pointer text-[12px] text-[rgb(230,0,126)] hover:underline">
              Voir tout
            </button>
          </div>
          <div>
            {center.alerts.map((alert, idx) => (
              <AlertRow key={idx} alert={alert} idx={idx} />
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
