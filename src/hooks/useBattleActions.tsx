import { useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';

const TURN_DURATION = 50000; // Duración del turno en milisegundos (50 segundos)

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

  const handleAttack = useCallback(
    (selectedAbility: any) => {
      console.log('handleAttack llamado');
      console.log('selectedAbility:', selectedAbility);
      console.log('roomId:', roomId);
      console.log('isMyTurn:', isMyTurn);

      if (roomId && isMyTurn && socket) {
        console.log('Emitiendo battle-action y turn-change');

        socket.emit('battle-action', {
          roomId,
          action: 'attack',
          idUser: userId,
          bee: dataBee,
          ability: selectedAbility,
        });

        const nextTurnUserId =
          battleData?.acceptances?.idUser1 === userId
            ? battleData?.acceptances?.idUser2
            : battleData?.acceptances?.idUser1;

        socket.emit('turn-change', {
          roomId,
          turn: nextTurnUserId,
        });

        setTimeLeft(TURN_DURATION / 1000);
        setIsMyTurn(false);
      } else {
        console.log('No se cumplen las condiciones para emitir eventos');
      }
    },
    [roomId, isMyTurn, socket, userId, dataBee, battleData],
  );

  return { handleAttack, isMyTurn, timeLeft };
};

export default useBattleActions;
