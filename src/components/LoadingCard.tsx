import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { User } from "./types";

type Props = {
  user?: User;
};

const LoadingCard = ({ user }: Props) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (user) {
      i18n.changeLanguage(user.language);
    }
  }, [user]);
  return (
    <div className="screen-blocker">
      <div className="loading-card">
        <label>{t("loading") /* Carregando */}</label>
      </div>
    </div>
  );
};

export { LoadingCard };
