import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ADMIN_DIRECTIVES } from '../../directives';
import { ADMIN_PIPES } from '../../pipes';
import { ADMIN_COMPONENTS } from '../../routes';
import { ADMIN_PROVIDERS } from '../../providers';
import {SharedModule} from '../../../shared';
import {SHARED_IMPORTS} from '../../../shared/imports';

import Admin from './Admin';

describe('Admin', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ...ADMIN_DIRECTIVES, ...ADMIN_PIPES, ...ADMIN_COMPONENTS ],
            providers: ADMIN_PROVIDERS,
            imports: [ SharedModule, ...SHARED_IMPORTS, RouterTestingModule ]
        });
    });

    it('should be creatable', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(Admin);
            expect(fixture.componentInstance).toBeDefined();
            expect(fixture.debugElement.nativeElement.innerHTML).toBeTruthy();
        });
    }));

});
