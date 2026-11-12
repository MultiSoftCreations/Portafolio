import os
from core.protection import clasificar_ruta
from core.trash import mover_a_papelera


def limpiar_duplicados(duplicados: dict, callback=None, dry_run: bool = True,
                       incluir_especiales: bool = False):
    eliminados = []
    protegidos = []
    especiales = []
    errores = []

    if not duplicados:
        if callback:
            callback("No hay duplicados para procesar.")
        return eliminados

    for hash_id, archivos in duplicados.items():
        archivos_existentes = [p for p in archivos if os.path.isfile(p)]
        if len(archivos_existentes) < 2:
            continue

        try:
            archivos_existentes.sort(key=lambda x: os.path.getmtime(x), reverse=True)
        except OSError:
            continue

        conservar = archivos_existentes[0]
        borrar = archivos_existentes[1:]

        if callback:
            callback(f"Conservar: {conservar}")

        for path in borrar:
            try:
                clase = clasificar_ruta(path)

                if clase == "PROTEGIDA":
                    protegidos.append(path)
                    if callback:
                        callback(f"PROTEGIDO: {path}")
                    continue

                if clase == "ESPECIAL" and not incluir_especiales:
                    especiales.append(path)
                    if callback:
                        callback(f"ESPECIAL (omitido): {path}")
                    continue

                if dry_run:
                    if callback:
                        callback(f"[DRY-RUN] → papelera: {path}")
                    eliminados.append(path)
                else:
                    mover_a_papelera(path)
                    eliminados.append(path)
                    if callback:
                        callback(f"→ PAPELERA: {path}")

            except Exception as e:
                errores.append((path, str(e)))
                if callback:
                    callback(f"ERROR: {path} | {e}")

    if callback:
        callback("")
        callback("========== RESUMEN ==========")
        callback(f"  {'Simulados' if dry_run else 'A papelera'}: {len(eliminados)}")
        callback(f"  Especiales: {len(especiales)}")
        callback(f"  Protegidos: {len(protegidos)}")
        callback(f"  Errores: {len(errores)}")
        callback("==============================")

    return eliminados


def eliminar_rutas(rutas: list, callback=None, dry_run: bool = True,
                   incluir_especiales: bool = False):
    eliminados, especiales, protegidos, errores = [], [], [], []

    for path in rutas:
        try:
            clase = clasificar_ruta(path)

            if clase == "PROTEGIDA":
                protegidos.append(path)
                if callback:
                    callback(f"PROTEGIDO: {path}")
                continue

            if clase == "ESPECIAL" and not incluir_especiales:
                especiales.append(path)
                if callback:
                    callback(f"ESPECIAL (omitido): {path}")
                continue

            if dry_run:
                if callback:
                    callback(f"[DRY-RUN] → papelera: {path}")
                eliminados.append(path)
            else:
                mover_a_papelera(path)
                eliminados.append(path)
                if callback:
                    callback(f"→ PAPELERA: {path}")

        except Exception as e:
            errores.append((path, str(e)))
            if callback:
                callback(f"ERROR: {path} | {e}")

    if callback:
        callback("")
        callback(f"Resumen → Papelera: {len(eliminados)} | Especiales: {len(especiales)} | "
                 f"Protegidos: {len(protegidos)} | Errores: {len(errores)}")

    return eliminados