"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Play, Pause } from "lucide-react"

interface Ball {
  id: number
  x: number
  y: number
  speed: number
  color: string
}

export default function CatchBalls() {
  const [balls, setBalls] = useState<Ball[]>([])
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"]

  const createBall = () => {
    const gameArea = gameAreaRef.current
    if (!gameArea) return null

    return {
      id: Date.now() + Math.random(),
      x: Math.random() * (gameArea.clientWidth - 40),
      y: -40,
      speed: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  }

  const updateGame = () => {
    setBalls((prevBalls) => {
      const updatedBalls = prevBalls.map((ball) => ({ ...ball, y: ball.y + ball.speed })).filter((ball) => ball.y < 400)

      // Check for game over (balls reached bottom)
      const missedBalls = prevBalls.filter((ball) => ball.y >= 400)
      if (missedBalls.length > 0) {
        setGameOver(true)
        setIsPlaying(false)
        return updatedBalls
      }

      // Add new ball occasionally
      if (Math.random() < 0.02) {
        const newBall = createBall()
        if (newBall) {
          updatedBalls.push(newBall)
        }
      }

      return updatedBalls
    })
  }

  useEffect(() => {
    let animationId: number

    const gameLoop = () => {
      if (isPlaying && !gameOver) {
        updateGame()
        animationId = requestAnimationFrame(gameLoop)
      }
    }

    if (isPlaying && !gameOver) {
      gameLoop()
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isPlaying, gameOver])

  const handleBallClick = (ballId: number) => {
    setBalls((prevBalls) => prevBalls.filter((ball) => ball.id !== ballId))
    setScore((prevScore) => prevScore + 10)
  }

  const startGame = () => {
    setIsPlaying(true)
    setGameOver(false)
    setScore(0)
    setBalls([])
  }

  const pauseGame = () => {
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Catch the Falling Balls</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Score: {score}</span>
              <div className="flex gap-2">
                {!isPlaying && !gameOver && (
                  <Button onClick={startGame} size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                )}
                {isPlaying && (
                  <Button onClick={pauseGame} size="sm" variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={gameAreaRef}
              className="relative w-full h-96 bg-sky-100 border-2 border-sky-200 rounded-lg overflow-hidden cursor-crosshair"
            >
              {gameOver && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
                    <p className="mb-4">Final Score: {score}</p>
                    <Button onClick={startGame} variant="secondary">
                      Play Again
                    </Button>
                  </div>
                </div>
              )}

              {balls.map((ball) => (
                <div
                  key={ball.id}
                  className="absolute w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110"
                  style={{
                    left: ball.x,
                    top: ball.y,
                    backgroundColor: ball.color,
                  }}
                  onClick={() => handleBallClick(ball.id)}
                />
              ))}

              {!isPlaying && !gameOver && balls.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Click Start to begin catching balls!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
