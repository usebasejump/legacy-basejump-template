import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import handleSupabaseErrors from "../handle-supabase-errors";
import { definitions } from "@/types/supabase-generated";

type TeamAccountWithRole = definitions["accounts"] & {
  account_role: string;
};

export default function useTeamAccounts(
  options?: UseQueryOptions<TeamAccountWithRole[]>
) {
  const { user } = useUser();
  return useQuery<TeamAccountWithRole[], Error>(
    ["teamAccounts", user?.id],
    async () => {
      const { data, error } = await supabaseClient
        .from("account_user")
        .select("account_role, account:account_id (*)")
        .eq("user_id", user?.id);
      handleSupabaseErrors(data, error);

      return data
        ?.filter((a) => a.account?.personal_account === false)
        ?.map(({ account_role, account }) => ({
          ...account,
          account_role,
        }));
    },
    {
      ...options,
      enabled: !!user,
    }
  );
}
