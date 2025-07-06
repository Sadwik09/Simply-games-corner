"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Play } from "lucide-react"

const colors = [
  { id: 0, name: "red", class: "bg-red-500 hover:bg-red-600", activeClass: "bg-red-300" },
  { id: 1, name: "blue", class: "bg-blue-500 hover:bg-blue-600", activeClass: "bg-blue-300" },
  { id: 2, name: "green", class: "bg-green-500 hover:bg-green-600", activeClass: "bg-green-300" },
  { id: 3, name: "yellow", class: "bg-yellow-500 hover:bg-yellow-600", activeClass: "bg-yellow-300" },
]

export default function SimonSays() {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShowingSequence, setIsShowingSequence] = useState(false)
  const [activeColor, setActiveColor] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const startGame = () => {
    setSequence([])
    setPlayerSequence([])
    setScore(0)
    setGameOver(false)
    setIsPlaying(true)
    addToSequence()
  }

  const addToSequence = () => {
    const newColor = Math.floor(Math.random() * 4)
    setSequence((prev) => [...prev, newColor])
  }

  const showSequence = async () => {
    setIsShowingSequence(true)
    setPlayerSequence([])

    for (let i = 0; i < sequence.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setActiveColor(sequence[i])
      await new Promise((resolve) => setTimeout(resolve, 400))
      setActiveColor(null)
    }

    setIsShowingSequence(false)
  }

  useEffect(() => {
    if (sequence.length > 0 && isPlaying) {
      showSequence()
    }
  }, [sequence])

  const handleColorClick = (colorId: number) => {
    if (isShowingSequence || !isPlaying || gameOver) return

    const newPlayerSequence = [...playerSequence, colorId]
    setPlayerSequence(newPlayerSequence)

    // Check if the player's move is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true)
      setIsPlaying(false)
      return
    }

    // Check if player completed the sequence
    if (newPlayerSequence.length === sequence.length) {
      setScore((prev) => prev + 1)
      setTimeout(() => {
        addToSequence()
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Simon Says</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {gameOver
                ? `Game Over! Score: ${score}`
                : isShowingSequence
                  ? "Watch the sequence..."
                  : isPlaying
                    ? `Round ${score + 1} - Your turn!`
                    : "Simon Says"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {colors.map((color) => (
                <Button
                  key={color.id}
                  className={`h-32 text-white font-bold text-xl transition-all duration-200 ${
                    activeColor === color.id ? color.activeClass : color.class
                  }`}
                  onClick={() => handleColorClick(color.id)}
                  disabled={isShowingSequence || !isPlaying || gameOver}
                >
                  {color.name.toUpperCase()}
                </Button>
              ))}
            </div>

            <div className="text-center">
              {!isPlaying && (
                <Button onClick={startGame} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  {gameOver ? "Play Again" : "Start Game"}
                </Button>
              )}

              {isPlaying && (
                <div className="text-sm text-gray-600">
                  Progress: {playerSequence.length} / {sequence.length}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
