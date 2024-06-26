import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../contexts/userContext";


const LoadingCard = () => {

  const { user } = useUser();

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
