import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {SHARED_DIRECTIVES} from '../../directives';
import {SHARED_PIPES} from '../../pipes';
import {SHARED_IMPORTS} from '../../../shared/imports';

import ContentHeader from './ContentHeader';

describe('ContentHeader', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ...SHARED_DIRECTIVES, ...SHARED_PIPES ],
            imports: [ ...SHARED_IMPORTS, RouterTestingModule ]
        });
    });

    it('should be creatable', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(ContentHeader);
            expect(fixture.componentInstance).toBeDefined();
            expect(fixture.debugElement.nativeElement.innerHTML).toBeTruthy();
        });
    }));

});
