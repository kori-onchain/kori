import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {

    constructor(context?: string) {
        super(context || '');
    }

    private format(level: string, message: any, methodContext?: string) {
        const activeContext = methodContext || this.context || '';

        const now = new Date();
        const date = now.toLocaleDateString('pt-BR');
        const time = now.toLocaleTimeString('pt-BR', { hour12: false });

        const colors: Record<string, string> = {
            LOG: '\x1b[32m',    // Verde
            ERROR: '\x1b[31m',  // Vermelho
            WARN: '\x1b[33m',   // Amarelo
            DEBUG: '\x1b[34m',  // Azul
        };

        const color = colors[level] || '\x1b[0m';
        const gray = '\x1b[90m';
        const reset = '\x1b[0m';

        // Formatação do contexto: Amarelo se existir
        const ctxDisplay = activeContext ? `\x1b[33m[${activeContext}]\x1b[0m ` : '';

        process.stdout.write(
            `${color}(${level})${reset} | ${gray}[${date} ${time}]${reset} | ${ctxDisplay}${color}${message}${reset}\n`,
        );
    }

    override log(message: any, context?: string) {
        const internalContexts = [
            'RouterExplorer', 'RoutesResolver', 'InstanceLoader',
            'NestApplication', 'NestFactory',
        ];

        if (internalContexts.includes(context || '')) return;
        this.format('LOG', message, context);
    }

    override error(message: any, stack?: string, context?: string) {
        this.format('ERROR', message, context || this.context);
        if (stack) process.stdout.write(`\x1b[90m${stack}\x1b[0m\n`);
    }

    override warn(message: any, context?: string) {
        this.format('WARN', message, context);
    }

    override debug(message: any, context?: string) {
        this.format('DEBUG', message, context);
    }
}