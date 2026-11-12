import os
import threading
import tkinter as tk
from tkinter import messagebox, filedialog, simpledialog

from ui import styles
from utils.helpers import formatear_tamano, ruta_valida, timestamp, notificar
from utils.keepawake import keep
from core.disk import obtener_espacio
from core.analyzer import analisis_rapido, analisis_completo, detectar_apps_inactivas
from core.duplicates import buscar_duplicados
from core.extras import buscar_archivos_grandes, buscar_carpetas_vacias
from core.storage import (
    guardar_analisis, cargar_analisis, eliminar_analisis,
    agregar_historial, cargar_historial
)
from core.cleaner import limpiar_duplicados, eliminar_rutas
from core.protection import clasificar_ruta
from core.config import cargar_config, guardar_config, es_pro, limites
from core.usage_report import (
    registrar_sistema,
    registrar_evento,
    registrar_error,
    generar_informe_txt,
    ruta_json,
)


estado = {
    "cancelar": False,
    "ruta_actual": os.path.expanduser("~"),
    "ultimo_resultado": {"tipo": None, "datos": None},
    "duplicados": None,
    "archivos_grandes": None,
    "carpetas_vacias": None,
}


def iniciar_app():
    root = tk.Tk()
    root.title("MultiSoftCleaner")
    root.geometry("1100x650")
    root.configure(bg=styles.BG_COLOR)
    root.minsize(900, 550)

    # Config + informe de uso
    cfg = cargar_config()
    if cfg.get("ultima_ruta") and ruta_valida(cfg["ultima_ruta"]):
        estado["ruta_actual"] = cfg["ultima_ruta"]

    try:
        info0 = obtener_espacio(estado["ruta_actual"])
        cfg["espacio_antes"] = info0["libre"]
        guardar_config(cfg)
    except Exception:
        pass

    try:
        registrar_sistema()
        registrar_evento("inicio_app", f"ruta={estado['ruta_actual']}")
    except Exception:
        pass

    # =========================
    # SIDEBAR
    # =========================
    sidebar = tk.Frame(root, bg=styles.PANEL_COLOR, width=210)
    sidebar.pack(side="left", fill="y")
    sidebar.pack_propagate(False)

    tk.Label(
        sidebar, text="MSC", bg=styles.PANEL_COLOR, fg=styles.NEON_BLUE,
        font=("Consolas", 20, "bold")
    ).pack(pady=(20, 5))

    tk.Label(
        sidebar, text="MultiSoftCleaner", bg=styles.PANEL_COLOR,
        fg=styles.TEXT_DIM, font=("Consolas", 9)
    ).pack(pady=(0, 4))

    plan = "PRO" if es_pro() else "FREE"
    color_plan = styles.NEON_GREEN if es_pro() else styles.NEON_YELLOW
    tk.Label(
        sidebar, text=f"● {plan}", bg=styles.PANEL_COLOR,
        fg=color_plan, font=("Consolas", 9, "bold")
    ).pack(pady=(0, 12))

    # =========================
    # MAIN AREA
    # =========================
    main_area = tk.Frame(root, bg=styles.BG_COLOR)
    main_area.pack(side="right", expand=True, fill="both")

    header = tk.Frame(main_area, bg=styles.BG_COLOR)
    header.pack(fill="x", padx=20, pady=(15, 5))

    titulo = tk.Label(
        header, text="Panel de control", bg=styles.BG_COLOR,
        fg=styles.NEON_BLUE, font=("Consolas", 16, "bold")
    )
    titulo.pack(side="left")

    ruta_label = tk.Label(
        header, text=f"📁 {estado['ruta_actual']}", bg=styles.BG_COLOR,
        fg=styles.TEXT_DIM, font=("Consolas", 9)
    )
    ruta_label.pack(side="right")

    # Tarjetas
    cards_frame = tk.Frame(main_area, bg=styles.BG_COLOR)
    cards_frame.pack(fill="x", padx=20, pady=8)

    def crear_card(parent, titulo_card, valor):
        frame = tk.Frame(parent, bg=styles.CARD_COLOR, padx=12, pady=10)
        frame.pack(side="left", padx=6, expand=True, fill="x")
        tk.Label(
            frame, text=titulo_card, bg=styles.CARD_COLOR,
            fg=styles.TEXT_DIM, font=("Consolas", 9)
        ).pack(anchor="w")
        lbl = tk.Label(
            frame, text=valor, bg=styles.CARD_COLOR,
            fg=styles.NEON_BLUE, font=("Consolas", 14, "bold")
        )
        lbl.pack(anchor="w")
        return lbl

    card_total = crear_card(cards_frame, "TOTAL", "—")
    card_usado = crear_card(cards_frame, "USADO", "—")
    card_libre = crear_card(cards_frame, "LIBRE", "—")

    def actualizar_tarjetas(ruta=None):
        ruta = ruta or estado["ruta_actual"]
        try:
            info = obtener_espacio(ruta)
            card_total.config(text=formatear_tamano(info["total"]))
            card_usado.config(text=formatear_tamano(info["usado"]))
            card_libre.config(text=formatear_tamano(info["libre"]))
        except Exception:
            card_total.config(text="—")
            card_usado.config(text="—")
            card_libre.config(text="—")

    actualizar_tarjetas()

    # Consola
    consola_frame = tk.Frame(main_area, bg=styles.BG_COLOR)
    consola_frame.pack(fill="both", expand=True, padx=20, pady=(5, 15))

    consola = tk.Text(
        consola_frame, bg=styles.CONSOLE_BG, fg=styles.NEON_BLUE,
        font=("Consolas", 10), relief="flat", wrap="word",
        insertbackground=styles.NEON_BLUE
    )
    consola.pack(side="left", fill="both", expand=True)

    scroll = tk.Scrollbar(consola_frame, command=consola.yview)
    scroll.pack(side="right", fill="y")
    consola.config(yscrollcommand=scroll.set)
    consola.insert("end", ">> Sistema listo.\n")

    # =========================
    # UTILIDADES UI
    # =========================
    def log(msg):
        consola.insert("end", msg + "\n")
        consola.see("end")

    def limpiar_consola():
        consola.delete("1.0", tk.END)
        consola.insert("end", "=== MultiSoftCleaner ===\n\n")

    def cerrar_app():
        estado["cancelar"] = True
        try:
            registrar_evento("cierre_app", "")
        except Exception:
            pass
        keep.desactivar()
        root.destroy()

    root.protocol("WM_DELETE_WINDOW", cerrar_app)

    def on_escape(event):
        estado["cancelar"] = True
        log(">> Cancelación solicitada (Esc)")
        try:
            registrar_evento("cancelacion", "tecla_Esc")
        except Exception:
            pass

    root.bind("<Escape>", on_escape)

    def mostrar_carga_progreso():
        ventana = tk.Toplevel(root)
        ventana.title("Procesando...")
        ventana.geometry("380x180")
        ventana.configure(bg=styles.CONSOLE_BG)
        ventana.transient(root)
        ventana.grab_set()

        tk.Label(
            ventana, text="MultiSoftCleaner", fg=styles.NEON_BLUE,
            bg=styles.CONSOLE_BG, font=("Consolas", 12, "bold")
        ).pack(pady=(14, 4))

        animacion_label = tk.Label(
            ventana, text="", fg=styles.NEON_BLUE,
            bg=styles.CONSOLE_BG, font=("Consolas", 15)
        )
        animacion_label.pack(pady=4)

        progreso_label = tk.Label(
            ventana, text="0%  (0 archivos)", fg=styles.NEON_GREEN,
            bg=styles.CONSOLE_BG, font=("Consolas", 11)
        )
        progreso_label.pack(pady=4)

        frames = [
            "ᗧ • • • • • • •", " ᗧ• • • • • • •", "  ᗧ • • • • • •",
            "   ᗧ• • • • • •", "    ᗧ • • • • •", "     ᗧ• • • • •",
            "      ᗧ • • • •", "       ᗧ• • • •", "        ᗧ • • •",
            "         ᗧ• • •", "          ᗧ • •", "           ᗧ• •",
            "            ᗧ •", "             ᗧ•", "              ᗧ",
            "             ᗧ•", "            ᗧ •", "           ᗧ• •",
            "          ᗧ • •", "         ᗧ• • •", "        ᗧ • • •",
            "       ᗧ• • • •", "      ᗧ • • • •", "     ᗧ• • • • •",
            "    ᗧ • • • • •", "   ᗧ• • • • • •", "  ᗧ • • • • • •",
            " ᗧ• • • • • • •",
        ]

        def animar(i=0):
            if not ventana.winfo_exists():
                return
            animacion_label.config(text=frames[i % len(frames)])
            ventana.after(90, animar, i + 1)

        animar()

        def cancelar_proceso():
            estado["cancelar"] = True
            log(">> Cancelando proceso...")
            try:
                registrar_evento("cancelacion", "boton_cancelar")
            except Exception:
                pass

        tk.Button(
            ventana, text="Cancelar", bg=styles.BTN_COLOR, fg=styles.NEON_RED,
            activebackground=styles.NEON_RED, activeforeground="#000",
            relief="flat", font=("Consolas", 10), command=cancelar_proceso
        ).pack(pady=10)

        return ventana, progreso_label

    def resumen_liberable(lista):
        if not lista:
            return
        total = 0
        if isinstance(lista, dict):
            for archivos in lista.values():
                try:
                    existentes = [p for p in archivos if os.path.isfile(p)]
                    existentes.sort(key=lambda x: os.path.getmtime(x), reverse=True)
                    for p in existentes[1:]:
                        if clasificar_ruta(p) == "SEGURA":
                            total += os.path.getsize(p)
                except OSError:
                    pass
        else:
            total = sum(
                r.get("tamano", 0) for r in lista
                if r.get("seguridad") == "SEGURA"
            )
        log(f"\n💡 Espacio liberable (seguro): {formatear_tamano(total)}")

    def mostrar_resultados(lista, titulo_seccion="Resultados"):
        if not lista:
            log("No se encontraron resultados.")
            return

        seguras = [x for x in lista if x.get("seguridad") == "SEGURA"]
        especiales = [x for x in lista if x.get("seguridad") == "ESPECIAL"]
        otras = [x for x in lista if x.get("seguridad") not in ("SEGURA", "ESPECIAL")]

        def imprimir_grupo(nombre, items):
            if not items:
                return
            log(f"\n=== {nombre} ({len(items)}) ===\n")
            for r in items[:40]:
                tam = formatear_tamano(r.get("tamano", 0))
                extra = ""
                if "archivos" in r:
                    extra = f" | {r['archivos']} archivos"
                elif "dias_sin_usar" in r:
                    extra = f" | {r['dias_sin_usar']} días"
                marca = "  ⚠ ESPECIAL" if r.get("seguridad") == "ESPECIAL" else ""
                log(f"  {tam}{extra}  →  {r['ruta']}{marca}")
            if len(items) > 40:
                log(f"  ... y {len(items) - 40} más.")

        imprimir_grupo("SEGURAS", seguras)
        imprimir_grupo("ESPECIALES (revisar con cuidado)", especiales)
        if otras:
            imprimir_grupo("OTRAS", otras)

        resumen_liberable(lista)

    # =========================
    # HILOS
    # =========================
    def _callback_progreso(progreso_label, msg):
        if msg.startswith("CANCELADO|"):
            archivos = msg.split("|")[1]
            root.after(0, lambda: log(f"\n>> Cancelado. Archivos leídos: {archivos}"))
            try:
                registrar_evento("cancelacion", f"archivos_leidos={archivos}")
            except Exception:
                pass
        elif msg.startswith("PROGRESO|"):
            partes = msg.split("|")
            archivos = partes[1]
            porcentaje = partes[2] if len(partes) > 2 else "0"
            root.after(0, lambda: progreso_label.config(
                text=f"{porcentaje}%  ({archivos} archivos)"
            ))
        elif msg.startswith(">>"):
            root.after(0, lambda m=msg: log(m))

    def analisis_rapido_thread(progreso_label, ventana):
        cancelado = False
        try:
            def cb(msg):
                nonlocal cancelado
                if msg.startswith("CANCELADO|"):
                    cancelado = True
                _callback_progreso(progreso_label, msg)

            resultados = analisis_rapido(
                estado["ruta_actual"], callback=cb,
                cancel_flag=lambda: estado["cancelar"]
            )
            estado["ultimo_resultado"] = {"tipo": "rapido", "datos": resultados}
            if not cancelado:
                guardar_analisis(resultados)
                agregar_historial({
                    "accion": "analisis_rapido",
                    "detalle": estado["ruta_actual"],
                    "archivos": len(resultados),
                    "tamano": sum(r.get("tamano", 0) for r in resultados)
                })
                registrar_evento("analisis_rapido", estado["ruta_actual"], {
                    "carpetas": len(resultados)
                })
                notificar("MultiSoftCleaner", "Análisis rápido terminado")

            root.after(0, lambda: ventana.destroy() if ventana.winfo_exists() else None)

            def mostrar():
                limpiar_consola()
                titulo.config(text="Análisis rápido")
                if cancelado:
                    log(">> Análisis cancelado.")
                    return
                log(f">> Análisis rápido completado ({len(resultados)} carpetas)\n")
                mostrar_resultados(resultados)

            root.after(0, mostrar)
        except Exception as e:
            registrar_error("analisis_rapido_thread", e)
            root.after(0, lambda: log(f"ERROR: {e}"))
            root.after(0, lambda: ventana.destroy() if ventana.winfo_exists() else None)

    def escaneo_completo_thread(progreso_label, ventana):
        cancelado = False
        try:
            def cb(msg):
                nonlocal cancelado
                if msg.startswith("CANCELADO|"):
                    cancelado = True
                _callback_progreso(progreso_label, msg)

            apps = detectar_apps_inactivas(
                estado["ruta_actual"], callback=cb,
                cancel_flag=lambda: estado["cancelar"]
            )
            resultados = []
            if not estado["cancelar"]:
                resultados = analisis_completo(
                    estado["ruta_actual"], callback=cb,
                    cancel_flag=lambda: estado["cancelar"]
                )
                estado["ultimo_resultado"] = {"tipo": "completo", "datos": resultados}
                if not cancelado:
                    guardar_analisis(resultados)
                    agregar_historial({
                        "accion": "escaneo_completo",
                        "detalle": estado["ruta_actual"],
                        "archivos": len(resultados),
                        "tamano": sum(r.get("tamano", 0) for r in resultados)
                    })
                    registrar_evento("escaneo_completo", estado["ruta_actual"], {
                        "carpetas": len(resultados)
                    })
                    notificar("MultiSoftCleaner", "Escaneo completo terminado")

            root.after(0, lambda: ventana.destroy() if ventana.winfo_exists() else None)

            def mostrar():
                limpiar_consola()
                titulo.config(text="Escaneo completo")
                if cancelado:
                    log(">> Escaneo cancelado.")
                    return
                log(f">> Escaneo completo ({len(resultados)} carpetas)\n")
                mostrar_resultados(resultados)
                log("\n=== APLICACIONES INACTIVAS ===\n")
                if not apps:
                    log("No se detectaron aplicaciones inactivas.")
                else:
                    for app in apps[:25]:
                        log(f"  {formatear_tamano(app['tamano'])} | {app['dias_sin_usar']} días → {app['ruta']}")

            root.after(0, mostrar)
        except Exception as e:
            registrar_error("escaneo_completo_thread", e)
            root.after(0, lambda: log(f"ERROR: {e}"))
            root.after(0, lambda: ventana.destroy() if ventana.winfo_exists() else None)

    def duplicados_thread(progreso_label, ventana):
        try:
            def cb(msg):
                _callback_progreso(progreso_label, msg)

            duplicados = buscar_duplicados(
                estado["ruta_actual"], callback=cb,
                cancel_flag=lambda: estado["cancelar"]
            )
            estado["duplicados"] = duplicados
            estado["ultimo_resultado"] = {"tipo": "duplicados", "datos": duplicados}

            lim = limites()
            items = list(duplicados.items()) if duplicados else []
            if not es_pro() and len(items) > lim["max_duplicados_grupos"]:
                items = items[:lim["max_duplicados_grupos"]]

            registrar_evento("duplicados", estado["ruta_actual"], {
                "grupos": len(duplicados) if duplicados else 0
            })

            root.after(0, lambda: ventana.destroy() if ventana.winfo_exists() else None)

            def mostrar():
                limpiar_consola()
                titulo.config(text="Duplicados")
                if not duplicados:
                    log("No se encontraron duplicados.")
                    return
                log(f"Se encontraron {len(duplicados)} grupos de duplicados.\n")
                for i, (h, archivos) in enumerate(items[:25]):
                    log(f"\n--- Grupo {i+1} ---")
                    for p in archivos:
                        marca = " ⚠" if clasificar_ruta(p) == "ESPECIAL" else ""
                        log(f"  {p}{marca}")
                if len(duplicados) > 25:
                    log(f"\n... y {len(duplicados) - 25} grupos más.")
                resumen_liberable(duplicados)
                notificar("MultiSoftCleaner", "Búsqueda de duplicados terminada")

            root.after(0, mostrar)
        except Exception as e:
            registrar_error("duplicados_thread", e)
            root.after(0, lambda: log(f"ERROR: {e}"))
            root.after(0, lambda: ventana.destroy() if ventana.winfo_exists() else None)

    def grandes_thread(progreso_label, ventana):
        try:
            def cb(msg):
                _callback_progreso(progreso_label, msg)

            lim = limites()
            max_n = lim["max_archivos_grandes"]
            grandes = buscar_archivos_grandes(
                estado["ruta_actual"], limite=max_n, callback=cb,
                cancel_flag=lambda: estado["cancelar"]
            )
            estado["archivos_grandes"] = grandes
            estado["ultimo_resultado"] = {"tipo": "grandes", "datos": grandes}
            registrar_evento("archivos_grandes", estado["ruta_actual"], {
                "encontrados": len(grandes)
            })

            root.after(0, lambda: ventana.destroy() if ventana.winfo_exists() else None)

            def mostrar():
                limpiar_consola()
                titulo.config(text="Archivos grandes")
                log(f">> Top archivos pesados (≥ 50 MB) — mostrando hasta {max_n}\n")
                mostrar_resultados(grandes)
                notificar("MultiSoftCleaner", "Búsqueda de archivos grandes terminada")

            root.after(0, mostrar)
        except Exception as e:
            registrar_error("grandes_thread", e)
            root.after(0, lambda: log(f"ERROR: {e}"))
            root.after(0, lambda: ventana.destroy() if ventana.winfo_exists() else None)

    def vacias_thread(progreso_label, ventana):
        try:
            def cb(msg):
                _callback_progreso(progreso_label, msg)

            vacias = buscar_carpetas_vacias(
                estado["ruta_actual"], callback=cb,
                cancel_flag=lambda: estado["cancelar"]
            )
            estado["carpetas_vacias"] = vacias
            estado["ultimo_resultado"] = {"tipo": "vacias", "datos": vacias}
            registrar_evento("carpetas_vacias", estado["ruta_actual"], {
                "encontradas": len(vacias)
            })

            root.after(0, lambda: ventana.destroy() if ventana.winfo_exists() else None)

            def mostrar():
                limpiar_consola()
                titulo.config(text="Carpetas vacías")
                log(f">> Carpetas vacías encontradas: {len(vacias)}\n")
                mostrar_resultados(vacias)
                notificar("MultiSoftCleaner", "Búsqueda de carpetas vacías terminada")

            root.after(0, mostrar)
        except Exception as e:
            registrar_error("vacias_thread", e)
            root.after(0, lambda: log(f"ERROR: {e}"))
            root.after(0, lambda: ventana.destroy() if ventana.winfo_exists() else None)

    # =========================
    # ACCIONES
    # =========================
    def elegir_carpeta():
        ruta = filedialog.askdirectory(initialdir=estado["ruta_actual"])
        if ruta and ruta_valida(ruta):
            estado["ruta_actual"] = ruta
            ruta_label.config(text=f"📁 {ruta}")
            actualizar_tarjetas(ruta)
            cfg = cargar_config()
            cfg["ultima_ruta"] = ruta
            guardar_config(cfg)
            registrar_evento("elegir_carpeta", ruta)
            log(f">> Ruta de trabajo cambiada a:\n   {ruta}")

    def inicio():
        limpiar_consola()
        titulo.config(text="Inicio")
        actualizar_tarjetas()
        log(">> Bienvenido a MultiSoftCleaner\n")
        log("Herramienta de análisis y limpieza segura de espacio.")
        log("• No toca archivos del sistema (Linux / Windows)")
        log("• Los dudosos se marcan como ESPECIALES")
        log("• La limpieza mueve a la PAPELERA (no borra permanente)")
        log("• Confirmación fuerte requerida para limpiar\n")
        log(f"Plan actual: {'PRO' if es_pro() else 'FREE'}")
        log(f"Ruta actual: {estado['ruta_actual']}")
        log("\nAl terminar las pruebas usa: Generar informe prueba")

    def lanzar_hilo(nombre, target):
        estado["cancelar"] = False
        limpiar_consola()
        log(f">> Iniciando: {nombre}...")
        titulo.config(text=nombre)
        keep.activar()
        ventana, progreso_label = mostrar_carga_progreso()

        def wrapper():
            try:
                target(progreso_label, ventana)
            finally:
                keep.desactivar()

        threading.Thread(target=wrapper, daemon=True).start()

    def limpieza_ui():
        limpiar_consola()
        titulo.config(text="Limpieza")

        if estado["ultimo_resultado"]["tipo"] == "duplicados" and estado.get("duplicados"):
            log(">> Limpieza de duplicados\n")
            log("Se conserva el archivo más reciente de cada grupo.")
            log("PROTEGIDOS y ESPECIALES no se tocan.\n")
            resumen_liberable(estado["duplicados"])

            if not messagebox.askyesno("Confirmar", "¿Simular limpieza de duplicados? (dry-run)"):
                return

            def run():
                def cb(msg):
                    root.after(0, lambda m=msg: log(m))

                eliminados = limpiar_duplicados(
                    estado["duplicados"], callback=cb, dry_run=True
                )
                root.after(0, lambda: log(
                    f"\n>> Simulación terminada. Candidatos seguros: {len(eliminados)}"
                ))

                def preguntar():
                    if not eliminados:
                        return
                    if not messagebox.askyesno(
                        "Mover a papelera",
                        "¿Mover a la PAPELERA los archivos seguros?\n"
                        "(Se pueden recuperar desde la papelera del sistema)"
                    ):
                        log(">> Operación cancelada.")
                        return

                    texto = simpledialog.askstring(
                        "Confirmación fuerte",
                        "Escribe BORRAR (en mayúsculas) para confirmar:"
                    )
                    if texto != "BORRAR":
                        log(">> Confirmación incorrecta. No se movió nada.")
                        return

                    try:
                        antes = obtener_espacio(estado["ruta_actual"])["libre"]
                    except Exception:
                        antes = 0

                    real = limpiar_duplicados(
                        estado["duplicados"], callback=cb, dry_run=False
                    )
                    agregar_historial({
                        "accion": "limpieza_duplicados",
                        "detalle": f"{len(real)} a papelera",
                        "archivos": len(real),
                        "tamano": 0
                    })
                    registrar_evento("limpieza", "duplicados_papelera", {
                        "archivos": len(real)
                    })
                    log(f"\n>> Movidos a papelera: {len(real)}")

                    try:
                        despues = obtener_espacio(estado["ruta_actual"])["libre"]
                        liberado = despues - antes
                        if liberado > 0:
                            log(f"✅ Espacio libre ahora: {formatear_tamano(despues)}")
                            log(f"✅ Liberado aprox.: {formatear_tamano(liberado)}")
                        actualizar_tarjetas()
                        notificar(
                            "MultiSoftCleaner",
                            f"Limpieza terminada. Liberado ~{formatear_tamano(max(liberado, 0))}"
                        )
                    except Exception:
                        pass

                root.after(0, preguntar)

            threading.Thread(target=run, daemon=True).start()
            return

        tipo = estado["ultimo_resultado"].get("tipo")
        datos = estado["ultimo_resultado"].get("datos")

        if tipo in ("grandes", "vacias") and isinstance(datos, list) and datos:
            log(f">> Limpieza de {tipo}\n")
            mostrar_resultados(datos)

            seguras = [r["ruta"] for r in datos if r.get("seguridad") == "SEGURA"]
            if not seguras:
                log("\nNo hay elementos SEGUROS para limpiar.")
                return

            if not messagebox.askyesno(
                "Mover a papelera",
                f"¿Mover {len(seguras)} elementos seguros a la papelera?"
            ):
                return

            texto = simpledialog.askstring(
                "Confirmación fuerte",
                "Escribe BORRAR (en mayúsculas) para confirmar:"
            )
            if texto != "BORRAR":
                log(">> Confirmación incorrecta.")
                return

            def run2():
                def cb(msg):
                    root.after(0, lambda m=msg: log(m))
                try:
                    antes = obtener_espacio(estado["ruta_actual"])["libre"]
                except Exception:
                    antes = 0
                real = eliminar_rutas(seguras, callback=cb, dry_run=False)
                registrar_evento("limpieza", tipo, {"archivos": len(real)})
                root.after(0, lambda: log(f"\n>> Movidos a papelera: {len(real)}"))
                try:
                    despues = obtener_espacio(estado["ruta_actual"])["libre"]
                    liberado = despues - antes
                    root.after(0, lambda: log(
                        f"✅ Liberado aprox.: {formatear_tamano(max(liberado, 0))}"
                    ))
                    root.after(0, actualizar_tarjetas)
                    notificar("MultiSoftCleaner", "Limpieza terminada")
                except Exception:
                    pass

            threading.Thread(target=run2, daemon=True).start()
            return

        log("No hay datos listos para limpiar.")
        log("Ejecuta primero: Duplicados, Archivos grandes o Carpetas vacías.")

    def exportar_informe():
        datos = estado["ultimo_resultado"].get("datos")
        if not datos:
            messagebox.showinfo("Exportar", "No hay resultados para exportar.")
            return

        ruta = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Texto", "*.txt"), ("Todos", "*.*")],
            initialfile=f"msc_informe_{timestamp().replace(':', '-').replace(' ', '_')}.txt"
        )
        if not ruta:
            return

        try:
            with open(ruta, "w", encoding="utf-8") as f:
                f.write("MultiSoftCleaner - Informe\n")
                f.write(f"Fecha: {timestamp()}\n")
                f.write(f"Ruta: {estado['ruta_actual']}\n")
                f.write(f"Tipo: {estado['ultimo_resultado']['tipo']}\n")
                f.write(f"Plan: {'PRO' if es_pro() else 'FREE'}\n")
                f.write("=" * 60 + "\n\n")

                if isinstance(datos, dict):
                    for h, archivos in datos.items():
                        f.write(f"Grupo {h[:8]}...\n")
                        for p in archivos:
                            f.write(f"  {p}\n")
                        f.write("\n")
                else:
                    for r in datos:
                        tam = formatear_tamano(r.get("tamano", 0))
                        seg = r.get("seguridad", "")
                        f.write(f"{tam} | {seg} | {r.get('ruta')}\n")

            registrar_evento("exportar_informe", ruta)
            log(f">> Informe exportado:\n   {ruta}")
            messagebox.showinfo("Exportar", "Informe guardado correctamente.")
        except Exception as e:
            registrar_error("exportar_informe", e)
            messagebox.showerror("Error", str(e))

    def ver_historial():
        limpiar_consola()
        titulo.config(text="Historial")
        hist = cargar_historial()
        if not hist:
            log("No hay historial todavía.")
            return
        max_n = 100 if es_pro() else 10
        log(f"=== Historial (últimos {max_n}) ===\n")
        for h in hist[:max_n]:
            log(
                f"{h.get('fecha', '')}  |  {h.get('accion', '')}  |  "
                f"{h.get('detalle', '')}  |  {h.get('archivos', 0)} items"
            )

    def activar_pro():
        codigo = simpledialog.askstring(
            "Activar Pro",
            "Introduce tu código de licencia:\n(Ejemplo: MSC-PRO-XXXX)"
        )
        if codigo and codigo.strip().upper().startswith("MSC-PRO"):
            cfg = cargar_config()
            cfg["version"] = "pro"
            cfg["licencia"] = codigo.strip()
            guardar_config(cfg)
            registrar_evento("activar_pro", codigo.strip()[:12])
            messagebox.showinfo("Pro", "¡Versión Pro activada!\nReinicia la aplicación.")
        else:
            messagebox.showerror("Pro", "Código no válido.")

    def generar_informe_prueba():
        limpiar_consola()
        titulo.config(text="Informe de prueba")
        log(">> Generando informe de uso para el desarrollador...\n")

        destino = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Texto", "*.txt")],
            initialfile=f"MSC_informe_prueba_{timestamp().replace(':', '-').replace(' ', '_')}.txt"
        )
        if not destino:
            log("Cancelado por el usuario.")
            return

        try:
            ruta = generar_informe_txt(destino)
            registrar_evento("exportar_informe_prueba", ruta)
            log(f">> Informe generado:\n   {ruta}\n")
            log("Registro técnico también en:")
            log(f"   {ruta_json()}\n")
            log("Envía el archivo .txt al desarrollador.")
            messagebox.showinfo(
                "Informe de prueba",
                f"Informe guardado en:\n{ruta}\n\nEnvía ese archivo al desarrollador."
            )
        except Exception as e:
            registrar_error("generar_informe_prueba", e)
            log(f"ERROR: {e}")
            messagebox.showerror("Error", str(e))

    # =========================
    # BOTONES
    # =========================
    botones = [
        ("Inicio", inicio),
        ("Elegir carpeta", elegir_carpeta),
        ("Análisis rápido", lambda: lanzar_hilo("Análisis rápido", analisis_rapido_thread)),
        ("Escaneo completo", lambda: lanzar_hilo("Escaneo completo", escaneo_completo_thread)),
        ("Duplicados", lambda: lanzar_hilo("Duplicados", duplicados_thread)),
        ("Archivos grandes", lambda: lanzar_hilo("Archivos grandes", grandes_thread)),
        ("Carpetas vacías", lambda: lanzar_hilo("Carpetas vacías", vacias_thread)),
        ("Limpieza", limpieza_ui),
        ("Exportar informe", exportar_informe),
        ("Historial", ver_historial),
        ("Generar informe prueba", generar_informe_prueba),
        ("Activar Pro", activar_pro),
    ]

    for texto, cmd in botones:
        btn = tk.Button(
            sidebar, text=texto, bg=styles.BTN_COLOR, fg=styles.TEXT_COLOR,
            activebackground=styles.NEON_BLUE, activeforeground="#000",
            relief="flat", width=20, height=2, font=("Consolas", 10),
            command=cmd, cursor="hand2"
        )
        btn.pack(pady=3, padx=12)

    inicio()
    root.mainloop()