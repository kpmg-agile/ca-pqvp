// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {SHARED_DIRECTIVES} from './directives';
import {SHARED_PIPES} from './pipes';
import {NgModule} from '@angular/core';
import {SHARED_IMPORTS} from './imports';

export * from './directives';
export * from './pipes';

@NgModule({
    imports: SHARED_IMPORTS,
    declarations: [
        SHARED_DIRECTIVES,
        SHARED_PIPES
    ],
    exports: [
        SHARED_DIRECTIVES,
        SHARED_PIPES
    ]
})
export class SharedModule {}
