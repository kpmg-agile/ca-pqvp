// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ADMIN_DIRECTIVES } from '../../directives';
import { ADMIN_PIPES } from '../../pipes';
import { ADMIN_COMPONENTS } from '../../routes';
import { ADMIN_PROVIDERS } from '../../providers';
import {SharedModule} from '../../../shared';
import {SHARED_IMPORTS} from '../../../shared/imports';

import Orders from './Orders';

describe('Orders', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ...ADMIN_DIRECTIVES, ...ADMIN_PIPES, ...ADMIN_COMPONENTS ],
            providers: ADMIN_PROVIDERS,
            imports: [ SharedModule, ...SHARED_IMPORTS, RouterTestingModule ]
        });
    });

    it('should be creatable', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(Orders);
            expect(fixture.componentInstance).toBeDefined();
            expect(fixture.debugElement.nativeElement.innerHTML).toBeTruthy();
        });
    }));

});
