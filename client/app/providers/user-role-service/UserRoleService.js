// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

/**
 * @example
 * let injector = Injector.resolveAndCreate([UserRoleService]);
 * let userRoleService = new injector.get(UserRoleService);
 * @example
 * class Component {
 * 		constructor(userRoleService:UserRoleService, userRoleService2:UserRoleService) {
 *			//injected via angular, a singleton by default in same injector context
 *			console.log(userRoleService === userRoleService2);
 *		}
 * }
 */
@Injectable()
export default class UserRoleService {

    isUserAdmin:Boolean = false;

    constructor(router: Router) {
        router.events.subscribe((val) => {
            if (val.url.indexOf('admin') > -1) {
                this.isUserAdmin = true;
            } else {
                this.isUserAdmin = false;
            }
        });
    }
}
