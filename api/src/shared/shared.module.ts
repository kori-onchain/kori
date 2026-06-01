import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpProvider } from './providers/http.provider';
import { CustomLogger } from './providers/my-logger.provider';

@Global()
@Module({
    imports: [HttpModule],
    providers: [CustomLogger, HttpProvider],
    exports: [HttpModule, HttpProvider, CustomLogger],
})

export class SharedModule { }