import * as bcrypt from 'bcrypt';

export default class BCryptHelper {
    salts: number

    constructor() { this.salts = 10; }

    async hash(password: string) : Promise<string>{
        return await bcrypt.hash(password, this.salts) 
    }

    async compare(plainPassword, hashPassword): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashPassword);
    }
}