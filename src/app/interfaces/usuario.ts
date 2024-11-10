export interface UsuarioLog {
    email: string,
    password: string,
}

export interface UsuarioRegister {
    nombre: string,
    email: string,
    password: string,
}

export interface UsuarioAddAlum {
    nombre: string,
    segundo_nombre: string,
    apellido: string,
    segundo_apellido: string,
    correo: string,
    run: string
}

export interface Curso {
    seccion: string;
    sigla: string;
    nombre: string;
    correo: string; // Correo del profesor
    nombreProfesor: string;
    fechaCreacion: string;
}