import {provideRoutes} from '@angular/router';
import {{leftBrace}}{{snakeCase answers.name}}_ROUTES{{rightBrace}} from '../routes';
export const {{snakeCase answers.name}}_PROVIDERS = [
    provideRoutes({{snakeCase answers.name}}_ROUTES)
];
