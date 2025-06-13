import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { User } from "@/services/api/types/user";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGetMeQuery } from "./queries/queries";

interface OperatoreSelectedProps {
  text: string;
}

export const OperatoreSelected: React.FC<OperatoreSelectedProps> = ({
  text,
}) => {
  const searchParams = useSearchParams();
  const COD_OP = searchParams.get("COD_OP");

  const [userSelected, setUserSelected] = useState<User | null>();
  const fetchGetMe = useGetMeQuery();
  useEffect(() => {
    const fetchUser = async () => {
      if (COD_OP) {
        const { data, status } = await fetchGetMe({
          COD_OP,
        });
        if (status === HTTP_CODES_ENUM.OK) {
          setUserSelected(data as User);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <Typography variant="h5" gutterBottom>
      {userSelected?.firstName} {userSelected?.lastName}, {text}
    </Typography>
  );
};
