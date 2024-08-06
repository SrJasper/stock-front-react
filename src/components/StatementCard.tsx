import { api } from "../config/api";
import "./styles/statementCard.css";
import React, { useState, useEffect } from "react";
import { Stock } from "./types";

interface StatementItem {
  id: number;
  qnt: number;
  price: number;
  operationDate: string;
  type: string;
}

interface Prop {
  stock?: Stock;
}

const StatementCard: React.FC<Prop> = ({ stock }) => {
  const [statements, setStatements] = useState<StatementItem[]>([]);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const res = await api.get(`stocks/statement/${stock?.symbol}`);
        console.log("res.data", res.data);
        const transformedData = res.data.map((item: StatementItem) => ({
          ...item,
          operationDate: formatMonthYear(item.operationDate),
        }));

        setStatements(transformedData);
      } catch (error) {
        console.error("Erro ao buscar declarações:", error);
      }
    };

    fetchStatements();
  }, [stock?.symbol]);

  const formatMonthYear = (dateString: string): string => {
    const date = new Date(dateString);
    const monthNames = [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear().toString().slice(2); // Pegar apenas os últimos dois dígitos do ano
    return `${month}/${year}`;
  };

  return (
    <div className="display-column border-gray" style={{ minWidth: "100%" }}>
      {statements.map((statement, index) => (
        <div className="use-width display-column" key={statement.id}>
          {index !== 0 && <hr className="separation-line-statement" />}
          <div className="statement-display  use-width">
            <div className="display-column">
              <label> Qnt: </label>
              <p>{statement.qnt}</p>
            </div>
            <div className="display-column">
              <label> Preço: </label>
              <p>{statement.price}</p>
            </div>
            <div className="display-column">
              <label> Tipo: </label>
              <p
                className={` ${
                  statement.type === "buy" ? "red-font" : "green-font"
                }`}
              >
                {statement.type}
              </p>
            </div>
            <div className="display-column">
              <label> Data: </label>
              <p>{statement.operationDate}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { StatementCard };
