import { ContactInfo } from "@/lib/api/center_detail_info";
import { CenterDetails } from "@/types/center";
import { AlertRow } from "../dashboard/AlertRow";
import { ContactRow, renderMail, renderPhone } from "../dashboard/ContactRow";
import { StatCard } from "../dashboard/StatCard";
import { SectionCard } from "../layout/SectionCard";
import { CenterHeaderDashboard } from "../dashboard/CenterHeaderDashboard";
import { CenterHeader } from "./CenterHeader";
import { Row } from "@/app/my_center/page";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { SquarePen } from "lucide-react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { Stats } from "../dashboard/Stats";

export function CenterDetailView({
  center,
  isDashboard = false,
}: {
  center: CenterDetails;
  isDashboard?: boolean;
}) {
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
        <CenterHeader center={center} />
      )}

      <SectionCard>
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

      {isDashboard ? (
        <>
          {center.alerts.length > 0 && (
            <SectionCard className="p-5 gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-gray-900">
                  Dernières alertes
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
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
