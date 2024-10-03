import { useState, useCallback, useEffect } from 'react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Socket } from 'socket.io-client';

const TURN_DURATION = 50000; // Duración del turno en milisegundos (50 segundos)
const MAX_BEE_LIFE = 100; // Vida máxima de la abeja

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

  // Función para actualizar el ganador en Firestore
  const updateWinnerInFirestore = async (winnerId: string) => {
    if (roomId) {
      const battleRef = doc(db, 'battleParticipants', roomId);
      try {
        await updateDoc(battleRef, {
          winner: winnerId,
        });
        console.log(`El ganador ha sido registrado en Firestore: ${winnerId}`);
      } catch (error) {
        console.error('Error al registrar el ganador en Firestore:', error);
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
            // Agrega más habilidades aquí con su lógica
            default:
              console.log('Habilidad no reconocida');
              break;
          }
          return beeLife - damage;
        };

        // Calcular la nueva vida del oponente
        let updatedOpponentLife = applySkill(selectedAbility, opponentLife);

        console.log('Vida restante del oponente:', updatedOpponentLife);

        // Verificar si el oponente ha perdido
        if (updatedOpponentLife <= 0) {
          updatedOpponentLife = 0; // No permitir que la vida sea negativa
          await updateWinnerInFirestore(userId);
          console.log(`¡${userId} ha ganado la batalla!`);
        }

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

        // Calcular el porcentaje de vida restante
        const opponentLifePercentage =
          (updatedOpponentLife / MAX_BEE_LIFE) * 100;
        console.log(
          `Porcentaje de vida del oponente: ${opponentLifePercentage}%`,
        );

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
        return opponentLifePercentage;
      } else {
        console.log('No se cumplen las condiciones para emitir eventos');
        return null;
      }
    },
    [roomId, isMyTurn, socket, userId, dataBee, battleData],
  );

  return { handleAttack, isMyTurn, timeLeft };
};

export default useBattleActions;
