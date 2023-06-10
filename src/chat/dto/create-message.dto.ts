import { IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateMessageDto {
    @IsString()
    recipientId: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(4096)
    text: string;
}