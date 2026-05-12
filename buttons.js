const default_buttons = {
	currentChoose: upgrades,
	rerollButton() {
		return `<button class="reroll-button" style="
			top: 60px;
			left: ${(parseFloat(chooseScreen.style.width) - 100) * 0.5 - 250}px; 
			width: ${(parseFloat(chooseScreen.style.width) / upgrades.optionsPerPowerUp) - 800}px; 
			" 
			onclick='
			upgrades.rerolls--; 
			buttons.currentChoose.choose();
			'>Reroll (${Math.ceil(upgrades.rerolls - 0.5)} left)</button>`
	},
	cancel: `<button class="cancel-button" style="
			top: 60px;
			left: ${(parseFloat(chooseScreen.style.width) - 100) * 0.5}px;
			width: ${(parseFloat(chooseScreen.style.width) - 100) * 0.5}px; 
			height: ${parseFloat(chooseScreen.style.height) / Math.floor(this.optionsPerPowerUp * 2.5)}px; 
			"
		onclick='simulation.isChoosing = false;'>Cancel</button>`,
}

const buttons = { ...default_buttons }