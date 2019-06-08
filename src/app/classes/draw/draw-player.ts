export class DrawPlayer {
    // ROLE: Drawer or Guesser
    constructor(public username: string, public game: string, public role: string = '', public sessionID: string = '') {
    }
}
