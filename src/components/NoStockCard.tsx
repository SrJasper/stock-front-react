import { useTranslation } from "react-i18next";
import "./styles/noStockCard.css";
import { useEffect } from "react";
import { User } from "./types";

type Props = {
  user: User;
};

const NoStockCard = ({ user }: Props) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (user) {
      console.log(user);
      i18n.changeLanguage(user.language);
    }
  }, [user]);

  return (
    <div className="use-width">
      <div className="no-stock-card">
        <h2>{t("no-stock-card-title-one")}</h2>
        <p>{t("no-stock-card-text-one")}</p>
        <hr className="padding-line" />
        <h2>{t("no-stock-card-title-two")}</h2>
        <p>
          {t("no-stock-card-text-two")}
          <br />
          {t("no-stock-card-text-three")}
          <br />
        </p>
        <hr className="gap-line black" />
        <div className="horizontal-texts">
          <div>
            <h2 className="green-text">{t("simulation")}</h2>
            <p>
              {t("simulation-text-one")}
              <br />
              {t("simulation-text-two")}
              <br />
              {t("simulation-text-three")}
              <br />
              {t("simulation-text-four")}
              <br />
              {t("simulation-text-five")}
            </p>
          </div>
          <hr />
          <div>
            <h2 className="blue-text">{t("reg-title")}</h2>
            <p>
              {t("register-text-one")}
              <br />
              {t("register-text-two")}
              <br />
              {t("register-text-three")}
              <br />
              {t("register-text-four")}
              <br />
              {t("register-text-five")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { NoStockCard };
