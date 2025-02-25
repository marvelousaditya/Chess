import { useEffect, useState } from "react";
import { Button } from "../Components/Button";
import { ChessBoard } from "../Components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === INIT_GAME) {
        // setChess(new Chess());
        setStarted(true);
        setBoard(chess.board());
        console.log("game initialized");
      } else if (message.type === MOVE) {
        const move = message.payload;
        chess.move(move);
        setBoard(chess.board());
        console.log("move made");
      } else {
        console.log("game over");
      }
    };
  }, [socket]);
  if (!socket) return <div>Connecting....</div>;
  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard
              chess={chess}
              board={board}
              socket={socket}
              setBoard={setBoard}
            />
          </div>
          <div className="col-span-2  w-full flex justify-center">
            <div className="pt-10">
              {started ? (
                ""
              ) : (
                <Button
                  onClick={() =>
                    socket.send(
                      JSON.stringify({
                        type: INIT_GAME,
                      })
                    )
                  }
                  text="Play"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
