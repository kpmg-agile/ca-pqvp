import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SHARED_DIRECTIVES } from '../../directives';
import { SHARED_PIPES } from '../../pipes';
import { SHARED_COMPONENTS } from '../../routes';
import { SHARED_PROVIDERS } from '../../providers';
import SHARED_IMPORTS from '../../imports';

import CartCounter from './CartCounter';

describe('CartCounter', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ...SHARED_DIRECTIVES, ...SHARED_PIPES, ...SHARED_COMPONENTS ],
            providers: SHARED_PROVIDERS,
            imports: [ ...SHARED_IMPORTS, RouterTestingModule ]
        });
    });

    it('should be creatable', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(CartCounter);
            expect(fixture.componentInstance).toBeDefined();
            expect(fixture.debugElement.nativeElement.innerHTML).toBeTruthy();
        });
    }));

    it('should initialize default name to heading', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(CartCounter);
            fixture.detectChanges();
            expect(fixture.debugElement.nativeElement.querySelector('h1').innerText).toBe('CartCounter');
        });
    }));

    it('should initialize custom name to heading', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(CartCounter);
            fixture.componentInstance.name = 'TEST';
            fixture.detectChanges();
            expect(fixture.debugElement.nativeElement.querySelector('h1').innerText).toBe('TEST');
        });
    }));

});
