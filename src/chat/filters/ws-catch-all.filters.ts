import { ArgumentsHost, BadRequestException, ExceptionFilter } from "@nestjs/common";
import { WsBadRequestException, WsUnknownException } from "../exceptions/ws-exceptions";

export class WsCatchAllFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost){
            const socket = host.switchToWs().getClient();

            if (exception instanceof BadRequestException) {
                const exceptionData = exception.getResponse();
                const WsException = new WsBadRequestException(
                    exceptionData['message'] ?? 'BadRequest',
                )
                socket.emit('exception', WsException.getError())
                return
            }

            const WsException = new WsUnknownException(exception.message)
            socket.emit('exception', WsException.getError())
        }
    
}