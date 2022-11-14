import { readdirSync } from "fs";
import { cwd } from "process";

export function getCommands(cmdFolder:string){
    const commands = [];
    
    const files = readdirSync(`${cwd()}/prod/commands/${cmdFolder}`).filter(file => file.endsWith(".js"));
    for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const command = require(`${cwd()}/prod/commands/${cmdFolder}/${file}`);
            commands.push(command.data.toJSON());
    }
    const fields:any = []
    commands.map((ob) => fields.push({
        name : ob.name,
        value : ob.description,
        inline: false  
    }))
    return fields
}