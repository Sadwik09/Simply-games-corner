"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, RotateCcw } from "lucide-react"

type Choice = "rock" | "paper" | "scissors"

const choices: { value: Choice; emoji: string; name: string }[] = [
  { value: "rock", emoji: "🪨", name: "Rock" },
  { value: "paper", emoji: "📄", name: "Paper" },
  { value: "scissors", emoji: "✂️", name: "Scissors" },
]

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null)
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null)
  const [result, setResult] = useState<string>("")
  const [score, setScore] = useState({ player: 0, computer: 0, ties: 0 })

  const getRandomChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * choices.length)
    return choices[randomIndex].value
  }

  const determineWinner = (player: Choice, computer: Choice): string => {
    if (player === computer) return "tie"

    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "player"
    }

    return "computer"
  }

  const playGame = (playerChoice: Choice) => {
    const computerChoice = getRandomChoice()
    const winner = determineWinner(playerChoice, computerChoice)

    setPlayerChoice(playerChoice)
    setComputerChoice(computerChoice)

    if (winner === "player") {
      setResult("You win!")
      setScore((prev) => ({ ...prev, player: prev.player + 1 }))
    } else if (winner === "computer") {
      setResult("Computer wins!")
      setScore((prev) => ({ ...prev, computer: prev.computer + 1 }))
    } else {
      setResult("It's a tie!")
      setScore((prev) => ({ ...prev, ties: prev.ties + 1 }))
    }
  }

  const resetGame = () => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult("")
    setScore({ player: 0, computer: 0, ties: 0 })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Rock Paper Scissors</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex justify-center gap-8 text-sm">
                <span>You: {score.player}</span>
                <span>Ties: {score.ties}</span>
                <span>Computer: {score.computer}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-4">Choose your weapon:</h3>
              <div className="flex justify-center gap-4">
                {choices.map((choice) => (
                  <Button
                    key={choice.value}
                    variant="outline"
                    className="h-20 w-20 text-3xl bg-transparent"
                    onClick={() => playGame(choice.value)}
                  >
                    {choice.emoji}
                  </Button>
                ))}
              </div>
            </div>

            {playerChoice && computerChoice && (
              <div className="text-center mb-6">
                <div className="flex justify-center items-center gap-8 mb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{choices.find((c) => c.value === playerChoice)?.emoji}</div>
                    <div className="text-sm font-medium">You</div>
                  </div>
                  <div className="text-2xl font-bold">VS</div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{choices.find((c) => c.value === computerChoice)?.emoji}</div>
                    <div className="text-sm font-medium">Computer</div>
                  </div>
                </div>
                <div
                  className={`text-xl font-bold ${
                    result.includes("You win")
                      ? "text-green-600"
                      : result.includes("Computer wins")
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {result}
                </div>
              </div>
            )}

            <Button onClick={resetGame} className="w-full bg-transparent" variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Score
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
