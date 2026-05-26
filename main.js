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
main.style.zIndex = '-1'

const style = document.createElement('style')
style.innerHTML = `
	.gun-button, .upgrade-button, .reroll-button, .cancel-button {
		background: rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(0, 0, 0, 0.15);
		color: black;
		border-radius: 8px;
		cursor: pointer;
		font-family: 'DM Sans', sans-serif;
		transition: background 0.2s;
		padding: 10px;
	}
	.reroll-button, .cancel-button { position: absolute; }
	.gun-button, .upgrade-button { position: relative; width: 80%; margin: 10px auto; display: block; }
	.gun-button:hover, .upgrade-button:hover { background: rgba(0, 0, 0, 0.1); }
	@media (max-width: 768px) {
		#HUD { font-size: 12px; }
		#inventory, #upgrade-list { width: 140px !important; font-size: 14px !important; }
		#level-counter { width: 140px !important; left: 50% !important; transform: translateX(-50%) !important; }
	}
	#mobile-controls {
		z-index: 1000;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
	}
	#move-base, #aim-base {
		transition: transform 0.1s;
	}
	#move-base {
		transform-origin: bottom left;
	}
	#aim-base {
		transform-origin: bottom right;
	}
	::-webkit-scrollbar {
		width: 8px;
	}
	::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.05);
	}
	::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 4px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.3);
	}
`
document.head.appendChild(style)

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
	feedbackButton, pauseScreen, chooseScreen, title

//styling

var settingsMenu
let remappingAction = null

//mobile controls

var mobileControls
function updateMobileFireVisibility() {
	if (document.getElementById('mobile-fire')) {
		document.getElementById('mobile-fire').style.display = state.input.isAutoFire ? 'none' : 'block'
	}
}
function updateJoystickScale() {
	const scale = state.input.joystickSize
	if (document.getElementById('move-base')) document.getElementById('move-base').style.transform = `scale(${scale})`
	if (document.getElementById('aim-base')) document.getElementById('aim-base').style.transform = `scale(${scale})`
}

//

