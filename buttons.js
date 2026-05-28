const default_buttons = {
	currentChoose: upgrades,
	rerollButton() {
		return `<button class="reroll-button" style="
			width: 85%; max-width: 500px; padding: 12px; margin: 5px 0;
			"
			onclick='
			upgrades.rerolls--; 
			buttons.currentChoose.choose();
			'>Reroll (${Math.ceil(upgrades.rerolls - 0.5)} left)</button>`
	},
	cancelButton() {
		return `<button class="cancel-button" style="width: 85%; max-width: 500px; padding: 12px; margin: 5px 0;" onclick='simulation.isChoosing = false;'>Cancel</button>`
	},
}

const buttons = { ...default_buttons }