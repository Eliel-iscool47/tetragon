
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
const PORT = 3000

// Replace these with your actual Supabase credentials from your project settings
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

app.use(cors())
app.use(express.json())

app.post('/api/feedback', async (req, res) => {
	const { message } = req.body

	if (!message) {
		return res.status(400).json({ error: 'Message is required' })
	}

	try {
		const response = await fetch(DISCORD_WEBHOOK_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				content: `**New Feedback for Tetragon:**\n${message}`
			})
		})

		if (response.ok) res.status(200).json({ success: true })
		else res.status(500).json({ error: 'Discord API error' })
	} catch (error) {
		res.status(500).json({ error: 'Server error' })
	}
})

// Leaderboard Routes
app.get('/api/leaderboard', (req, res) => {
	supabase
		.from('leaderboard')
		.select('name, level')
		.order('level', { ascending: false })
		.limit(10)
		.then(({ data, error }) => {
			if (error) {
				return res.status(500).json({ error: error.message })
			}
			res.json(data)
		})
})

app.post('/api/score', (req, res) => {
	const { name, level } = req.body
	if (!name || level === undefined) return res.status(400).json({ error: 'Name and level required' })

	supabase
		.from('leaderboard')
		.insert([{ name, level }])
		.then(({ error }) => {
			if (error) {
				return res.status(500).json({ error: error.message })
			}
			res.status(200).json({ success: true })
		})
})

app.use(express.static('.')) // Serve static files last

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
