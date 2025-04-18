import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import GestioneOreOperatori from "./page-content-operatori";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(
    params.language,
    "admin-panel-users"
  );

  return {
    title: "Articoli Costi",
  };
}

export default function Page() {
  return <GestioneOreOperatori />;
}
