// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SHOP_DIRECTIVES } from '../../directives';
import { SHOP_PIPES } from '../../pipes';
import { SHOP_COMPONENTS } from '../../routes';
import { SHOP_PROVIDERS } from '../../providers';
import {SharedModule} from '../../../shared';
import {SHARED_IMPORTS} from '../../../shared/imports';

import ProductHighlight from './ProductHighlight';

describe('ProductHighlight', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ...SHOP_DIRECTIVES, ...SHOP_PIPES, ...SHOP_COMPONENTS ],
            providers: SHOP_PROVIDERS,
            imports: [ SharedModule, ...SHARED_IMPORTS, RouterTestingModule ]
        });
    });

    it('should be creatable', async(() => {
        TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(ProductHighlight);
            expect(fixture.componentInstance).toBeDefined();
            expect(fixture.debugElement.nativeElement.innerHTML).toBeTruthy();
        });
    }));
});
