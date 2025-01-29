export interface UserCreateDto{
    username: string;
    user_lastname: string;
    birth: Date;
    pfk_eca_genders_id: number;
    email: string;
    user_password: string;
    pfk_eca_companies_id: number;
    cpf: string;
    pix?: string | null;
    telephone?: string | null;
    cnh?: string | null;
    profile_photo: Buffer | null;
}