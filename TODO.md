# TODO (Main menu particles)

- [ ] Modify `simulation.drawMenuBackground()` so menu particles only initialize when entering main menu (lazy init / one-time spawn).
- [ ] Ensure `menuParticles` are reset when leaving/entering main menu to prevent allocation during gameplay.
- [ ] Sanity-check there are no other calls that mutate/initialize `menuParticles` outside main menu.

