import { useEffect, useState } from 'react'
import { MAX_PLAYERS } from '~/utils/constants'
const knuthShuffle = require('knuth-shuffle').knuthShuffle

const boards: string[] = []
const limit = MAX_PLAYERS * 2 + 1

for (let index = 1; index < limit; index += 2) {
  boards.push(`${index},${index + 1}`)
}

export default function useRandomBoards(): string[] {
  const [randomBoards, setRandomBoards] = useState([])

  useEffect(() => {
    setRandomBoards(knuthShuffle(boards.slice(0)))
  }, [])

  return randomBoards
}
