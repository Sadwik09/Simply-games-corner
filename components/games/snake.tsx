"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Play, Pause } from "lucide-react"

interface Position {
  x: number
  y: number
}

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [highScore, setHighScore] = useState(0)

  const gameState = useRef({
    snake: [{ x: 10, y: 10 }] as Position[],
    food: { x: 15, y: 15 } as Position,
    direction: { x: 0, y: 0 } as Position,
    nextDirection: { x: 0, y: 0 } as Position,
  })

  const GRID_SIZE = 20
  const CANVAS_SIZE = 400

  const generateFood = () => {
    const { snake } = gameState.current
    let newFood: Position

    do {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      }
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))

    gameState.current.food = newFood
  }

  const resetGame = () => {
    setScore(0)
    setGameOver(false)
    gameState.current.snake = [{ x: 10, y: 10 }]
    gameState.current.direction = { x: 0, y: 0 }
    gameState.current.nextDirection = { x: 0, y: 0 }
    generateFood()
  }

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const { direction } = gameState.current

    switch (e.code) {
      case "ArrowUp":
        if (direction.y === 0) {
          gameState.current.nextDirection = { x: 0, y: -1 }
        }
        break
      case "ArrowDown":
        if (direction.y === 0) {
          gameState.current.nextDirection = { x: 0, y: 1 }
        }
        break
      case "ArrowLeft":
        if (direction.x === 0) {
          gameState.current.nextDirection = { x: -1, y: 0 }
        }
        break
      case "ArrowRight":
        if (direction.x === 0) {
          gameState.current.nextDirection = { x: 1, y: 0 }
        }
        break
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      window.addEventListener("keydown", handleKeyPress)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [isPlaying, handleKeyPress])

  const updateGame = () => {
    const { snake, food, nextDirection } = gameState.current

    // Update direction
    gameState.current.direction = { ...nextDirection }
    const { direction } = gameState.current

    if (direction.x === 0 && direction.y === 0) return

    // Calculate new head position
    const head = { ...snake[0] }
    head.x += direction.x
    head.y += direction.y

    // Check wall collision
    if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE || head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
      setGameOver(true)
      setIsPlaying(false)
      return
    }

    // Check self collision
    if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true)
      setIsPlaying(false)
      return
    }

    // Add new head
    snake.unshift(head)

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => {
        const newScore = prev + 10
        if (newScore > highScore) {
          setHighScore(newScore)
        }
        return newScore
      })
      generateFood()
    } else {
      // Remove tail if no food eaten
      snake.pop()
    }
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const { snake, food } = gameState.current

    // Draw snake
    ctx.fillStyle = "#0f0"
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#0a0" : "#0f0" // Head slightly different color
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)
    })

    // Draw food
    ctx.fillStyle = "#f00"
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2)

    // Draw grid
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, CANVAS_SIZE)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(CANVAS_SIZE, i)
      ctx.stroke()
    }
  }

  useEffect(() => {
    let gameInterval: NodeJS.Timeout

    if (isPlaying && !gameOver) {
      gameInterval = setInterval(() => {
        updateGame()
        draw()
      }, 150)
    }

    return () => {
      if (gameInterval) {
        clearInterval(gameInterval)
      }
    }
  }, [isPlaying, gameOver])

  const startGame = () => {
    if (gameOver) {
      resetGame()
    }
    setIsPlaying(true)
  }

  const pauseGame = () => {
    setIsPlaying(false)
  }

  useEffect(() => {
    resetGame()
    draw()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Snake Game</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Score: {score}</span>
              <span>High Score: {highScore}</span>
              <div className="flex gap-2">
                {!isPlaying && (
                  <Button onClick={startGame} size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    {gameOver ? "Play Again" : "Start"}
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
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="border-2 border-gray-300 bg-black mx-auto block"
            />
            <div className="text-center mt-4 text-sm text-gray-600">Use arrow keys to control the snake</div>
            {gameOver && (
              <div className="text-center mt-4">
                <div className="text-xl font-bold text-red-600 mb-2">Game Over!</div>
                <div>Final Score: {score}</div>
                {score === highScore && score > 0 && (
                  <div className="text-green-600 font-medium">New High Score! 🎉</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
