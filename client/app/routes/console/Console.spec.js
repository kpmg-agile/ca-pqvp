import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_DIRECTIVES } from '../../directives';
import { APP_PIPES } from '../../pipes';
import { APP_COMPONENTS } from '../../routes';
import { APP_PROVIDERS } from '../../providers';
import APP_IMPORTS from '../../imports';

import Console from './Console';

describe('Console', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ...APP_DIRECTIVES, ...APP_PIPES, ...APP_COMPONENTS ],
            providers: APP_PROVIDERS,
            imports: [ ...APP_IMPORTS, RouterTestingModule ]
        });
    });

    it('should be creatable', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(Console);
            expect(fixture.componentInstance).toBeDefined();
            expect(fixture.debugElement.nativeElement.innerHTML).toBeTruthy();
        });
    }));

    it('should initialize default name to heading', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(Console);
            fixture.detectChanges();
            expect(fixture.debugElement.nativeElement.querySelector('h1').innerText).toBe('Console');
        });
    }));

    it('should initialize custom name to heading', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(Console);
            fixture.componentInstance.name = 'TEST';
            fixture.detectChanges();
            expect(fixture.debugElement.nativeElement.querySelector('h1').innerText).toBe('TEST');
        });
    }));

});