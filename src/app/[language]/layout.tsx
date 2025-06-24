import ResponsiveAppBar from "@/components/app-bar";
import ConfirmDialogProvider from "@/components/confirm-dialog/confirm-dialog-provider";
import ToastContainer from "@/components/snackbar-provider";
import InitColorSchemeScript from "@/components/theme/init-color-scheme-script";
import ThemeProvider from "@/components/theme/theme-provider";
import AuthProvider from "@/services/auth/auth-provider";
import { getServerTranslation } from "@/services/i18n";
import "@/services/i18n/config";
import { languages } from "@/services/i18n/config";
import StoreLanguageProvider from "@/services/i18n/store-language-provider";
import LeavePageProvider from "@/services/leave-page/leave-page-provider";
import queryClient from "@/services/react-query/query-client";
import QueryClientProvider from "@/services/react-query/query-client-provider";
import ReactQueryDevtools from "@/services/react-query/react-query-devtools";
import FacebookAuthProvider from "@/services/social-auth/facebook/facebook-auth-provider";
import GoogleAuthProvider from "@/services/social-auth/google/google-auth-provider";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { dir } from "i18next";
import type { Metadata } from "next";
import "../globals.css";
import Head from "next/head";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "common");

  return {
    title: t("title"),
    manifest: "/manifest.json",
    other: { pinterest: "nopin" },
  };
}

export function generateStaticParams() {
  return languages.map((language) => ({ language }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}) {
  const params = await props.params;

  const { language } = params;

  const { children } = props;

  return (
    <html lang={language} dir={dir(language)} suppressHydrationWarning>
      <Head>
        {/* This is where your viewport meta tag goes */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* Other meta tags, favicons, etc. */}
      </Head>
      <body suppressHydrationWarning>
        <Analytics />
        <SpeedInsights />
        <InitColorSchemeScript />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ThemeProvider>
            <CssBaseline />

            <StoreLanguageProvider>
              <ConfirmDialogProvider>
                <AuthProvider>
                  <GoogleAuthProvider>
                    <FacebookAuthProvider>
                      <LeavePageProvider>
                        <ResponsiveAppBar />
                        <Box
                          mt={12}
                          mb={20}
                          sx={{
                            minWidth: { xs: 290 },
                            display: "flex",
                            flexDirection: "column", // o 'row' a seconda delle tue esigenze
                            alignItems: "center", // Centra orizzontalmente se flexDirection è 'column', verticalmente se 'row'
                            justifyContent: "center", // Centra verticalmente se flexDirection è 'column', orizzontalmente se 'row'
                            width: "100%",
                          }}
                        >
                          {children}
                        </Box>
                        <ToastContainer
                          position="bottom-left"
                          hideProgressBar
                        />
                      </LeavePageProvider>
                    </FacebookAuthProvider>
                  </GoogleAuthProvider>
                </AuthProvider>
              </ConfirmDialogProvider>
            </StoreLanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
