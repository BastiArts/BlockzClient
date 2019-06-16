import {TestBed} from '@angular/core/testing';

import {DrawGameService} from './draw-game.service';

describe('DrawGameService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DrawGameService = TestBed.get(DrawGameService);
        expect(service).toBeTruthy();
    });
});
