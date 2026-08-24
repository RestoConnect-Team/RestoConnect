import { useFetchData } from "@/hooks/useFetchData";
import { Profile, fetchProfilInfo } from "@/lib/api/my_profil_info";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../../ui/button";
import { ReactNode } from "react";

interface WelcomeSlide {
  bgColor: string;
  node: ReactNode;
  img?: ReactNode;
}

export default function getWelcomeSlides(
  index: number,
  setIndex: (i: number) => void,
) {
  const { data: profile } = useFetchData<Profile>(fetchProfilInfo);

  const slides: WelcomeSlide[] = [
    {
      bgColor: "bg-gradient-to-r from-[#CB006B] to-[#960050]",
      node: (
        <>
          <div className="flex flex-col">
            <h1 className="font-bold">Bonjour {profile?.name} !</h1>
            <sub className="font-semibold text-gray-400 text-sm">
              Bienvenue sur RestoConnect
            </sub>
          </div>
          <p>
            L'outil de gestion du matériel des Restos du Cœur 77. Simple,
            rapide, et accessible depuis votre téléphone.
          </p>
          <Button onClick={() => setIndex(1)}>Découvrir en 3 étapes</Button>
          <p className="text-gray-400 text-sm">
            Vous pouvez revoir ce guide depuis{" "}
            <span className="font-semibold">Mon profil</span> à tout moment.
          </p>
        </>
      ),
    },
    {
      img: <img src={"/welcome/scan.svg"} />,
      bgColor: "bg-gradient-to-r from-[#1A6A82] to-[#0D4F62]",
      node: (
        <>
          <div className="uppercase text-xs w-fit py-1 px-3 rounded-full text-[#1A6A82] bg-[#EAF5FA] font-bold">
            📱 Scanner
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold">Scannez une étiquette</h1>
            <sub className="font-semibold text-gray-400 text-sm">
              L'action numéro 1 sur le terrain
            </sub>
          </div>
          <p>
            Pointez votre téléphone vers l'étiquette d'un matériel. Sa fiche
            s'affiche instantanément, même en connexion faible.
          </p>
          <div className="w-full flex justify-center">
            <div className="flex gap-5 w-[75%]">
              <Button
                onClick={() => setIndex(index - 1)}
                variant="discreet"
                className="!h-10 flex-1 !text-gray-400 hover:!text-[#cb006b]"
              >
                <ArrowLeft />
              </Button>
              <Button className="flex-1" onClick={() => setIndex(index + 1)}>
                Suivant
                <ArrowRight />
              </Button>
            </div>
          </div>
        </>
      ),
    },
    {
      bgColor: "bg-gradient-to-r from-[#2D6B31] to-[#1A4A1D]",
      node: (
        <>
          <div className="uppercase text-xs w-fit py-1 px-3 rounded-full text-[#1A6A82] bg-[#F0F7F0] font-bold">
            📋 Inventaire
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold">Faites l'inventaire</h1>
            <sub className="font-semibold text-gray-400 text-sm">
              Scan par scan, en toute simplicité
            </sub>
          </div>
          <p>
            Scannez les étiquettes et indiquez si chaque matériel est présent,
            manquant ou endommagé. Vous pouvez faire une pause et reprendre plus
            tard.
          </p>
          <div className="flex gap-5 w-[75%]">
            <Button
              onClick={() => setIndex(index - 1)}
              variant="discreet"
              className="!h-10 flex-1 !text-gray-400 hover:!text-[#cb006b]"
            >
              <ArrowLeft />
            </Button>
            <Button className="flex-1" onClick={() => setIndex(index + 1)}>
              Suivant
              <ArrowRight />
            </Button>
          </div>
        </>
      ),
    },
    {
      bgColor: "bg-gradient-to-r from-[#DB8000] to-[#6B3500]",
      node: (
        <>
          <div className="uppercase text-xs w-fit py-1 px-3 rounded-full text-[#C47300] bg-[#FFEED7] font-bold">
            🔔 Signaler
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold">Signalez un problème</h1>
            <sub className="font-semibold text-gray-400 text-sm">
              En 2 clics, depuis n'importe où
            </sub>
          </div>
          <p>
            Matériel abîmé, introuvable ou étiquette illisible ? Envoyez un
            signalement directement au responsable de votre centre.
          </p>
          <div className="flex gap-5 w-[75%]">
            <Button
              onClick={() => setIndex(index - 1)}
              variant="discreet"
              className="!h-10 flex-1 !text-gray-400 hover:!text-[#cb006b]"
            >
              <ArrowLeft />
            </Button>
            <Button className="flex-1" onClick={() => {}}>
              C'est parti !
            </Button>
          </div>
        </>
      ),
    },
  ];

  return slides;
}
