import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { {{upperCase answers.moduleName}}_DIRECTIVES } from '../../directives';
import { {{upperCase answers.moduleName}}_PIPES } from '../../pipes';
import { {{upperCase answers.moduleName}}_COMPONENTS } from '../../routes';
import { {{upperCase answers.moduleName}}_PROVIDERS } from '../../providers';
import {SharedModule} from '../../../shared';
import {SHARED_IMPORTS} from '../../../shared/imports';

import {{answers.name}} from './{{answers.name}}';

describe('{{answers.name}}', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ...{{upperCase answers.moduleName}}_DIRECTIVES, ...{{upperCase answers.moduleName}}_PIPES, ...{{upperCase answers.moduleName}}_COMPONENTS ],
            providers: {{upperCase answers.moduleName}}_PROVIDERS,
            imports: [ SharedModule, ...SHARED_IMPORTS, RouterTestingModule ]
        });
    });

    it('should be creatable', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent({{answers.name}});
            expect(fixture.componentInstance).toBeDefined();
            expect(fixture.debugElement.nativeElement.innerHTML).toBeTruthy();
        });
    }));

    it('should initialize default name to heading', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent({{answers.name}});
            fixture.detectChanges();
            expect(fixture.debugElement.nativeElement.querySelector('h1').innerText).toBe('{{answers.name}}');
        });
    }));

    it('should initialize custom name to heading', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent({{answers.name}});
            fixture.componentInstance.name = 'TEST';
            fixture.detectChanges();
            expect(fixture.debugElement.nativeElement.querySelector('h1').innerText).toBe('TEST');
        });
    }));

});
