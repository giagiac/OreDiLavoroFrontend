import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import TargaMezzi from "./page-content";

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
    title: "Targhe Mezzi",
  };
}

export default function Page() {
  return <TargaMezzi />;
}
