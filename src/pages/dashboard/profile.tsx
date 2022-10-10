import { LOGIN_PATH } from "@/types/auth";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import UpdateProfileName from "@/components/dashboard/profile/update-profile-name";
import DashboardContent from "@/components/dashboard/shared/dashboard-content";
import UpdateEmailAddress from "@/components/dashboard/profile/update-email-address";
import useTranslation from "next-translate/useTranslation";
import ListTeams from "@/components/dashboard/profile/list-teams";

const DashboardProfile = () => {
  const { t } = useTranslation("dashboard");
  return (
    <DashboardContent>
      <DashboardContent.Title>{t("profile.pageTitle")}</DashboardContent.Title>
      <DashboardContent.Content>
        <div className="grid gap-y-6">
          <UpdateProfileName />
          <UpdateEmailAddress />
          <ListTeams />
        </div>
      </DashboardContent.Content>
    </DashboardContent>
  );
};

export default DashboardProfile;

export const getServerSideProps = withPageAuth({ redirectTo: LOGIN_PATH });
