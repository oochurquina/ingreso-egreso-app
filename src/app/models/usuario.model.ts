export class Usuario {
    static fromFirebase({uid, nombre,correo}){
        return new Usuario(uid,nombre,correo)
    }
    constructor(
        public uid: string,
        public nombre: string,
        public correo: string

    ){}
}