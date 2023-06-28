import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SearchDto {    
    @IsString()
    @ApiProperty({ description: 'The term (username or name) to search' })
    searchTerm: string;

}
