export interface UsuarioLog{
    username:string,
    password:string,
   
}

export interface UsuarioRegister{
    nombre:string,
    apellido:string,
    correo:string,
    password:string,
    run:string
}

export interface UsuarioAddAlum {
    nombre:string,
    segundo_nombre:string,
    apellido:string,
    segundo_apellido:string,
    correo:string,
    run:string
}