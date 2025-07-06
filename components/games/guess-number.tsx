"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, RotateCcw } from "lucide-react"

export default function GuessNumber() {
  const [targetNumber, setTargetNumber] = useState<number>(0)
  const [guess, setGuess] = useState<string>("")
  const [attempts, setAttempts] = useState<number>(0)
  const [message, setMessage] = useState<string>("")
  const [gameWon, setGameWon] = useState<boolean>(false)
  const [guessHistory, setGuessHistory] = useState<{ guess: number; hint: string }[]>([])

  const generateNewNumber = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1)
    setGuess("")
    setAttempts(0)
    setMessage("I'm thinking of a number between 1 and 100. Can you guess it?")
    setGameWon(false)
    setGuessHistory([])
  }

  useEffect(() => {
    generateNewNumber()
  }, [])

  const handleGuess = () => {
    const guessNumber = Number.parseInt(guess)

    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 100) {
      setMessage("Please enter a valid number between 1 and 100!")
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    let hint = ""
    if (guessNumber === targetNumber) {
      setMessage(`🎉 Congratulations! You guessed it in ${newAttempts} attempts!`)
      setGameWon(true)
      hint = "Correct!"
    } else if (guessNumber < targetNumber) {
      setMessage("Too low! Try a higher number.")
      hint = "Too low"
    } else {
      setMessage("Too high! Try a lower number.")
      hint = "Too high"
    }

    setGuessHistory((prev) => [...prev, { guess: guessNumber, hint }])
    setGuess("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !gameWon) {
      handleGuess()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Guess the Number</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Attempts: {attempts}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-lg mb-4">{message}</p>

              {!gameWon && (
                <div className="flex gap-2 max-w-xs mx-auto">
                  <Input
                    type="number"
                    placeholder="Enter your guess"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyPress={handleKeyPress}
                    min="1"
                    max="100"
                  />
                  <Button onClick={handleGuess}>Guess</Button>
                </div>
              )}
            </div>

            {guessHistory.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Guess History:</h3>
                <div className="max-h-40 overflow-y-auto">
                  {guessHistory.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded mb-1">
                      <span>
                        Guess #{index + 1}: {entry.guess}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          entry.hint === "Correct!"
                            ? "text-green-600"
                            : entry.hint === "Too low"
                              ? "text-blue-600"
                              : "text-red-600"
                        }`}
                      >
                        {entry.hint}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={generateNewNumber} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
