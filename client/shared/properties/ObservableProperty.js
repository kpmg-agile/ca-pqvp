import {EventEmitter, SimpleChange} from '@angular/core';

/**
* This decorator supplements a class property by automatically adding
* an observable to the class (name of the property + 'Observable')
* which is triggered whenever the property is changed.
*
* The observable is triggered with SimpleChange objects (from @angular/core)
* which provides both `currentValue` and `previousValue`.
*
* @param {function} setterBeforeEvent optional function to invoke in the setter of this property before the observable is triggered
* @param {function} setterAfterEvent optional function to invoke in the setter of this property after the observable is triggered
* @returns {function} function that decorates the target
*/

// class Foo {
//
// @ObservableProperty()
// name:string;
//
// }
//
// myFoo.nameObservable.subscribe( change => handler )

export default function ObservableProperty(setterBeforeEvent, setterAfterEvent) {
   return function (target, property, descriptor) {
       target = target.prototype || target;

       const propertySymbol = Symbol(property),
           observable = property + 'Observable',
           emitter = property + 'ChangedEmitter',
           emitterSymbol = Symbol(emitter),
           { configurable, enumerable, value, initializer } = descriptor;

       // 'private' property to access a lazily-instantiated event emitter
       Object.defineProperty(target, emitter, {
           enumerable: false,
           get: function () {
               if (!this[emitterSymbol]) {
                   this[emitterSymbol] = new EventEmitter();
               }
               return this[emitterSymbol];
           }
       });

       // 'public' property for the observable
       Object.defineProperty(target, observable, {
           enumerable: true,
           get: function () {
               return this[emitter].asObservable();
           }
       });

       // override the property we are decorating with a custom getter and setter
       return {
           configurable,
           enumerable,
           get: function() {
               // return the 'private' internally stored value or the default value
               let currentValue = this[propertySymbol];
               return typeof(currentValue) === 'undefined' ?
                   (initializer ? initializer.call(this) : value) :
                   currentValue;
           },
           set: function(value) {
               let change = new SimpleChange(this[propertySymbol], value);

               // update the internally stored value
               this[propertySymbol] = value;

               // invoke the 'before' callback if it was provided
               if (setterBeforeEvent) {
                   setterBeforeEvent.call(this, change);
               }

               // emit the event, triggering the observable
               this[emitter].emit(change);

               // invoke the 'after' callback if it was provided
               if (setterAfterEvent) {
                   setterAfterEvent.call(this, change);
               }
           }
       };
   };
}
