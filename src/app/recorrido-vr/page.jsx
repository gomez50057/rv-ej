import { redirect } from "next/navigation";

export const metadata = {
  title: "Recorrido VR | Maqueta Urbana",
  description:
    "Recorrido 3D interactivo en modo VR/Cardboard para una maqueta urbana.",
};

export default function Page() {
  redirect("/recorrido-vr/index.html");
}
