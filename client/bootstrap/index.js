// Copyright (C) 2017 KPMG LLP, a Delaware limited liability partnership and the U.S. member firm of the KPMG network of independent member firms affiliated with KPMG International Cooperative (“KPMG International”), a Swiss entity. All rights reserved.

//why doesn't bootstrap do this?
import $ from 'jquery';
import Tether from 'tether';
window.jQuery = $;
window.Tether = Tether;

/**
 * This package is here to modify the base bootstrap
 * as needed for the application. You can pick and
 * choose which bootstrap components you want to
 * include (all by default) and override
 * the base style sheets as needed.
 */

require('!style!raw!sass!./index.scss');
require('../../node_modules/bootstrap/dist/js/bootstrap');
