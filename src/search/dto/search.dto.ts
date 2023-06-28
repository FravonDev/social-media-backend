import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SearchDto {    
    @IsString()
    @ApiProperty({ description: 'The username of user search' })
    username: string;

}
