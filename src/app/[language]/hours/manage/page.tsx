import type { Metadata } from "next";
import PageContent from "./page-content";

// type Props = {
//   params: Promise<{ language: string }>;
// };

export async function generateMetadata(): Promise<Metadata> {
  //props: Props
  // const params = await props.params;
  // const { t } = await getServerTranslation(
  //   params.language,
  //   "admin-panel-users"
  // );

  return {
    title: "Inserimento Ore",
  };
}

export default function Page() {
  return <PageContent />;
}
