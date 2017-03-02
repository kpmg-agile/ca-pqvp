// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

export const ADMIN_DIRECTIVES = [];

import Dashboard from './dashboard';
export {Dashboard as Dashboard};
ADMIN_DIRECTIVES.push(Dashboard);
import DashboardByContract from './dashboard-by-contract';
export {DashboardByContract as DashboardByContract};
ADMIN_DIRECTIVES.push(DashboardByContract);
import Contracts from './contracts';
export {Contracts as Contracts};
ADMIN_DIRECTIVES.push(Contracts);
import ContractDetails from './contract-details';
export {ContractDetails as ContractDetails};
ADMIN_DIRECTIVES.push(ContractDetails);
import CatalogItem from './catalog-item';
export {CatalogItem as CatalogItem};
ADMIN_DIRECTIVES.push(CatalogItem);
import Orders from './orders';
export {Orders as Orders};
ADMIN_DIRECTIVES.push(Orders);
import OrderItem from './order-item';
export {OrderItem as OrderItem};
ADMIN_DIRECTIVES.push(OrderItem);
