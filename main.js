//container && canvas && 2-Dimensional rendering context

var dc = document.getElementById('container')

// Supabase Configuration
const SUPABASE_URL = 'https://jjneuqhgdjydjanlygbw.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbmV1cWhnZGp5ZGphbmx5Z2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1ODA3MTgsImV4cCI6MjA5NTE1NjcxOH0.odnPoLV8NGD1GezSYdntlfOIY0zm1d7TM6rZKLif5DY'
var supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null

var main = document.getElementById('main')
main.width = window.innerWidth
main.height = window.innerHeight
var draw = main.getContext('2d')
var nameModal = document.getElementById('name-modal')

//document stuff

document.body.style.padding = '0'
document.body.style.margin = '0'
document.body.style.overflow = 'hidden'
main.style.position = 'fixed'
main.style.top = '0'
main.style.left = '0'
main.style.width = '100vw'
main.style.height = '100vh'
const font = document.createElement('link')
font.href = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
font.rel = "stylesheet"
document.head.appendChild(font)
document.body.style.fontFamily = "DM Sans, sans-serif"


var state = {
	difficultyScale: 1,
	get simulation() { return window.simulation },
	get player() { return window.player },
	get upgrades() { return window.upgrades },
	get guns() { return window.guns },
	get level() { return window.level },
	get mobs() { return window.mobs },
	get bullets() { return window.bullets },
	get powerUps() { return window.powerUps },
	get collisions() { return window.collisions },
	get hud() { return window.hud },
	get input() { return window.input },
	get particles() { return window.particles },

	/**
	 * Resets all registered modules to their default states.
	 */
	resetAll() {
		const modules = [
			this.simulation, this.player, this.upgrades, this.guns, this.level,
			this.mobs, this.bullets, this.powerUps, this.collisions, this.hud,
			this.input, this.particles
		]
		modules.forEach(mod => {
			if (mod && typeof mod.reset === 'function') mod.reset()
		})
	}
}

//HTML element objects

var start, controls, controlDoc, settings, leaderboardButton, leaderboardModal, leaderboardList,
	feedbackButton, pauseScreen, chooseScreen

//styling

var settingsMenu
let remappingAction = null

//appending children

//button logic

