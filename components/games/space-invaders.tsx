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

interface Bullet extends GameObject {
  id: number
}

interface Alien extends GameObject {
  id: number
  type: number
}

export default function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)

  const gameState = useRef({
    player: { x: 375, y: 550, width: 50, height: 30 },
    bullets: [] as Bullet[],
    aliens: [] as Alien[],
    alienBullets: [] as Bullet[],
    keys: { left: false, right: false, space: false },
    lastBulletTime: 0,
    alienDirection: 1,
    lastAlienMoveTime: 0,
  })

  const initializeAliens = () => {
    const aliens: Alien[] = []
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        aliens.push({
          id: row * 10 + col,
          x: col * 60 + 50,
          y: row * 50 + 50,
          width: 40,
          height: 30,
          type: row,
        })
      }
    }
    gameState.current.aliens = aliens
  }

  const resetGame = () => {
    setScore(0)
    setLives(3)
    setGameOver(false)
    gameState.current.player = { x: 375, y: 550, width: 50, height: 30 }
    gameState.current.bullets = []
    gameState.current.alienBullets = []
    gameState.current.alienDirection = 1
    initializeAliens()
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowLeft":
        gameState.current.keys.left = true
        break
      case "ArrowRight":
        gameState.current.keys.right = true
        break
      case "Space":
        e.preventDefault()
        gameState.current.keys.space = true
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
      case "Space":
        gameState.current.keys.space = false
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
    const { player, bullets, aliens, alienBullets, keys } = gameState.current
    const currentTime = Date.now()

    // Move player
    if (keys.left && player.x > 0) {
      player.x -= 5
    }
    if (keys.right && player.x < 750) {
      player.x += 5
    }

    // Shoot bullets
    if (keys.space && currentTime - gameState.current.lastBulletTime > 250) {
      bullets.push({
        id: currentTime,
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
      })
      gameState.current.lastBulletTime = currentTime
    }

    // Move bullets
    gameState.current.bullets = bullets.filter((bullet) => {
      bullet.y -= 7
      return bullet.y > 0
    })

    // Move aliens
    if (currentTime - gameState.current.lastAlienMoveTime > 500) {
      let shouldMoveDown = false

      aliens.forEach((alien) => {
        alien.x += gameState.current.alienDirection * 20
        if (alien.x <= 0 || alien.x >= 760) {
          shouldMoveDown = true
        }
      })

      if (shouldMoveDown) {
        gameState.current.alienDirection *= -1
        aliens.forEach((alien) => {
          alien.y += 30
        })
      }

      gameState.current.lastAlienMoveTime = currentTime
    }

    // Alien shooting
    if (Math.random() < 0.02 && aliens.length > 0) {
      const randomAlien = aliens[Math.floor(Math.random() * aliens.length)]
      alienBullets.push({
        id: currentTime + Math.random(),
        x: randomAlien.x + randomAlien.width / 2,
        y: randomAlien.y + randomAlien.height,
        width: 4,
        height: 10,
      })
    }

    // Move alien bullets
    gameState.current.alienBullets = alienBullets.filter((bullet) => {
      bullet.y += 5
      return bullet.y < 600
    })

    // Check collisions
    gameState.current.bullets = bullets.filter((bullet) => {
      let hit = false
      gameState.current.aliens = aliens.filter((alien) => {
        if (
          bullet.x < alien.x + alien.width &&
          bullet.x + bullet.width > alien.x &&
          bullet.y < alien.y + alien.height &&
          bullet.y + bullet.height > alien.y
        ) {
          hit = true
          setScore((prev) => prev + (5 - alien.type) * 10)
          return false
        }
        return true
      })
      return !hit
    })

    // Check alien bullet collisions with player
    gameState.current.alienBullets = alienBullets.filter((bullet) => {
      if (
        bullet.x < player.x + player.width &&
        bullet.x + bullet.width > player.x &&
        bullet.y < player.y + player.height &&
        bullet.y + bullet.height > player.y
      ) {
        setLives((prev) => prev - 1)
        return false
      }
      return true
    })

    // Check game over conditions
    if (lives <= 0 || aliens.some((alien) => alien.y + alien.height >= player.y)) {
      setGameOver(true)
      setIsPlaying(false)
    }

    // Check win condition
    if (aliens.length === 0) {
      initializeAliens()
      setScore((prev) => prev + 1000)
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

    const { player, bullets, aliens, alienBullets } = gameState.current

    // Draw player
    ctx.fillStyle = "#0f0"
    ctx.fillRect(player.x, player.y, player.width, player.height)

    // Draw bullets
    ctx.fillStyle = "#ff0"
    bullets.forEach((bullet) => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
    })

    // Draw aliens
    aliens.forEach((alien) => {
      ctx.fillStyle = ["#f00", "#f80", "#ff0", "#0f8", "#08f"][alien.type]
      ctx.fillRect(alien.x, alien.y, alien.width, alien.height)
    })

    // Draw alien bullets
    ctx.fillStyle = "#f0f"
    alienBullets.forEach((bullet) => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
    })
  }

  useEffect(() => {
    let animationId: number

    const gameLoop = () => {
      if (isPlaying && !gameOver) {
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
  }, [isPlaying, gameOver, lives])

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
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Space Invaders</h1>
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
              width={800}
              height={600}
              className="border-2 border-gray-300 bg-black mx-auto block"
            />
            <div className="text-center mt-4 text-sm text-gray-600">Use arrow keys to move, spacebar to shoot</div>
            {gameOver && (
              <div className="text-center mt-4">
                <div className="text-xl font-bold text-red-600 mb-2">Game Over!</div>
                <div>Final Score: {score}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
