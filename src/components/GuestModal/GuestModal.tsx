import React, { useEffect } from "react";
import "./modal.css";
import { useGuest } from "../../store/useGuest";
import { LoadingCard } from "../LoadingCard";
import { useTranslation } from "react-i18next";

type Props = {
  handleClose: () => void;
};

const GuestModal: React.FC<Props> = ({ handleClose }) => {

  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

  const { isLoading, error, guestLogin } = useGuest();
  async function handleGuestLogin() {
    await guestLogin();
  }

  return (
    <div className="screen-blocker">
      {isLoading && <LoadingCard />}
      {error && error.message && (
        <div className="pass-rec">
          <p> {error.message} </p> 
          <a href="/recover">{t("forgot-password")}</a>
        </div>
      )}
      <div className="guest-modal">
        <h2 className="golden">Aviso</h2>
        <p>
          Entrar sem usuário é uma alternativa para quem não deseja se registrar. Lembre-se de que o único e-mail que poderá ser enviado a um usuário registrado é o de recuperação de senha. 
        </p>
        <p>
          Ao entrar sem se registrar o usuário estará abrindo de mão de alguns recursos disponíveis apenas para usuários registrados.
        </p>
        <p className="margin-top">
          Deseja continuar mesmo assim?
        </p>
        <div className="margin-top">
          <button onClick={handleClose} className="red-button"> voltar </button>
          <button onClick={handleGuestLogin} className="green-button"> avançar </button>
        </div>
      </div>
    </div>
  );
};

export { GuestModal };
