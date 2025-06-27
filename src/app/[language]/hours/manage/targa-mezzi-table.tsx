import FormSelectExtendedInput from "@/components/form/select-extended/form-select-extended";
import { ArtAna } from "@/services/api/types/art-ana";
import { FilterItem, OthersFiltersItem } from "@/services/api/types/filter";
import { SortEnum } from "@/services/api/types/sort-type";
import { TargaMezzi } from "@/services/api/types/targa-mezzi";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import Star from "@mui/icons-material/Star";
import Box from "@mui/material/Box/Box";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { useGetTargaMezziQuery } from "../../admin-panel/targa-mezzi/queries/queries-eps-nestjs-targa-mezzi";

export const NO_TARGA_MEZZI_SELECTED = "NO_TARGA_MEZZI_SELECTED";

const AnelloGiallo = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        backgroundColor: "#003DA3",
        height: "100%",
        paddingTop: theme.spacing(1),
      }}
    >
      <div
        style={{
          position: "relative",
          marginLeft: theme.spacing(0.75),
          width: theme.spacing(3.125),
          height: theme.spacing(3.125),
          borderRadius: "50%",
          border: 2,
          borderColor: "#FFC300",
          borderStyle: "solid",
        }}
      />
    </div>
  );
};

const StelleEuropee = () => {
  const numStars = 8; // Numero di stelle
  const radius = 12; // Raggio del cerchio
  const starSize = 8; // Dimensione delle stelle

  const stars = [];
  for (let i = 0; i < numStars; i++) {
    const angle = (i / numStars) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    stars.push(
      <Star // Usa Star invece di StarFill e aggiungi fill="#FFC300"
        key={i}
        style={{
          position: "absolute",
          left: `calc(40% + ${x}px - ${starSize / 2}px)`,
          top: `calc(40% + ${y}px - ${starSize / 2}px)`,
          width: starSize,
          height: starSize,
          color: "#FFC300", // Colore delle stelle
        }}
      />
    );
  }

  return (
    <div style={{ backgroundColor: "#003DA3", height: "100%" }}>
      <div
        style={{
          width: 45,
          height: 50,
          position: "absolute", // Importante per posizionare le stelle relativamente a questo div
          display: "inline-block",
        }}
      >
        {stars}
      </div>
    </div>
  );
};

interface TargaMezziTableSelectProps {
  childrenCallBack: (artAna: ArtAna | null) => void;
  values: TargaMezzi[];
  artAna: ArtAna | null;
  storageKey: string;
}

