"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Shuffle, RotateCcw } from "lucide-react"

export default function SlidingPuzzle() {
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)

  const initializePuzzle = () => {
    const initialTiles = Array.from({ length: 15 }, (_, i) => i + 1).concat([0])
    setTiles(initialTiles)
    setMoves(0)
    setIsWon(false)
  }

  const shufflePuzzle = () => {
    const shuffled = [...tiles]

    // Perform random valid moves to ensure solvability
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffled.indexOf(0)
      const possibleMoves = getPossibleMoves(emptyIndex)

      if (possibleMoves.length > 0) {
        const randomMoveIndex = Math.floor(Math.random() * possibleMoves.length)
        const randomMove = possibleMoves[randomMoveIndex]

        // Swap empty tile with random adjacent tile
        const temp = shuffled[emptyIndex]
        shuffled[emptyIndex] = shuffled[randomMove]
        shuffled[randomMove] = temp
      }
    }

    setTiles(shuffled)
    setMoves(0)
    setIsWon(false)
  }

  const getPossibleMoves = (emptyIndex: number): number[] => {
    const moves = []
    const row = Math.floor(emptyIndex / 4)
    const col = emptyIndex % 4

    if (row > 0) moves.push(emptyIndex - 4) // Up
    if (row < 3) moves.push(emptyIndex + 4) // Down
    if (col > 0) moves.push(emptyIndex - 1) // Left
    if (col < 3) moves.push(emptyIndex + 1) // Right

    return moves
  }

  const handleTileClick = (index: number) => {
    if (isWon) return

    const emptyIndex = tiles.indexOf(0)
    const possibleMoves = getPossibleMoves(emptyIndex)

    if (possibleMoves.includes(index)) {
      const newTiles = [...tiles]
      newTiles[emptyIndex] = newTiles[index]
      newTiles[index] = 0
      setTiles(newTiles)
      setMoves(moves + 1)
    }
  }

  const checkWin = () => {
    const winCondition = Array.from({ length: 15 }, (_, i) => i + 1).concat([0])
    return tiles.every((tile, index) => tile === winCondition[index])
  }

  useEffect(() => {
    initializePuzzle()
  }, [])

  useEffect(() => {
    if (tiles.length > 0 && checkWin()) {
      setIsWon(true)
    }
  }, [tiles])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Sliding Puzzle</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isWon ? `Puzzle Solved in ${moves} moves! 🎉` : `Moves: ${moves}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 mb-6 max-w-sm mx-auto">
              {tiles.map((tile, index) => (
                <Button
                  key={index}
                  variant={tile === 0 ? "ghost" : "outline"}
                  className={`h-16 text-lg font-bold ${
                    tile === 0 ? "invisible cursor-default" : "bg-blue-100 hover:bg-blue-200"
                  }`}
                  onClick={() => handleTileClick(index)}
                  disabled={tile === 0 || isWon}
                >
                  {tile === 0 ? "" : tile}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={shufflePuzzle} className="flex-1">
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Button>
              <Button onClick={initializePuzzle} variant="outline" className="flex-1 bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
