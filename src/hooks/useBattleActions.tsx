/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Socket } from 'socket.io-client';

const TURN_DURATION = 50000; // Duración del turno en milisegundos (50 segundos)
const MAX_BEE_LIFE = 500; // Vida máxima de la abeja

interface UseBattleActionsParams {
  socket: Socket | null;
  roomId: string | null;
  userId: string;
  dataBee: any;
  battleData: any;
}

const useBattleActions = ({
  socket,
  roomId,
  userId,
  dataBee,
  battleData,
}: UseBattleActionsParams) => {
  const [isMyTurn, setIsMyTurn] = useState(battleData?.inicialTurn === userId);
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION / 1000);
  const [battleOutcome, setBattleOutcome] = useState<'win' | 'lose' | null>(
    null,
  );
  const db = getFirestore();

  useEffect(() => {
    console.log('isMyTurn', isMyTurn);
  }, [isMyTurn]);

  useEffect(() => {
    console.log(
      'useBattleActions',
      battleData?.inicialTurn,
      userId,
      battleData?.inicialTurn == userId,
    );
    setIsMyTurn(battleData?.inicialTurn == userId);
  }, [userId, battleData?.inicialTurn]);

  // Comprobar si ha habido un ganador o un perdedor
  useEffect(() => {
    if (battleData) {
      const isUser1 = battleData?.acceptances?.idUser1 === userId;
      const myLife = isUser1 ? battleData.lifeUser1 : battleData.lifeUser2;
      const opponentLife = isUser1
        ? battleData.lifeUser2
        : battleData.lifeUser1;

      // Si la vida del oponente llega a 0, el jugador gana
      if (opponentLife <= 0) {
        setBattleOutcome('win');
        updateWinnerOrLoserInFirestore(
          userId,
          isUser1
            ? battleData?.acceptances?.idUser2
            : battleData?.acceptances?.idUser1,
        );
      }
      // Si la vida del jugador llega a 0, el jugador pierde
      else if (myLife <= 0) {
        setBattleOutcome('lose');
        updateWinnerOrLoserInFirestore(
          isUser1
            ? battleData?.acceptances?.idUser2
            : battleData?.acceptances?.idUser1,
          userId,
        );
      }
    }
  }, [battleData, userId]);

  // Función para cambiar el turno en Firestore
  const updateTurnInFirestore = async (nextTurnUserId: string) => {
    if (roomId) {
      const battleRef = doc(db, 'battleParticipants', roomId);
      try {
        // Actualiza el turno en Firestore
        await updateDoc(battleRef, {
          inicialTurn: nextTurnUserId,
        });
        console.log(
          `El turno ha sido actualizado en Firestore a: ${nextTurnUserId}`,
        );
      } catch (error) {
        console.error('Error al actualizar el turno en Firestore:', error);
      }
    }
  };

  // Función para actualizar el ganador o el perdedor en Firestore
  const updateWinnerOrLoserInFirestore = async (
    winnerId: string,
    loserId: string,
  ) => {
    if (roomId) {
      const battleRef = doc(db, 'battleParticipants', roomId);
      try {
        // Actualiza el ganador y el perdedor
        await updateDoc(battleRef, {
          winner: winnerId,
          loser: loserId,
        });
        console.log(`El ganador ha sido registrado en Firestore: ${winnerId}`);
        console.log(`El perdedor ha sido registrado en Firestore: ${loserId}`);
      } catch (error) {
        console.error(
          'Error al registrar el ganador o perdedor en Firestore:',
          error,
        );
      }
    }
  };

  const handleAttack = useCallback(
    async (selectedAbility: any) => {
      console.log('handleAttack llamado');
      console.log('selectedAbility---->:', selectedAbility);
      console.log('roomId:', roomId);
      console.log('isMyTurn:', isMyTurn);

      if (roomId && isMyTurn && socket) {
        console.log('Emitiendo battle-action y turn-change');

        // Se emite la acción de ataque
        socket.emit('battle-action', {
          roomId,
          action: 'attack',
          idUser: userId,
          bee: dataBee,
          ability: selectedAbility,
        });

        // Determinar si el usuario es `idUser1` o `idUser2` y a quién se debe actualizar la vida
        const isUser1 = battleData?.acceptances?.idUser1 === userId;
        const lifeFieldToUpdate = isUser1 ? 'lifeUser2' : 'lifeUser1';
        const opponentLife = isUser1
          ? battleData.lifeUser2
          : battleData.lifeUser1;

        // Aplica la habilidad seleccionada
        const applySkill = (ability: any, beeLife: number) => {
          let damage = 0;
          switch (ability.name) {
            case 'Attack':
              damage = 10;
              break;
            case 'Throw':
              damage = 10 * 0.9;
              break;
            case 'Fireball':
              damage = 10 * 2.5;
              break;
            case 'Frenzy':
              damage = 10 * 0.6 * 4; // 4 ataques consecutivos
              break;
            case 'Flying':
              damage = 0; // Evita ataques cuerpo a cuerpo
              break;
            case 'Cover':
              damage = 0; // Defensa activada
              break;
            case 'Distract':
              damage = 0; // Cancela habilidades canalizadas
              break;
            case 'Wake up':
              damage = 0; // Despierta del estado "dormido"
              break;
            case 'Reflection':
              damage = 0; // Refleja el próximo ataque
              break;
            case 'Down to Earth':
              damage = 0; // Paraliza al oponente
              break;
            case 'Jailwalk':
              damage = beeLife * 0.2; // Pierde el 20% de la vida si intenta moverse
              break;
            case 'Freedom':
              damage = 0; // Elimina todos los debuffs
              break;
            case 'See through':
              damage = 10 * 2; // Ataca a través de las paredes
              break;
            case 'Drain':
              damage = 10 * 1; // Daño normal y roba vida (20% de lo infligido)
              break;
            case 'Poison Dart':
              damage = 10 * 1.5; // Envenena al oponente
              break;
            case 'Transform':
              damage = 0; // Cambia el tipo de abeja
              break;
            case 'Charge':
              damage = beeLife; // Carga ataque mortal (mata al oponente)
              break;
            case 'Burn':
              damage = 10 * 2; // Aplica el estado quemado
              break;
            case 'Sting':
              damage = 10 * 4; // Gran daño, pero se daña a sí mismo
              break;
            case 'Firewall':
              damage = 0; // Levanta un muro de fuego, quema si se ataca
              break;
            case 'Tornado':
              damage = 10 * 2; // Daño por tornado y confusión
              break;
            case 'Hammer':
              damage = 10 * 6; // Gran daño después de cargar
              break;
            case 'Heal':
              return beeLife + MAX_BEE_LIFE * 0.4; // Cura un 40% de la vida máxima
            default:
              damage = 10;
              console.log('Habilidad no reconocida');
              break;
          }
          return beeLife - damage;
        };

        // Calcular la nueva vida del oponente
        let updatedOpponentLife = applySkill(selectedAbility, opponentLife);

        console.log('Vida restante del oponente:', updatedOpponentLife);

        // Actualizar el campo `lifeUser1` o `lifeUser2` en Firestore
        const battleRef = doc(db, 'battleParticipants', roomId);
        try {
          await updateDoc(battleRef, {
            [lifeFieldToUpdate]: updatedOpponentLife, // actualizar vida del oponente
          });
          console.log(
            `Vida del oponente actualizada en Firestore: ${updatedOpponentLife}`,
          );
        } catch (error) {
          console.error('Error al actualizar la vida en Firestore:', error);
        }

        // Cambiar turno
        const nextTurnUserId = isUser1
          ? battleData?.acceptances?.idUser2
          : battleData?.acceptances?.idUser1;

        await updateTurnInFirestore(nextTurnUserId);

        socket.emit('turn-change', {
          roomId,
          turn: nextTurnUserId,
        });

        setTimeLeft(TURN_DURATION / 1000);
        setIsMyTurn(false);

        // Retorna el porcentaje de vida restante del oponente para actualizar la barra de progreso
        return {
          result: 'continue',
          opponentLifePercentage: (updatedOpponentLife / MAX_BEE_LIFE) * 100,
        };
      } else {
        console.log('No se cumplen las condiciones para emitir eventos');
        return null;
      }
    },
    [roomId, isMyTurn, socket, userId, dataBee, battleData],
  );

  return { handleAttack, isMyTurn, timeLeft, battleOutcome };
};

export default useBattleActions;
