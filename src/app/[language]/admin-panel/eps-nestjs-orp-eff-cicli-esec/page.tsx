import type { Metadata } from "next";
import GestioneOreOperatori from "./page-content-operatori";

// type Props = {
//   params: Promise<{ language: string }>;
// };

export async function generateMetadata(): Promise<Metadata> {
  // const params = await props.params;
  // const { t } = await getServerTranslation(
  //   params.language,
  //   "admin-panel-users"
  // );

  return {
    title: "Gestione Ore Operatori",
  };
}

export default function Page() {
  return <GestioneOreOperatori />;
}
