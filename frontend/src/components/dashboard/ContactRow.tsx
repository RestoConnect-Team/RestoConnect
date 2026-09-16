import { Row } from "@/app/dashboard/page";
import { ContactInfo } from "@/lib/api/center_detail_info";
import { getInitials } from "@/utils/getInitials";

interface ContactRowProps {
  contact: ContactInfo;
  centerName?: string;
  idx: number;
  isHead?: boolean;
}

function getInitialsColors(idx: number) {
  const colors = [
    "text-[var(--accent-foreground)] bg-[var(--accent)]",
    "text-purple-600 bg-purple-100",
    "text-blue-700 bg-blue-100",
    "text-teal-600 bg-teal-100",
    "text-green-600 bg-green-100",
    "text-amber-600 bg-amber-100",
  ];
  return colors[idx % colors.length];
}

export function renderPhone(phoneNumber: string) {
  return (
    <a
      className={"hover:text-[#e6007e] transition-all"}
      href={`telto:${phoneNumber}`}
    >
      {phoneNumber}
    </a>
  );
}

export function renderMail(mail: string) {
  return (
    <a
      className={"hover:text-[#e6007e] transition-all"}
      href={`mailto:${mail}`}
    >
      {mail}
    </a>
  );
}

export function ContactRow({
  contact,
  centerName,
  idx,
  isHead = false,
}: ContactRowProps) {
  const colors = getInitialsColors(idx);
  const online = idx % 2 === 0;
  return (
    <div
      className={`${isHead ? "" : "border-t border-gray-100 pt-3"} flex flex-col gap-3 first:pt-0 first:mt-0 first:border-0`}
    >
      <div className="flex w-full gap-3">
        <div
          className={`w-9 h-9 rounded-full ${colors} text-[12px] font-bold flex items-center justify-center shrink-0`}
        >
          {getInitials(contact)}
        </div>
        <div className="flex flex-1 items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">
              {contact.name} {contact.lastname.toUpperCase()}
            </p>
            {isHead ? (
              <p className="text-xs text-gray-500">
                {centerName && centerName}
                {` · `}
                <span className="text-[#e6007e] font-medium">
                  {contact.status}
                </span>
              </p>
            ) : (
              <div className="text-xs text-gray-500">
                <p>
                  {contact.status && contact.status}
                  {` · `}
                  {contact.telephone && renderPhone(contact.telephone)}
                  {` · `}
                  {contact.email && renderMail(contact.email)}
                </p>
              </div>
            )}
          </div>
          <span
            className={`w-2 h-2 rounded-full ${online ? "bg-green-400" : "bg-gray-300"}`}
          />
        </div>
      </div>
      <div>
        {isHead && (
          <div className="flex flex-col">
            {contact.email && (
              <Row label="Adresse email" value={renderMail(contact.email)} />
            )}
            {contact.telephone && (
              <Row label="Téléphone" value={renderPhone(contact.telephone)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
