import {App, APP_DIRECTIVES} from './directives';
import {APP_PROVIDERS} from './providers';
import {APP_ROUTES} from './routes';
import {APP_PIPES} from './pipes';
import APP_IMPORTS from './imports';
import {NgModule} from '@angular/core';

@NgModule({
    imports: APP_IMPORTS,
    providers: APP_PROVIDERS,
    declarations: [
        ...APP_DIRECTIVES,
        ...APP_PIPES,
        ...APP_ROUTES.map(r => r.component).filter(c => !!c)
    ],
    bootstrap: [App]
})
export default class AppModule {}
