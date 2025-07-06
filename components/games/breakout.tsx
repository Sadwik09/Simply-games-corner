"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Play, Pause } from "lucide-react"

interface GameObject {
  x: number
  y: number
  width: number
  height: number
}

interface Ball extends GameObject {
  dx: number
  dy: number
}

interface Brick extends GameObject {
  id: number
  color: string
  points: number
}

export default function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  const gameState = useRef({
    paddle: { x: 350, y: 550, width: 100, height: 10 },
    ball: { x: 400, y: 300, width: 10, height: 10, dx: 4, dy: -4 },
    bricks: [] as Brick[],
    keys: { left: false, right: false },
  })

  const initializeBricks = () => {
    const bricks: Brick[] = []
    const colors = ["#ff0000", "#ff8000", "#ffff00", "#80ff00", "#00ff00"]

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        bricks.push({
          id: row * 10 + col,
          x: col * 80 + 5,
          y: row * 30 + 50,
          width: 75,
          height: 25,
          color: colors[row],
          points: (5 - row) * 10,
        })
      }
    }
    gameState.current.bricks = bricks
  }

  const resetGame = () => {
    setScore(0)
    setLives(3)
    setGameOver(false)
    setGameWon(false)
    gameState.current.paddle = { x: 350, y: 550, width: 100, height: 10 }
    gameState.current.ball = { x: 400, y: 300, width: 10, height: 10, dx: 4, dy: -4 }
    initializeBricks()
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowLeft":
        gameState.current.keys.left = true
        break
      case "ArrowRight":
        gameState.current.keys.right = true
        break
    }
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowLeft":
        gameState.current.keys.left = false
        break
      case "ArrowRight":
        gameState.current.keys.right = false
        break
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isPlaying, handleKeyDown, handleKeyUp])

  const updateGame = () => {
    const { paddle, ball, bricks, keys } = gameState.current

    // Move paddle
    if (keys.left && paddle.x > 0) {
      paddle.x -= 7
    }
    if (keys.right && paddle.x < 700) {
      paddle.x += 7
    }

    // Move ball
    ball.x += ball.dx
    ball.y += ball.dy

    // Ball collision with walls
    if (ball.x <= 0 || ball.x >= 790) {
      ball.dx = -ball.dx
    }
    if (ball.y <= 0) {
      ball.dy = -ball.dy
    }

    // Ball collision with paddle
    if (
      ball.y + ball.height >= paddle.y &&
      ball.x + ball.width >= paddle.x &&
      ball.x <= paddle.x + paddle.width &&
      ball.dy > 0
    ) {
      ball.dy = -ball.dy

      // Add some angle based on where ball hits paddle
      const hitPos = (ball.x + ball.width / 2 - paddle.x) / paddle.width
      ball.dx = 4 * (hitPos - 0.5) * 2
    }

    // Ball collision with bricks
    gameState.current.bricks = bricks.filter((brick) => {
      if (
        ball.x < brick.x + brick.width &&
        ball.x + ball.width > brick.x &&
        ball.y < brick.y + brick.height &&
        ball.y + ball.height > brick.y
      ) {
        ball.dy = -ball.dy
        setScore((prev) => prev + brick.points)
        return false
      }
      return true
    })

    // Check if ball fell off screen
    if (ball.y > 600) {
      setLives((prev) => prev - 1)
      ball.x = 400
      ball.y = 300
      ball.dx = 4
      ball.dy = -4
    }

    // Check game over
    if (lives <= 0) {
      setGameOver(true)
      setIsPlaying(false)
    }

    // Check win condition
    if (bricks.length === 0) {
      setGameWon(true)
      setIsPlaying(false)
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

    const { paddle, ball, bricks } = gameState.current

    // Draw paddle
    ctx.fillStyle = "#fff"
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)

    // Draw ball
    ctx.fillStyle = "#fff"
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height)

    // Draw bricks
    bricks.forEach((brick) => {
      ctx.fillStyle = brick.color
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
      ctx.strokeStyle = "#000"
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height)
    })
  }

  useEffect(() => {
    let animationId: number

    const gameLoop = () => {
      if (isPlaying && !gameOver && !gameWon) {
        updateGame()
        draw()
        animationId = requestAnimationFrame(gameLoop)
      }
    }

    if (isPlaying) {
      gameLoop()
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isPlaying, gameOver, gameWon, lives])

  const startGame = () => {
    if (gameOver || gameWon) {
      resetGame()
    }
    setIsPlaying(true)
  }

  const pauseGame = () => {
    setIsPlaying(false)
  }

  useEffect(() => {
    resetGame()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Breakout</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Score: {score}</span>
              <span>Lives: {lives}</span>
              <div className="flex gap-2">
                {!isPlaying && (
                  <Button onClick={startGame} size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    {gameOver || gameWon ? "Play Again" : "Start"}
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
              width={800}
              height={600}
              className="border-2 border-gray-300 bg-black mx-auto block"
            />
            <div className="text-center mt-4 text-sm text-gray-600">Use arrow keys to move the paddle</div>
            {gameOver && (
              <div className="text-center mt-4">
                <div className="text-xl font-bold text-red-600 mb-2">Game Over!</div>
                <div>Final Score: {score}</div>
              </div>
            )}
            {gameWon && (
              <div className="text-center mt-4">
                <div className="text-xl font-bold text-green-600 mb-2">You Won! 🎉</div>
                <div>Final Score: {score}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
