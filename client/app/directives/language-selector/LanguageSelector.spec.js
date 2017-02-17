import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {APP_DIRECTIVES} from '../../directives';
import {APP_PIPES} from '../../pipes';
import {APP_COMPONENTS} from '../../routes';
import {APP_PROVIDERS} from '../../providers';
import APP_IMPORTS from '../../imports';

import LanguageSelector from './LanguageSelector';

describe('LanguageSelector', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ...APP_DIRECTIVES, ...APP_PIPES, ...APP_COMPONENTS ],
            providers: APP_PROVIDERS,
            imports: [ ...APP_IMPORTS, RouterTestingModule ]
        });
    });

    it('should be creatable', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(LanguageSelector);
            expect(fixture.componentInstance).toBeDefined();
            expect(fixture.debugElement.nativeElement.innerHTML).toBeTruthy();
        });
    }));


    // it('should return component name', inject([LanguageSelector], (languageSelector:LanguageSelector) => {
    //     expect(languageSelector.name).toBe('LanguageSelector');
    // }));

    // it('should initialize default name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    //     return tcb
    //         .overrideTemplate(TestComponent, '<language-selector></language-selector>')
    //         .createAsync(TestComponent)
    //         .then((fixture:ComponentFixture) => {
    //             fixture.detectChanges();
    //             expect(fixture.nativeElement.querySelector('language-selector h1').innerText).toBe('LanguageSelector');
    //         });
    // })));

    // it('should initialize custom name to heading', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    //     return tcb
    //         .overrideTemplate(TestComponent, '<language-selector name="TEST"></language-selector>')
    //         .createAsync(TestComponent)
    //         .then((fixture:ComponentFixture) => {
    //             fixture.detectChanges();
    //             expect(fixture.nativeElement.querySelector('language-selector h1').innerText).toBe('TEST');
    //         });
    // })));

});
