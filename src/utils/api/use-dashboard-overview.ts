import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import handleSupabaseErrors from "../handle-supabase-errors";
import { definitions } from "@/types/supabase-generated";

export type UseDashboardOverviewResponse = {
  team_name: string;
  account_id: string;
  account_role: definitions["account_user"]["account_role"];
  subscription_active: boolean;
  subscription_status: definitions["billing_subscriptions"]["status"];
  personal_account: boolean;
  team_account: boolean;
}[];

export default function useDashboardOverview(
  options?: UseQueryOptions<UseDashboardOverviewResponse>
) {
  const { user } = useUser();
  return useQuery<UseDashboardOverviewResponse, Error>(
    ["dashboardOverview", user?.id],
    async () => {
      const { data, error } = await supabaseClient
        .from("accounts")
        .select(
          "team_name, id, personal_account, billing_subscriptions (status), account_user!inner(account_role)"
        )
        .eq("account_user.user_id", user?.id);

      handleSupabaseErrors(data, error);

      return data?.map((account) => ({
        team_name: account.team_name,
        account_id: account.id,
        account_role: account.account_user?.[0]?.account_role,
        subscription_active: ["active", "trialing"].includes(
          account.billing_subscriptions?.[0]?.status
        ),
        subscription_status: account.billing_subscriptions?.[0]?.status,
        personal_account: account.personal_account,
        team_account: !account.personal_account,
      }));
    },
    {
      ...options,
      enabled: !!user,
    }
  );
}
