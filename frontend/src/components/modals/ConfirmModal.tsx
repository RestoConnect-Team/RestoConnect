import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-150"></div>
      <div className="absolute top-[50%] left-[50%] bg-white flex flex-col p-10 z-151 -translate-[50%] rounded-xl shadow-xl flex items-center gap-5">
        <div className="flex bg-[#cb006b]/10 text-[#cb006b] rounded-full p-3 w-fit">
          <Trash2 />
        </div>
        <h2>Êtes-vous sûr de supprimer l'élément ?</h2>
        <div className="flex w-full gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onCancel()}
          >
            Annuler
          </Button>
          <Button className="w-full" onClick={() => onConfirm()}>
            Confirmer
          </Button>
        </div>
      </div>
    </>
  );
}
