"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  CircleAlert,
  FileText,
  ShieldAlert,
  Wrench,
} from "lucide-react";

import { useFetchData } from "@/hooks/useFetchData";
import {
  fetchVehiculeInfos,
  VehiculeAlert,
  VehiculeDocument,
  VehiculeDetailResponse,
} from "@/lib/api/vehicule_infos";
import Loading from "@/components/loading/loading";
import PageError from "@/components/page_error/page_error";

function formatDate(date: string | null | undefined) {
  if (!date) return "Non définie";
  return new Date(date).toLocaleDateString("fr-FR");
}

function alertStyles(level: VehiculeAlert["level"]) {
  if (level === "expired") {
    return "border-red-200 bg-red-50 text-red-700";
  }
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function alertText(alert: VehiculeAlert) {
  if (alert.level === "expired") {
    return `Expiré depuis ${alert.expired_since ?? 0} jour(s)`;
  }
  if (alert.will_expire_in !== null) {
    return `Expire dans ${alert.will_expire_in} jour(s)`;
  }
  return `Expire le ${formatDate(alert.expire_date)}`;
}

function normalizeText(value: string | null | undefined) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function documentStatus(document: VehiculeDocument): { label: string; className: string } {
  if (!document.expiration_date) {
    return {
      label: "Sans expiration",
      className: "border-slate-200 bg-slate-50 text-slate-700",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expirationDate = new Date(document.expiration_date);
  expirationDate.setHours(0, 0, 0, 0);
  const daysLeft = Math.floor(
    (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) {
    return {
      label: `Expiré (${Math.abs(daysLeft)} j)`,
      className: "border-red-200 bg-red-50 text-red-700",
    };
  }

  if (daysLeft <= 30) {
    return {
      label: `Bientôt (${daysLeft} j)`,
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Valide",
    className: "border-green-200 bg-green-50 text-green-700",
  };
}

export default function VehiculeDetailPage() {
  const params = useParams();
  const vehiculeId = Number(params.id);

  const { data, loading, error } = useFetchData<VehiculeDetailResponse>(() =>
    fetchVehiculeInfos(vehiculeId)
  );

  const vehicule = data?.vehicule ?? null;

  const documentAlerts = useMemo(() => data?.document_alertes ?? [], [data]);
  const technicalInspectionAlert = data?.technical_inspection_alerte ?? null;
  const technicalInspectionAlreadyInDocumentAlerts = useMemo(() => {
    if (!technicalInspectionAlert) return false;

    const techDescription = normalizeText(technicalInspectionAlert.description);

    return documentAlerts.some((alert) => {
      const sameLevel = alert.level === technicalInspectionAlert.level;
      const sameExpireDate = alert.expire_date === technicalInspectionAlert.expire_date;
      const alertDescription = normalizeText(alert.description);
      const sameDescription = alertDescription === techDescription;

      return sameLevel && sameExpireDate && sameDescription;
    });
  }, [documentAlerts, technicalInspectionAlert]);

  if (loading) {
    return <Loading loading_sentence="Chargement du détail du véhicule..." />;
  }

  if (error) {
    return <PageError page_error={error} />;
  }

  if (!vehicule) {
    return <PageError page_error="Véhicule introuvable." />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 space-y-4">
        <Link href="/vehicule" className="text-sm text-[rgb(230,0,126)] hover:underline">
          ← Retour à la liste
        </Link>

        {documentAlerts.length > 0 ? (
          <div className="space-y-2">
            {documentAlerts.map((alert) => (
              <div
                key={`${alert.name}-${alert.description}-${alert.expire_date}`}
                className={`rounded-lg border px-3 py-2 text-sm ${alertStyles(alert.level)}`}
              >
                <p className="font-medium">{alert.description || "Alerte document"}</p>
                <p className="text-xs opacity-90">{alertText(alert)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            Tous les documents sont à jour.
          </div>
        )}

        {technicalInspectionAlert && !technicalInspectionAlreadyInDocumentAlerts && (
          <div className={`rounded-lg border px-3 py-2 text-sm ${alertStyles(technicalInspectionAlert.level)}`}>
            <p className="font-medium">Contrôle technique</p>
            <p className="text-xs opacity-90">{alertText(technicalInspectionAlert)}</p>
          </div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h1 className="text-2xl font-bold text-slate-900">{vehicule.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600">
              {vehicule.category || "Type non défini"}
            </span>
            <span
              className={`rounded-md border px-2.5 py-1 ${
                documentAlerts.some((a) => a.level === "expired")
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {documentAlerts.some((a) => a.level === "expired")
                ? "Document expiré"
                : "Documents conformes"}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Centre: {vehicule.center_name || "Non assigné"}</p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Informations générales</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Immatriculation</dt>
              <dd className="font-medium text-slate-800">{vehicule.immatriculation || "Non renseignée"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Type</dt>
              <dd className="font-medium text-slate-800">{vehicule.category || "Non défini"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Centre affecté</dt>
              <dd className="font-medium text-slate-800">{vehicule.center_name || "Non assigné"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Statut</dt>
              <dd className="font-medium text-slate-800">{vehicule.status || "Non défini"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Kilométrage</dt>
              <dd className="font-medium text-slate-800">{vehicule.nb_km.toLocaleString("fr-FR")} km</dd>
            </div>
            <div>
              <dt className="text-slate-500">Dernier contrôle technique</dt>
              <dd className="font-medium text-slate-800">{formatDate(vehicule.last_technical_inspection_date)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Prochain contrôle technique</dt>
              <dd className="font-medium text-slate-800">{formatDate(vehicule.next_technical_inspection_date)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Dernière révision</dt>
              <dd className="font-medium text-slate-800">{formatDate(vehicule.last_service_date)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Prochaine révision</dt>
              <dd className="font-medium text-slate-800">{formatDate(vehicule.next_service_date)}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Alertes documents ({documentAlerts.length})</h2>
          {documentAlerts.length === 0 ? (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 inline-flex items-center gap-2">
              <CheckCircle2 size={15} />
              Aucune alerte document
            </div>
          ) : (
            <ul className="space-y-2">
              {documentAlerts.map((alert) => (
                <li
                  key={`${alert.name}-${alert.description}-${alert.expire_date}-list`}
                  className={`rounded-lg border px-3 py-2 ${alertStyles(alert.level)}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {alert.level === "expired" ? (
                        <CircleAlert size={15} />
                      ) : (
                        <Wrench size={15} />
                      )}
                      <span className="font-medium text-sm">{alert.description || "Alerte"}</span>
                    </div>
                    <span className="text-xs">{formatDate(alert.expire_date)}</span>
                  </div>
                  <p className="text-xs mt-1 opacity-90">{alertText(alert)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Documents du véhicule ({data?.documents?.length ?? 0})
          </h2>
          {!data?.documents || data.documents.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Aucun document enregistré pour ce véhicule.
            </div>
          ) : (
            <ul className="space-y-2">
              {data.documents.map((document) => {
                const status = documentStatus(document);

                return (
                  <li key={document.id} className="rounded-lg border border-slate-200 px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm text-slate-800">{document.file_name}</p>
                        <p className="text-xs text-slate-500">
                          {document.description || "Sans description"}
                        </p>
                      </div>
                      <span className={`rounded-md border px-2 py-1 text-xs ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                      <p>Ajout: {formatDate(document.upload_date)}</p>
                      <p>Document: {formatDate(document.file_date)}</p>
                      <p>Expiration: {formatDate(document.expiration_date)}</p>
                    </div>
                    {document.file_url && (
                      <a
                        href={`http://localhost:8000${document.file_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-xs text-[rgb(230,0,126)] hover:underline"
                      >
                        Ouvrir le document
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Responsable du véhicule</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Nom</dt>
              <dd className="font-medium text-slate-800">
                {vehicule.responsable_name || vehicule.responsable_lastname
                  ? `${vehicule.responsable_name || ""} ${vehicule.responsable_lastname || ""}`.trim()
                  : "Non assigné"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium text-slate-800">{vehicule.responsable_email || "Non renseigné"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Téléphone</dt>
              <dd className="font-medium text-slate-800">{vehicule.responsable_phone || "Non renseigné"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Historique d'utilisation</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <FileText size={14} /> Sortie distribution - aujourd'hui
            </li>
            <li className="flex items-center gap-2">
              <ShieldAlert size={14} /> Retour entrepôt - il y a 2 jours
            </li>
            <li className="flex items-center gap-2">
              <FileText size={14} /> Révision effectuée - il y a 14 jours
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