window.addEventListener('load', () => {
	title = document.getElementById('title')
	mobileControls = document.getElementById('mobile-controls')

	// Setup Mobile Controls HTML
	if (mobileControls) {
		mobileControls.style.pointerEvents = 'none'
		mobileControls.innerHTML = `
			<div id="move-base" style="position: absolute; bottom: 8vh; left: 8vh; width: 18vh; height: 18vh; background: rgba(255,255,255,0.1); border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); touch-action: none; pointer-events: auto;">
				<div id="move-thumb" style="position: absolute; top: 6.5vh; left: 6.5vh; width: 5vh; height: 5vh; background: white; border-radius: 50%; opacity: 0.5; pointer-events: none;"></div>
			</div>
			<div id="aim-base" style="position: absolute; bottom: 8vh; right: 8vh; width: 18vh; height: 18vh; background: rgba(255,255,255,0.1); border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); touch-action: none; pointer-events: auto;">
				<div id="aim-thumb" style="position: absolute; top: 6.5vh; left: 6.5vh; width: 5vh; height: 5vh; background: #ff4444; border-radius: 50%; opacity: 0.5; pointer-events: none;"></div>
			</div>
			<button id="mobile-fire" style="position: absolute; bottom: 8vh; right: 28vh; width: 12vh; height: 12vh; background: rgba(255,68,68,0.3); color: white; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; font-family: 'DM Sans'; font-size: 18px; font-weight: bold; z-index: 1000; touch-action: none; pointer-events: auto;">FIRE</button>
			<button id="mobile-menu-toggle" style="position: absolute; top: 20px; right: 20px; padding: 10px 20px; background: rgba(0,0,0,0.5); color: white; border: 1px solid white; border-radius: 8px; font-family: 'DM Sans'; font-size: 16px; z-index: 1000; touch-action: none; pointer-events: auto;">Toggle Menus</button>
			<button id="mobile-gun-cycle" style="position: absolute; top: 80px; right: 20px; padding: 10px 20px; background: rgba(0,0,0,0.5); color: white; border: 1px solid white; border-radius: 8px; font-family: 'DM Sans'; font-size: 16px; z-index: 1000; touch-action: none; pointer-events: auto;">Cycle Guns</button>
		`
		const fireBtn = document.getElementById('mobile-fire')
		if (fireBtn) {
			const startFire = (e) => { e.preventDefault(); if (!input.pressedKeys.includes('MobileFire')) input.pressedKeys.push('MobileFire') }
			const stopFire = (e) => { e.preventDefault(); input.pressedKeys = input.pressedKeys.filter(k => k !== 'MobileFire') }
			fireBtn.addEventListener('touchstart', startFire)
			fireBtn.addEventListener('touchend', stopFire)
			fireBtn.addEventListener('touchcancel', stopFire)
		}

		document.getElementById('mobile-menu-toggle').onclick = (e) => {
			e.preventDefault()
			hud.showMobileMenu = !hud.showMobileMenu
		}
		document.getElementById('mobile-gun-cycle').onclick = (e) => {
			e.preventDefault()
			input.gunRight()
		}
		updateJoystickScale()
		updateMobileFireVisibility()
		input.initJoystick()
	}

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

	controls.onclick = function () {
		controlDoc.style.display = controlDoc.style.display == 'block' ? 'none' : 'block'
	}

	// Ensure controls are styled and populated
	controlDoc.style.position = 'fixed'
	controlDoc.style.top = '50%'
	controlDoc.style.left = '50%'
	controlDoc.style.transform = 'translate(-50%, -50%)'
	controlDoc.style.zIndex = '1000'

	const updateControls = () => {
		controlDoc.innerHTML = `
			<div style="background: rgba(245, 245, 245, 0.98); padding: 30px; border-radius: 15px; border: 1px solid rgba(0,0,0,0.1); color: black; min-width: 320px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); font-family: 'DM Sans', sans-serif;">
				<h2 style="margin-top: 0; border-bottom: 2px solid rgba(0,0,0,0.05); padding-bottom: 10px; text-align: center;">Controls</h2>
				<div style="max-height: 60vh; overflow-y: auto; padding-right: 10px;">
					${Object.entries(state.input.keybinds).map(([action, key]) => `
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 1.1em;">
							<span style="color: #555; margin-right: 20px;">${action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
							<kbd style="background: #eee; border: 1px solid #ccc; border-radius: 4px; padding: 2px 8px; font-family: monospace; box-shadow: 0 2px 0 #bbb; color: #333;">${key.replace('Key', '').replace('Digit', '')}</kbd>
						</div>
					`).join('')}
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 1.1em; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 12px;">
						<span style="color: #555;">Fire (Alt):</span>
						<kbd style="background: #eee; border: 1px solid #ccc; border-radius: 4px; padding: 2px 8px; font-family: monospace; box-shadow: 0 2px 0 #bbb; color: #333;">Left Click</kbd>
					</div>
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 1.1em;">
						<span style="color: #555;">Toggle Menu:</span>
						<kbd style="background: #eee; border: 1px solid #ccc; border-radius: 4px; padding: 2px 8px; font-family: monospace; box-shadow: 0 2px 0 #bbb; color: #333;">Tab</kbd>
					</div>
				</div>
				<button onclick="this.closest('#control-doc').style.display='none'" style="width: 100%; margin-top: 20px; padding: 12px; background: #333; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1.1em; font-family: 'DM Sans', sans-serif;">Close</button>
			</div>
		`
	}
	updateControls()

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
		settingsMenu.style.color = 'black'
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

		// Joystick Size Slider (Mobile Only)
		if (simulation.isMobile) {
			const joyContainer = document.createElement('div')
			joyContainer.style.marginBottom = '20px'
			joyContainer.style.borderBottom = '1px solid #333'
			joyContainer.style.paddingBottom = '10px'

			const joyLabel = document.createElement('div')
			joyLabel.innerText = `Joystick Size: ${state.input.joystickSize.toFixed(1)}x`
			joyLabel.style.marginBottom = '5px'

			const joySlider = document.createElement('input')
			joySlider.type = 'range'
			joySlider.min = '0.5'
			joySlider.max = '2.5'
			joySlider.step = '0.1'
			joySlider.value = state.input.joystickSize
			joySlider.style.width = '100%'
			joySlider.oninput = () => {
				state.input.joystickSize = parseFloat(joySlider.value)
				localStorage.setItem('tetragon-joystick-size', joySlider.value)
				joyLabel.innerText = `Joystick Size: ${state.input.joystickSize.toFixed(1)}x`
				updateJoystickScale()
			}

			joyContainer.appendChild(joyLabel)
			joyContainer.appendChild(joySlider)
			settingsMenu.appendChild(joyContainer)
		}

		// Auto-fire Toggle (Mobile Only)
		if (simulation.isMobile) {
			const autoFireContainer = document.createElement('div')
			autoFireContainer.style.marginBottom = '20px'
			autoFireContainer.style.display = 'flex'
			autoFireContainer.style.justifyContent = 'space-between'
			autoFireContainer.style.alignItems = 'center'

			const autoFireLabel = document.createElement('span')
			autoFireLabel.innerText = 'Auto-fire:'

			const autoFireBtn = document.createElement('button')
			autoFireBtn.innerText = state.input.isAutoFire ? 'ON' : 'OFF'
			autoFireBtn.style.padding = '5px 15px'
			autoFireBtn.onclick = () => {
				state.input.isAutoFire = !state.input.isAutoFire
				localStorage.setItem('tetragon-auto-fire', state.input.isAutoFire)
				renderSettings()
				updateMobileFireVisibility()
			}

			autoFireContainer.appendChild(autoFireLabel)
			autoFireContainer.appendChild(autoFireBtn)
			settingsMenu.appendChild(autoFireContainer)
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
		nameInput.style.backgroundColor = '#f0f0f0'
		nameInput.style.color = 'black'
		nameInput.style.border = '1px solid #ccc'
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
	if (title) title.style.display = 'block'
	document.getElementById('name-modal').style.display = 'none'
	main.style.display = 'block'

	renderSettings() // Initial render

	// Start the background animation loop for the main menu
	if (!simulation.interval) {
		simulation.interval = setInterval(simulation.gameLoop.bind(simulation), 1000 / simulation.fps)
	}

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