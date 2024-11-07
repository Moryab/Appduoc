import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AlmacenamientoService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Guarda cualquier dato en el almacenamiento usando una clave
  public guardar(key: string, value: any) {
    this._storage?.set(key, value);
  }

  // Guarda los datos completos del usuario al registrarse o iniciar sesión
  public async guardarUsuario(usuario: any) {
    await this._storage?.set('usuario', usuario);
  }

  // Lee los datos completos del usuario desde el almacenamiento
  public async obtenerUsuario() {
    return await this._storage?.get('usuario');
  }

  // Verifica si hay datos del usuario guardados en el almacenamiento
  public async existeUsuario(): Promise<boolean> {
    const usuario = await this._storage?.get('usuario');
    return !!usuario; // Retorna true si el usuario existe, de lo contrario false
  }

  // Elimina los datos del usuario del almacenamiento (por ejemplo, al cerrar sesión)
  public async removerUsuario() {
    await this._storage?.remove('usuario');
  }

  // Método general para leer cualquier clave
  public async leer(key: string) {
    return await this._storage?.get(key);
  }

  // Método general para remover cualquier clave
  public async remover(key: string) {
    await this._storage?.remove(key);
  }
}