const TargaMezziTableSelect = ({
  storageKey,
  childrenCallBack,
  values,
  artAna,
}: TargaMezziTableSelectProps) => {
  const schema = yup.object().shape({
    artAna: yup.object().shape({
      COD_ART: yup.string(),
      artAna: yup.object().shape({
        DES_ART: yup.string(),
      }),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      artAna: {
        COD_ART: artAna?.COD_ART,
        artAna: {
          DES_ART: artAna?.DES_ART,
        },
      },
    },
  });

  const [filterKey, setFilterKey] = useState<string>("");

  const [valuesFiltered, setValuesFiltered] = useState<TargaMezzi[]>(values);

  useEffect(() => {
    if (filterKey) {
      const filteredValues = values.filter((value) =>
        value.artAna?.DES_ART.toLowerCase().includes(filterKey.toLowerCase())
      );
      setValuesFiltered(filteredValues);
    } else {
      setValuesFiltered(values);
    }
  }, [filterKey, values]);

  return (
    <Box sx={{ m: 2 }} key={values.length}>
      <FormProvider {...methods}>
        <form>
          <FormSelectExtendedInput<EditArtAnaFormData, TargaMezzi>
            name={"artAna"}
            label={`Seleziona una targa`}
            options={valuesFiltered}
            renderSelected={(option) => option?.COD_ART ?? ""}
            renderOption={(option) =>
              option?.COD_ART
                ? `${option.COD_ART} ${option.artAna?.DES_ART ?? ""}`
                : ""
            }
            keyExtractor={(option) => option?.COD_ART ?? ""}
            isSearchable={true}
            searchLabel="Search"
            searchPlaceholder="Search options..."
            search={filterKey}
            onSearchChange={(value) => {
              setFilterKey(value);
            }}
            onChangeCallback={(artAna) => {
              if (artAna) {
                localStorage.setItem(storageKey, artAna.COD_ART);
              } else {
                localStorage.removeItem(storageKey);
              }
              childrenCallBack(artAna?.artAna ?? null);
            }}
          />
        </form>
      </FormProvider>
    </Box>
  );
};

// function App() {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();
//   const onSubmit = (data: any) => console.log(data);

//   console.log(watch("example"));

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input defaultValue="test" {...register("example")} />
//       <input {...register("exampleRequired", { required: true })} />
//       {errors.exampleRequired && <span>This field is required</span>}
//       <button>Submit</button>
//     </form>
//   );
// }

type EpsNestjsTargaMezziKeys = keyof TargaMezzi;

interface TargaMezziTableProps {
  childrenCallBack: (artAna: ArtAna) => React.ReactElement;
}

export type EditArtAnaFormData = {
  id: string;
  COD_ART: string;
  artAna: {
    COD_ART: string;
    DES_ART: string;
  };
};

const TargaMezziTable = ({
  childrenCallBack: children,
}: TargaMezziTableProps) => {
  const searchParams = useSearchParams();

  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.size === 0) {
      setOthersFilters([]);
      setFilters([]);
      setSort({ order: SortEnum.ASC, orderBy: "COD_ART" });
    }
  }, [searchParams.size]);

  const [othersFilters, setOthersFilters] = useState<Array<OthersFiltersItem>>(
    () => {
      const searchParamsOthersFilters = searchParams.get("othersFilters");
      if (searchParamsOthersFilters) {
        const of = JSON.parse(searchParamsOthersFilters);
        return of;
      }
      return [];
    }
  );

  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: EpsNestjsTargaMezziKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.ASC, orderBy: "createdAt" };
  });

  const [filters, setFilters] = useState<Array<FilterItem<TargaMezzi>>>(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter);
    }
    return [];
  });

  const { data } = useGetTargaMezziQuery({
    sort: { order, orderBy },
    filters,
    othersFilters,
  });

  const [targaMezziSelected, setTargaMezziSelected] = useState<ArtAna | null>(
    null
  );

  let STORAGE_KEY = "TARGA_MEZZI_DEFAULT";

  if (pathname.indexOf("step1_km_autista") > -1) {
    STORAGE_KEY = "TARGA_MEZZI_DEFAULT_KM_AUTISTA";
  }

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as TargaMezzi[]) ??
      ([] as TargaMezzi[]);

    const targaSelected = localStorage.getItem(STORAGE_KEY) || "";

    const selectedItem = result.find((it) => it.COD_ART === targaSelected);

    if (result.length !== 0) {
      if (selectedItem !== undefined && selectedItem?.artAna !== null) {
        setTargaMezziSelected(selectedItem.artAna as ArtAna);
      } else {
        setTargaMezziSelected({
          COD_ART: "",
          DES_ART: "",
        } as ArtAna);
      }
    }
    return removeDuplicatesFromArrayObjects(result, "COD_ART");
  }, [data]);

  return (
    <>
      <Grid
        container
        direction="row"
        style={{
          borderRadius: 6,
          borderWidth: 4,
          borderStyle: "solid",
          borderColor: "black",
          boxShadow: `4px 4px 4px gray`,
        }}
        sx={{ mb: 3 }}
      >
        <Grid size={{ xs: 1 }}>
          <StelleEuropee />
        </Grid>
        <Grid size={{ xs: 10 }}>
          {targaMezziSelected !== null && (
            <TargaMezziTableSelect
              storageKey={STORAGE_KEY}
              childrenCallBack={(artAna: ArtAna | null) => {
                //
                setTargaMezziSelected(
                  artAna ||
                    ({
                      COD_ART: "",
                      DES_ART: "",
                    } as ArtAna)
                );
              }}
              values={result}
              artAna={targaMezziSelected}
            />
          )}
        </Grid>
        <Grid size={{ xs: 1 }}>
          <AnelloGiallo />
        </Grid>
      </Grid>
      {targaMezziSelected && targaMezziSelected?.COD_ART !== "" && (
        <Box sx={{ m: 2 }}>{children(targaMezziSelected)}</Box>
      )}
    </>
  );
};

export default TargaMezziTable;
