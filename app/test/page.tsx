'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [result, setResult] = useState('')
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [timeout, setTimeout] = useState('')
  const [readKey, setReadKey] = useState('')
  const [readResult, setReadResult] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/python')
        const text = await response.text()
        setResult(text)
      } catch (error) {
        console.error('Error:', error)
        setResult('Error fetching data')
      }
    }

    fetchData()
  }, [])

  const handleWrite = async () => {
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }

      const response = await fetch('/api/add_to_kv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: parsedValue}),
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error:', error)
      setResult('Error writing data')
    }
  }

  const handleRead = async () => {
    try {
      const response = await fetch(`/api/get_from_kv/${readKey}`)
      const data = await response.json()
      setReadResult(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error:', error)
      setReadResult('Error reading data')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">API Result</h2>
        <pre className="text-lg whitespace-pre-wrap break-words">{result}</pre>

        <h3 className="text-xl font-bold mt-8 mb-4">Write to KV Store</h3>
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full p-2 mb-2 border rounded text-black"
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 mb-2 border rounded text-black"
        />
        <button
          onClick={handleWrite}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Write to KV
        </button>

        <h3 className="text-xl font-bold mt-8 mb-4">Read from KV Store</h3>
        <input
          type="text"
          placeholder="Key to read"
          value={readKey}
          onChange={(e) => setReadKey(e.target.value)}
          className="w-full p-2 mb-2 border rounded text-black"
        />
        <button
          onClick={handleRead}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Read from KV
        </button>
        <pre className="mt-4 text-lg whitespace-pre-wrap break-words">{readResult}</pre>
      </div>
    </main>
  )
}
