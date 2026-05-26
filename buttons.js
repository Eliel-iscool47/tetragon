const default_buttons = {
	currentChoose: upgrades,
	rerollButton() {
		return `<button class="reroll-button" style="
			top: 2vh;
			left: 10%;
			width: 35%;
			" 
			onclick='
			upgrades.rerolls--; 
			buttons.currentChoose.choose();
			'>Reroll (${Math.ceil(upgrades.rerolls - 0.5)} left)</button>`
	},
	cancelButton() {
		return `<button class="cancel-button" style="
				top: 2vh;
				right: 10%;
				width: 35%;
				left: auto;
				"
			onclick='simulation.isChoosing = false;'>Cancel</button>`
	},
}

const buttons = { ...default_buttons }