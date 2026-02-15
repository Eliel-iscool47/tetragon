//container && canvas && 2d rendering context

const dc = document.getElementById('container')
const main = document.getElementById('screen')
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

//HTML element objects

const start = document.getElementById('start')
const controls = document.getElementById('controls')
const controlDoc = document.getElementById('control-doc')
const settings = document.getElementById('settings')
const credits = document.getElementById('credits')
const pauseScreen = document.getElementById('pause-screen')
const pauseText = pauseScreen.querySelector('h1')

//styling

const pauseSubtext = pauseScreen.querySelector('p')
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
dc.appendChild(credits)
dc.appendChild(controlDoc)

//start button

start.style.position = 'absolute'
start.style.top = `${main.height * 0.3}px`
start.style.left = `${main.width * 0.4}px`
start.style.width = `${main.width * 0.2}px`
start.style.height = `${main.height * 0.2}px`
start.style.fontSize = `${main.width * 0.03}px`

//controls

start.style.cursor = 'pointer'
controls.style.position = 'absolute'
controls.style.top = `${main.height * 0.1}px`
controls.style.left = `${main.width * 0.15}px`
controls.style.width = `${main.width * 0.2}px`
controls.style.height = `${main.height * 0.1}px`
controls.style.fontSize = `${main.width * 0.03}px`
controls.style.cursor = 'pointer'
controlDoc.style.position = 'absolute'
controlDoc.style.top = `${main.height * 0.2}px`
controlDoc.style.left = `${main.width * 0.15}px`
controlDoc.style.width = `${main.width * 0.2}px`
controlDoc.style.height = `${main.height * 0.2}px`
controlDoc.style.fontSize = `${main.width * 0.02}px`
controlDoc.style.overflowY = 'scroll'
controlDoc.innerHTML = `
        <p>Controls</p>
        <p>W, A, S, D/Arrow Keys: Move</p>
        <p>Left Click, F: Shoot</p>
        <p>Mouse move: Aim</p>
        <p>R: Respawn / start game</p>
        <p>V: Reload</p>
        <p>G: All Guns</p>
        <p>M: Main Menu</p>
        <p>Tab: Controls</p>
        <p>Escape / P: Pause</p>
        <p>Q, E: Switch gun</p>
`

//settings button

settings.style.position = 'absolute'
settings.style.top = `${main.height * 0.2}px`
settings.style.left = `${main.width * 0.65}px`
settings.style.width = `${main.width * 0.2}px`
settings.style.height = `${main.height * 0.2}px`
settings.style.fontSize = `${main.width * 0.03}px`
settings.style.cursor = 'pointer'

//credits button

credits.style.position = 'absolute'
credits.style.top = `${main.height * 0.1}px`
credits.style.left = `${main.width * 0.425}px`
credits.style.width = `${main.width * 0.15}px`
credits.style.height = `${main.height * 0.1}px`
credits.style.fontSize = `${main.width * 0.03}px`
credits.style.cursor = 'pointer'

//button logic

start.onclick = () => {
    main.style.display = 'block'
    simulation.isMainMenu = false
    simulation.gameLoop()
}
controls.onclick = () => {
    controlDoc.style.display = controlDoc.style.display === 'block' ? 'none' : 'block'
}
settings.onclick = () => {
    console.log('soon...')
}
credits.onclick = () => {
    console.log('soon...')
}
start.style.display = 'block'
controls.style.display = 'block'
settings.style.display = 'block'
credits.style.display = 'block'
main.style.display = 'none'