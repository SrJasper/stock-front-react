import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LoadingCard = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);
  return (
    <div className="screen-blocker">
      <div className="loading-card">
        <label> 
          {t("loading")/* Carregando */}
        </label>
      </div>
    </div>
  )
}

export {LoadingCard}