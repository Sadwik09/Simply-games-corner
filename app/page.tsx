import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2 } from "lucide-react"

const games = [
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic 3x3 grid game for two players",
    difficulty: "Easy",
  },
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Flip cards to find matching pairs",
    difficulty: "Easy",
  },
  {
    id: "catch-balls",
    title: "Catch the Falling Balls",
    description: "Click falling balls to catch them",
    difficulty: "Medium",
  },
  {
    id: "simon-says",
    title: "Simon Says",
    description: "Repeat the color sequence",
    difficulty: "Medium",
  },
  {
    id: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    description: "Classic hand game against computer",
    difficulty: "Easy",
  },
  {
    id: "guess-number",
    title: "Guess the Number",
    description: "Guess the random number between 1-100",
    difficulty: "Easy",
  },
  {
    id: "sliding-puzzle",
    title: "Sliding Puzzle",
    description: "Arrange tiles in correct order",
    difficulty: "Hard",
  },
  {
    id: "space-invaders",
    title: "Space Invaders",
    description: "Shoot descending aliens",
    difficulty: "Hard",
  },
  {
    id: "breakout",
    title: "Breakout",
    description: "Break bricks with ball and paddle",
    difficulty: "Hard",
  },
  {
    id: "snake",
    title: "Snake Game",
    description: "Control snake to eat food and grow",
    difficulty: "Medium",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gamepad2 className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">Simple Games Collection</h1>
          </div>
          <p className="text-gray-600 text-lg">10 classic games built with HTML, CSS, and JavaScript</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link key={game.id} href={`/games/${game.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        game.difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : game.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {game.difficulty}
                    </span>
                    <span className="text-purple-600 font-medium">Play →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
