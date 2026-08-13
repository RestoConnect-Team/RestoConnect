import { CenterDetails } from "@/types/center";
import { StatCard } from "./StatCard";

interface StatsProps {
  center: CenterDetails;
}

export function Stats({ center }: StatsProps) {
  return (
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
  );
}