window.addEventListener('load', () => {
	// Initialize elements inside the load listener to ensure they aren't null
	start = document.getElementById('start')
	controls = document.getElementById('controls')
	controlDoc = document.getElementById('control-doc')
	settings = document.getElementById('settings')
	leaderboardButton = document.getElementById('leaderboard-button')
	leaderboardModal = document.getElementById('leaderboard-modal')
	leaderboardList = document.getElementById('leaderboard-list')
	feedbackButton = document.getElementById('feedback-button')
	pauseScreen = document.getElementById('pause-screen')
	chooseScreen = document.getElementById('choice-screen')

	settingsMenu = document.createElement('div')
	settingsMenu.id = 'settings-menu'
	dc.appendChild(settingsMenu)

	start.onclick = function () {
		if (simulation.interval) clearInterval(simulation.interval)
		simulation.init()
	}.bind(this)

	leaderboardButton.onclick = async function () {
		leaderboardModal.style.display = 'flex'
		leaderboardList.innerHTML = 'Loading...'

		// Attempt re-initialization if script loaded late
		if (!supabaseClient && window.supabase) supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

		if (!supabaseClient) {
			leaderboardList.innerHTML = 'Error: Supabase not initialized.'
			return
		}

		try {
			const { data, error } = await supabaseClient
				.from('leaderboard')
				.select('*')
				.order('level', { ascending: false })
				.limit(10)

			if (error) throw error
			if (!data || data.length <= 0) {
				leaderboardList.innerHTML = 'No scores yet!'
			} else {
				leaderboardList.innerHTML = data.map((entry, i) =>
					`<div>${i + 1}. <b>${entry.name}</b> - Level ${entry.level}</div>`
				).join('')
			}
		} catch (e) {
			leaderboardList.innerHTML = 'Error loading scores.'
		}
	}.bind(this)

	document.getElementById('close-leaderboard').onclick = function () {
		leaderboardModal.style.display = 'none'
	}

	feedbackButton.onclick = function () {
		window.open("https://forms.gle/QinmVfLSQpMya29R9")
	}

	settings.onclick = function () {
		settingsMenu.style.display = settingsMenu.style.display == 'block' ? 'none' : 'block'
		renderSettings()
	}.bind(this)

	function renderSettings() {
		settingsMenu.innerHTML = '<h3>Settings</h3>'

		// Restart Button (only visible during gameplay)
		if (!simulation.isMainMenu) {
			const restartBtn = document.createElement('button')
			restartBtn.innerText = 'Restart'
			restartBtn.style.width = '100%'
			restartBtn.style.padding = '10px'
			restartBtn.style.marginBottom = '20px'
			restartBtn.style.backgroundColor = 'hsl(0, 100%, 30%)'
			restartBtn.style.color = 'white'
			restartBtn.style.border = 'none'
			restartBtn.style.borderRadius = '5px'
			restartBtn.style.cursor = 'pointer'
			restartBtn.onclick = () => {
				settingsMenu.style.display = 'none'
				simulation.init()
			}
			settingsMenu.appendChild(restartBtn)

			const quitBtn = document.createElement('button')
			quitBtn.innerText = 'Quit to Main Menu'
			quitBtn.style.width = '100%'
			quitBtn.style.padding = '10px'
			quitBtn.style.marginBottom = '20px'
			quitBtn.style.backgroundColor = 'hsl(0, 0%, 20%)'
			quitBtn.style.color = 'white'
			quitBtn.style.border = 'none'
			quitBtn.style.borderRadius = '5px'
			quitBtn.style.cursor = 'pointer'
			quitBtn.onclick = () => {
				settingsMenu.style.display = 'none'
				simulation.mainMenu()
			}
			settingsMenu.appendChild(quitBtn)
		}

		// Difficulty Slider
		const diffContainer = document.createElement('div')
		diffContainer.style.marginBottom = '20px'
		diffContainer.style.borderBottom = '1px solid #333'
		diffContainer.style.paddingBottom = '10px'

		const diffLabel = document.createElement('div')
		diffLabel.innerText = `Difficulty Scale: ${state.difficultyScale.toFixed(1)}x`
		diffLabel.style.marginBottom = '5px'

		const diffSlider = document.createElement('input')
		diffSlider.type = 'range'
		diffSlider.min = '0.2'
		diffSlider.max = '5.0'
		diffSlider.step = '0.1'
		diffSlider.value = state.difficultyScale
		diffSlider.style.width = '100%'
		diffSlider.oninput = () => {
			state.difficultyScale = parseFloat(diffSlider.value)
			diffLabel.innerText = `Difficulty Scale: ${state.difficultyScale.toFixed(1)}x`
		}

		diffContainer.appendChild(diffLabel)
		diffContainer.appendChild(diffSlider)
		settingsMenu.appendChild(diffContainer)

		// Leaderboard Name Setting
		const nameContainer = document.createElement('div')
		nameContainer.style.marginBottom = '20px'
		nameContainer.style.borderBottom = '1px solid #333'
		nameContainer.style.paddingBottom = '10px'

		const nameLabel = document.createElement('div')
		nameLabel.innerText = 'Leaderboard Name:'
		nameLabel.style.marginBottom = '5px'

		const nameInput = document.createElement('input')
		nameInput.type = 'text'
		nameInput.placeholder = 'Enter name...'
		nameInput.value = localStorage.getItem('tetragon-username') || "Anonymous"
		nameInput.style.width = '100%'
		nameInput.style.padding = '8px'
		nameInput.style.backgroundColor = '#111'
		nameInput.style.color = 'white'
		nameInput.style.border = '1px solid #444'
		nameInput.oninput = () => localStorage.setItem('tetragon-username', nameInput.value.trim())

		nameContainer.appendChild(nameLabel)
		nameContainer.appendChild(nameInput)
		settingsMenu.appendChild(nameContainer)

		for (const action in state.input.keybinds) {
			const container = document.createElement('div')
			container.style.marginBottom = '10px'
			container.style.display = 'flex'
			container.style.justifyContent = 'space-between'
			container.style.alignItems = 'center'

			const label = document.createElement('span')
			label.innerText = action.charAt(0).toUpperCase() + action.slice(1) + ': '

			const btn = document.createElement('button')
			btn.innerText = state.input.keybinds[action].replace('Key', '').replace('Digit', '')
			btn.style.padding = '5px 10px'
			btn.onclick = () => {
				remappingAction = action
				btn.innerText = 'Press a key...'
			}

			container.appendChild(label)
			container.appendChild(btn)
			settingsMenu.appendChild(container)
		}
	}

	document.addEventListener('keydown', function (e) {
		if (remappingAction && settingsMenu.style.display === 'block') {
			e.preventDefault()
			if (e.code !== 'Escape') {
				state.input.keybinds[remappingAction] = e.code
				localStorage.setItem('tetragon-keybinds', JSON.stringify(state.input.keybinds))
			}
			if (!state.input.preventDefaultList.includes(e.code)) state.input.preventDefaultList.push(e.code)
			remappingAction = null
			renderSettings()
		}
	}.bind(this))

	// Initial UI State
	start.style.display = 'block'
	controls.style.display = 'block'
	settings.style.display = 'block'
	leaderboardButton.style.display = 'block'
	feedbackButton.style.display = 'block'
	pauseScreen.style.display = 'none'
	document.getElementById('name-modal').style.display = 'none'
	main.style.display = 'none'

	renderSettings() // Initial render

	window.submitHighScore = async function (score) {
		const playerName = localStorage.getItem('tetragon-username') || "Anonymous"
		simulation.scoreStatus = "Submitting score..."

		if (!supabaseClient && window.supabase) {
			supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
		}

		try {
			await supabaseClient.from('leaderboard').insert([{ name: playerName, level: score }])
			simulation.scoreStatus = "Score submitted successfully!"
		} catch (err) {
			console.error("Failed to submit score", err)
			simulation.scoreStatus = "Failed to submit score."
		}
	}
})