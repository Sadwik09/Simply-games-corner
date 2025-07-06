import { notFound } from "next/navigation"
import TicTacToe from "@/components/games/tic-tac-toe"
import MemoryMatch from "@/components/games/memory-match"
import CatchBalls from "@/components/games/catch-balls"
import SimonSays from "@/components/games/simon-says"
import RockPaperScissors from "@/components/games/rock-paper-scissors"
import GuessNumber from "@/components/games/guess-number"
import SlidingPuzzle from "@/components/games/sliding-puzzle"
import SpaceInvaders from "@/components/games/space-invaders"
import Breakout from "@/components/games/breakout"
import Snake from "@/components/games/snake"

const games = {
  "tic-tac-toe": TicTacToe,
  "memory-match": MemoryMatch,
  "catch-balls": CatchBalls,
  "simon-says": SimonSays,
  "rock-paper-scissors": RockPaperScissors,
  "guess-number": GuessNumber,
  "sliding-puzzle": SlidingPuzzle,
  "space-invaders": SpaceInvaders,
  breakout: Breakout,
  snake: Snake,
}

export default function GamePage({ params }: { params: { gameId: string } }) {
  const GameComponent = games[params.gameId as keyof typeof games]

  if (!GameComponent) {
    notFound()
  }

  return <GameComponent />
}
