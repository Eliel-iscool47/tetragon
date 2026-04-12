//container && canvas && 2-Dimensional rendering context

const dc = document.getElementById('container')
const main = document.getElementById('main')
main.width = window.innerWidth
main.height = window.innerHeight
const draw = main.getContext('2d')

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

//HTML element objects

const start = document.getElementById('start')
const controls = document.getElementById('controls')
const controlDoc = document.getElementById('control-doc')
const settings = document.getElementById('settings')
const creditsButton = document.getElementById('credits-button')
const credits = document.getElementById('credits')
const pauseScreen = document.getElementById('pause-screen')
const pauseText = pauseScreen.querySelector('h1')
const pauseSubtext = pauseScreen.querySelector('p')
const chooseScreen = document.getElementById('choice-screen')
const chooseHeader = chooseScreen.querySelector('h1')
const chooseText = document.createElement('ul')
chooseScreen.appendChild(chooseText)

//styling

pauseSubtext.style.fontSize = `${main.width * 0.03}px`
pauseSubtext.style.textAlign = 'center'
pauseSubtext.style.color = 'white'
pauseSubtext.style.position = 'absolute'
pauseSubtext.style.top = '50vh'
pauseSubtext.style.left = '50%'
pauseSubtext.style.transform = 'translate(-50%, -50%)'
pauseText.style.position = 'absolute'
pauseText.style.top = '15%'
pauseText.style.left = '50%'
pauseText.style.textAlign = 'center'
pauseText.style.color = 'white'
pauseText.style.transform = 'translate(-50%, -50%)'
pauseScreen.style.position = 'fixed'
pauseScreen.style.top = '0'
pauseScreen.style.left = '0'
pauseScreen.style.width = '100vw'
pauseScreen.style.height = '100vh'
pauseScreen.style.display = 'none'

//appending children

dc.appendChild(start)
dc.appendChild(controls)
dc.appendChild(settings)
dc.appendChild(creditsButton)
dc.appendChild(controlDoc)

//start button

start.style.position = 'absolute'
start.style.top = `${main.height * 0.3}px`
start.style.left = `${main.width * 0.4}px`
start.style.width = `${main.width * 0.2}px`
start.style.height = `${main.height * 0.2}px`
start.style.cursor = 'pointer'

//controls button

controls.style.position = 'absolute'
controls.style.top = `${main.height * 0.1}px`
controls.style.left = `${main.width * 0.15}px`
controls.style.width = `${main.width * 0.2}px`
controls.style.height = `${main.height * 0.1}px`
controls.style.cursor = 'pointer'
controlDoc.style.position = 'absolute'
controlDoc.style.top = `${main.height * 0.2}px`
controlDoc.style.left = `${main.width * 0.15}px`
controlDoc.style.width = `${main.width * 0.2}px`
controlDoc.style.height = `${main.height * 0.2}px`
controlDoc.style.fontSize = `${main.width * 0.015}px`
controlDoc.style.overflowY = 'scroll'
controlDoc.style.overflowX = 'hidden'

//settings button

settings.style.position = 'absolute'
settings.style.top = `${main.height * 0.2}px`
settings.style.left = `${main.width * 0.65}px`
settings.style.width = `${main.width * 0.2}px`
settings.style.height = `${main.height * 0.2}px`
settings.style.cursor = 'pointer'

//credits button

creditsButton.style.position = 'absolute'
creditsButton.style.top = `${main.height * 0.1}px`
creditsButton.style.left = `${main.width * 0.425}px`
creditsButton.style.width = `${main.width * 0.15}px`
creditsButton.style.height = `${main.height * 0.1}px`
creditsButton.style.cursor = 'pointer'

//credits

credits.style.position = 'absolute'
credits.style.top = `${main.height * 0.1}px`
credits.style.left = `${main.width * 0.65}px`
credits.style.width = `${main.width * 0.35}px`
credits.style.height = `${main.height * 0.1}px`
credits.style.fontSize = `${main.width * 0.01}px`
credits.style.cursor = 'pointer'
credits.style.overflowY = 'scroll'
credits.style.overflowX = 'hidden'
credits.style.border = '3px solid hsl(0, 0%, 0%)'
credits.innerHTML = `
<h1>Credits && Info</h1>
<h2>Credits</h2>
<p>Eliel-isCool47: art, code, ideas</p>
<h2>Info</h2>
<p>Github Repo: https://github.com/Eliel-isCool47/Tetragon</p>
<p>more info on the README</p>
`
credits.style.display = 'none'

//button logic

