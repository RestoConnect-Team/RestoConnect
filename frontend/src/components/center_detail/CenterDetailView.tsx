import { Row } from "@/app/my_center/page";
import { ContactInfo } from "@/lib/api/center_detail_info";
import { EquipmentService } from "@/services/equipment.service";
import { CenterDetails } from "@/types/center";
import { EquipmentItem } from "@/types/equipment";
import { renderCategoryIcon } from "@/utils/equipmentCategory";
import { renderStatus } from "@/utils/equipmentStatus";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { ChevronRight, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertRow } from "../dashboard/AlertRow";
import { CenterHeaderDashboard } from "../dashboard/CenterHeaderDashboard";
import { ContactRow, renderMail, renderPhone } from "../dashboard/ContactRow";
import { Stats } from "../dashboard/Stats";
import { Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { CenterHeader } from "./CenterHeader";

interface CenterDetailViewProps {
  center: CenterDetails;
  isDashboard?: boolean;
}

export function CenterDetailView({
  center,
  isDashboard = false,
}: CenterDetailViewProps) {
  // TODO: add in backend list of equipments in center details
  const [equipments, setEquipements] = useState<EquipmentItem[]>([]);

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
      {isDashboard ? (
        <Stats center={center} />
      ) : (
        <CenterHeader center={center} mode="view" />
      )}

      <Section withPadding={false}>
        {isDashboard && <CenterHeaderDashboard center={center} />}

        <div className="p-5 flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-bold text-gray-900">
                Informations
              </h2>
              {isDashboard && (
                <Button
                  variant="discreet"
                  onClick={() =>
                    router.push(`/all_centers/${center.center_id}/edit`)
                  }
                >
                  <SquarePen className="w-4 h-4 min-w-4 min-h-4" />
                  Modifier
                </Button>
              )}
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
      </Section>

      <Section>
        <ContactRow
          contact={headmaster}
          idx={0}
          isHead
          centerName={center.name}
        />
      </Section>

      {center.contacts.length > 0 && (
        <Section
          className="gap-3"
          title={`Contacts (${center.contacts.length})`}
        >
          <div className="flex flex-col gap-3">
            {center.contacts.map((contact, idx) => (
              <ContactRow key={contact.id} contact={contact} idx={idx + 1} />
            ))}
          </div>
        </Section>
      )}

      {isDashboard ? (
        <>
          {center.alerts.length > 0 && (
            <Section className="gap-3" title="Dernières alertes">
              <div className="flex items-center justify-between">
                <button className="cursor-pointer absolute top-5 right-5 text-[12px] text-[rgb(230,0,126)] hover:underline">
                  Voir tout
                </button>
              </div>
              <div>
                {center.alerts.map((alert, idx) => (
                  <AlertRow key={idx} alert={alert} idx={idx} />
                ))}
              </div>
            </Section>
          )}
        </>
      ) : (
        <>
          <Section title={`Matériels (${center.materials_count})`}>
            <div>
              {equipments.map((equipment) => {
                return (
                  <div
                    className="flex w-full justify-between items-center py-3 gap-3"
                    key={equipment.id}
                  >
                    {renderCategoryIcon(equipment.category)}
                    <div className="flex flex-col justify-center grow shrink truncate">
                      <p className="font-semibold truncate overflow-hidden shrink truncate">
                        {equipment.name}
                      </p>
                      <p className="text-slate-500 font-mono text-xs">
                        {equipment.reference}
                      </p>
                    </div>

                    {renderStatus(equipment.status, "flex-none px-2 h-8")}
                    <button
                      className="cursor-pointer flex-none"
                      onClick={() => {
                        router.push(`/equipment/${equipment.id}`);
                      }}
                    >
                      <ChevronRight className="text-slate-400 hover:text-slate-600 w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </Section>
          <Section title="Derniers inventaires">
            <></>
            {/* //TODO */}
          </Section>
        </>
      )}
    </div>
  );
}
