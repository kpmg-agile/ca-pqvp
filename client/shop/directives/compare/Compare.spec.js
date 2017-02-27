import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {SHOP_DIRECTIVES} from '../../directives';
import {SHOP_PIPES} from '../../pipes';
import {SHOP_COMPONENTS} from '../../routes';
import {SHOP_PROVIDERS} from '../../providers';
import {SharedModule} from '../../../shared';
import {SHARED_IMPORTS} from '../../../shared/imports';

import Compare from './Compare';

describe('Compare', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ...SHOP_DIRECTIVES, ...SHOP_PIPES, ...SHOP_COMPONENTS ],
            providers: SHOP_PROVIDERS,
            imports: [ SharedModule, ...SHARED_IMPORTS, RouterTestingModule ]
        });
    });

    it('should be creatable', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(Compare);
            expect(fixture.componentInstance).toBeDefined();
            expect(fixture.debugElement.nativeElement.innerHTML).toBeTruthy();
        });
    }));

});
