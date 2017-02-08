import {{leftBrace}}{{snakeCase answers.name}}_DIRECTIVES{{rightBrace}} from './directives';
import {{leftBrace}}{{snakeCase answers.name}}_PROVIDERS{{rightBrace}} from './providers';
import {{leftBrace}}{{snakeCase answers.name}}_PIPES{{rightBrace}} from './pipes';
import {{leftBrace}}{{snakeCase answers.name}}_ROUTES, {{snakeCase answers.name}}_COMPONENTS{{rightBrace}} from './routes';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

export * from './directives';
export * from './providers';
export * from './pipes';
export * from './routes';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        RouterModule.forRoot({{snakeCase answers.name}}_ROUTES)
    ],
    providers: {{snakeCase answers.name}}_PROVIDERS,
    declarations: [
        ...{{snakeCase answers.name}}_DIRECTIVES,
        ...{{snakeCase answers.name}}_PIPES,
        ...{{snakeCase answers.name}}_COMPONENTS
    ],
    exports: [
        ...{{snakeCase answers.name}}_DIRECTIVES,
        ...{{snakeCase answers.name}}_PIPES
    ]
})
export class {{pascelCase answers.name}}Module {}
