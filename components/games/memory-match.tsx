"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, RotateCcw } from "lucide-react"

const emojis = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺"]

export default function MemoryMatch() {
  const [cards, setCards] = useState<{ id: number; emoji: string; isFlipped: boolean; isMatched: boolean }[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(gameCards)
    setFlippedCards([])
    setMoves(0)
    setIsWon(false)
  }

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards

      setTimeout(() => {
        setCards((prevCards) => {
          const firstCard = prevCards.find((card) => card.id === first)
          const secondCard = prevCards.find((card) => card.id === second)

          if (firstCard?.emoji === secondCard?.emoji) {
            // Mark as matched
            return prevCards.map((card) =>
              card.id === first || card.id === second ? { ...card, isMatched: true } : card,
            )
          } else {
            // Flip back
            return prevCards.map((card) => (card.isMatched ? card : { ...card, isFlipped: false }))
          }
        })
        setFlippedCards([])
      }, 1000)
    }
  }, [flippedCards]) // Remove 'cards' from dependency array

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsWon(true)
    }
  }, [cards])

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return

    setCards((prevCards) => {
      const card = prevCards.find((c) => c.id === id)
      if (card?.isFlipped || card?.isMatched) return prevCards

      return prevCards.map((card) => (card.id === id ? { ...card, isFlipped: true } : card))
    })

    setFlippedCards((prev) => {
      const newFlipped = [...prev, id]
      if (newFlipped.length === 2) {
        setMoves((moves) => moves + 1)
      }
      return newFlipped
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Memory Match</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isWon ? `Congratulations! You won in ${moves} moves!` : `Moves: ${moves}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {cards.map((card) => (
                <Button
                  key={card.id}
                  variant="outline"
                  className={`h-20 text-2xl ${card.isFlipped || card.isMatched ? "bg-blue-100" : "bg-gray-100"}`}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isFlipped || card.isMatched || flippedCards.length === 2}
                >
                  {card.isFlipped || card.isMatched ? card.emoji : "?"}
                </Button>
              ))}
            </div>
            <Button onClick={initializeGame} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
