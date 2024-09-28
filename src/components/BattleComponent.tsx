import { useState, useEffect } from 'react';
import SelectBeeContainer from './Battle/SelectBeeContainer';
import PrimaryOptionsOff from './Battle/PrimaryOptionsOff';
import PrimaryOptionsOn from './Battle/PrimaryOptionsOn';
import BodyContainer from './Battle/BodyContainer';

const TURN_DURATION = 10000; // Duración del turno en milisegundos (10 segundos)

const BattleComponent = ({
  userId,
  battleData,
}: {
  userId: any;
  battleData: any;
}) => {
  const [isMyTurn, setIsMyTurn] = useState(battleData.inicialTurn == userId); // Estado para saber si es tu turno o el del oponente
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION / 1000); // Estado para el temporizador de cada turno

  useEffect(() => {
    // Configurar el temporizador para cambiar de turno cada 10 segundos
    const turnInterval = setInterval(() => {
      setIsMyTurn((prevIsMyTurn) => !prevIsMyTurn); // Cambiar de turno
      setTimeLeft(TURN_DURATION / 1000); // Reiniciar el temporizador
    }, TURN_DURATION);

    // Temporizador de cuenta regresiva por cada turno
    const countdown = setInterval(() => {
      setTimeLeft((prevTimeLeft) => (prevTimeLeft > 0 ? prevTimeLeft - 1 : 0));
    }, 1000);

    // Limpiar temporizadores cuando el componente se desmonte
    return () => {
      clearInterval(turnInterval);
      clearInterval(countdown);
    };
  }, []);
  // Procesamiento de los datos de las abejas de ambos jugadores
  console.log('battleData', battleData);

  const dataUser1: any = battleData?.acceptances?.bee1[0]?.parts?.reduce(
    (acc: any, part: any) => {
      acc[part.namePart] = part;
      return acc;
    },
    {},
  );

  const dataUser2: any = battleData?.acceptances?.bee2[0]?.parts?.reduce(
    (acc: any, part: any) => {
      acc[part.namePart] = part;
      return acc;
    },
    {},
  );

  return (
    <div className="gamefot">
      <BodyContainer />
      {battleData && (
        <>
          <SelectBeeContainer dataUser1={dataUser1} dataUser2={dataUser2} />
          <div className="foter-g">
            {isMyTurn ? (
              <PrimaryOptionsOn timeLeft={timeLeft} />
            ) : (
              <PrimaryOptionsOff timeLeft={timeLeft} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BattleComponent;