start.onclick = function () {
	simulation.init()
}.bind(this)
controls.onclick = function () {
	controlDoc.innerHTML = `
Controls<br>
${input.keybinds.up.replace('Key', '').replace('Digit', '')}, ${input.keybinds.down.replace('Key', '').replace('Digit', '')}, ${input.keybinds.left.replace('Key', '').replace('Digit', '')}, ${input.keybinds.right.replace('Key', '').replace('Digit', '')} or Arrow Keys: Move<br>
Left Click or ${input.keybinds.fire.replace('Key', '').replace('Digit', '')}: Shoot<br>
Mouse move: Aim<br>
${input.keybinds.respawn.replace('Key', '').replace('Digit', '')}: Respawn<br>
${input.keybinds.mainMenu.replace('Key', '').replace('Digit', '')}: Go to the Main Menu<br>
Tab: Toggle this menu<br>
Escape or ${input.keybinds.pause.replace('Key', '').replace('Digit', '')}: Pause<br>
${input.keybinds.gunLeft.replace('Key', '').replace('Digit', '')}: Cycle gun left<br>
${input.keybinds.gunRight.replace('Key', '').replace('Digit', '')}: Cycle gun right<br>
`
	controlDoc.style.display = controlDoc.style.display == 'block' ? 'none' : 'block'
}.bind(this)
settings.onclick = function () {
	settingsMenu.style.display = settingsMenu.style.display == 'block' ? 'none' : 'block'
	renderSettings()
}.bind(this)
creditsButton.onclick = function () {
	credits.style.display = credits.style.display == 'block' ? 'none' : 'block'
}.bind(this)
start.style.display = 'block'
controls.style.display = 'block'
settings.style.display = 'block'
creditsButton.style.display = 'block'
main.style.display = 'none'

const settingsMenu = document.createElement('div')
dc.appendChild(settingsMenu)
settingsMenu.style.position = 'absolute'
settingsMenu.style.top = `${parseFloat(settings.style.top) + parseFloat(settings.style.height)}px`
settingsMenu.style.left = `${parseFloat(settings.style.left)}px`
settingsMenu.style.width = `${parseFloat(settings.style.width)}px`
settingsMenu.style.height = `fit-content`
settingsMenu.style.maxHeight = `${main.height * 0.5}px`
settingsMenu.style.backgroundColor = `${settings.style.backgroundColor}`
settingsMenu.style.color = 'hsl(0, 0%, 0%)'
settingsMenu.style.fontSize = '20px'
settingsMenu.style.overflowY = 'scroll'
settingsMenu.style.display = 'none'
settingsMenu.style.padding = '20px'
settingsMenu.style.border = '2px solid hsl(0, 0%, 10%)'
settingsMenu.style.zIndex = '100'

let remappingAction = null

function renderSettings() {
	settingsMenu.innerHTML = '<h1>Settings - Keybinds</h1><p>Click to remap. Escape to cancel.</p>'
	const closeBtn = document.createElement('button')
	closeBtn.innerText = 'Close'
	closeBtn.style.fontSize = '20px'
	closeBtn.onclick = function () {
		settingsMenu.style.display = 'none'
		remappingAction = null
	}.bind(this)
	settingsMenu.appendChild(closeBtn)
	settingsMenu.appendChild(document.createElement('hr'))

	for (const [action, key] of Object.entries(input.keybinds)) {
		if (key == input.keybinds.testing || key == input.keybinds.reload || key == input.keybinds.allGuns || key == input.keybinds.mainMenu) continue
		const container = document.createElement('div')
		container.style.margin = '10px 0'
		const btn = document.createElement('button')
		btn.innerText = remappingAction === action ? 'Press any key... Escape to cancel' : `${action}: ${key.replace('Key', '').replace('Digit', '')}`
		btn.style.fontSize = '18px'
		btn.style.width = '400px'
		btn.style.textAlign = 'left'
		btn.onclick = function () {
			remappingAction = action
			renderSettings()
		}.bind(this)
		container.appendChild(btn)
		settingsMenu.appendChild(container)
	}
}

document.addEventListener('keydown', function (e) {
	if (remappingAction && settingsMenu.style.display === 'block') {
		e.preventDefault()
		if (e.code !== 'Escape') {
			input.keybinds[remappingAction] = e.code
			localStorage.setItem('tetragon-keybinds', JSON.stringify(input.keybinds))
		}
		if (!input.preventDefaultList.includes(e.code)) input.preventDefaultList.push(e.code)
		remappingAction = null
		renderSettings()
	}
}.bind(this))