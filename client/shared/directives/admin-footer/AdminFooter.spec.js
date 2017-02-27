import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SHARED_DIRECTIVES } from '../../directives';
import { SHARED_PIPES } from '../../pipes';
import {SHARED_IMPORTS} from '../../../shared/imports';

import AdminFooter from './AdminFooter';

describe('AdminFooter', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ...SHARED_DIRECTIVES, ...SHARED_PIPES, ...SHARED_COMPONENTS ],
            providers: SHARED_PROVIDERS,
            imports: [ SharedModule, ...SHARED_IMPORTS, RouterTestingModule ]
        });
    });

    it('should be creatable', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(AdminFooter);
            expect(fixture.componentInstance).toBeDefined();
            expect(fixture.debugElement.nativeElement.innerHTML).toBeTruthy();
        });
    }));

});
