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

export interface cursoEscaneado {
    alumnoId: string;
    cursoId: string;
    cursoNombre: string;
    cursoProfesor: string;
    cursosigla: string;
    cursoSeccion: string;
    fechaScan: string;
  }
  
  export interface AlumnoData {
    alumnoId: string;
    fechaScan: string;  // Puedes cambiar el tipo según lo que necesites
    horaScan: string;   // Puede ser un string con formato de hora o un timestamp
  }
  