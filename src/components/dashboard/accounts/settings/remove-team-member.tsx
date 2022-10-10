import { useMutation, useQueryClient } from "@tanstack/react-query";
import useTranslation from "next-translate/useTranslation";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";
import { Button } from "react-daisyui";
import { UseTeamMembersResponse } from "@/utils/api/use-team-members";

type Props = {
  member: UseTeamMembersResponse;
  onComplete?: () => void;
};

const RemoveTeamMember = ({ member, onComplete }: Props) => {
  const queryClient = useQueryClient();

  const { t } = useTranslation("dashboard");

  const removeMember = useMutation(async () => {
    const { error } = await supabaseClient
      .from("account_user")
      .delete()
      .eq("user_id", member.user_id)
      .eq("account_id", member.account_id);
    if (error) {
      toast.error(error.message);
    }
    await queryClient.invalidateQueries(["teamMembers"]);
    if (onComplete) {
      onComplete();
    }
  });

  return (
    <Button
      type="submit"
      color="error"
      disabled={removeMember.isLoading}
      loading={removeMember.isLoading}
      onClick={() => removeMember.mutate()}
    >
      {t("removeTeamMember.buttonText")}
    </Button>
  );
};

export default RemoveTeamMember;
