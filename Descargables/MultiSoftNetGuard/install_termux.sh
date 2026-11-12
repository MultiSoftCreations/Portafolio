#!/data/data/com.termux/files/usr/bin/bash
# Instalador MultiSoft NetGuard para Termux
# MultiSoftCreations

echo "=========================================="
echo "  MultiSoft NetGuard - Instalador Termux"
echo "  MultiSoftCreations"
echo "=========================================="
echo ""

# Actualizar paquetes
pkg update -y
pkg upgrade -y

# Instalar dependencias
pkg install -y python git

# Instalar pip packages
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "✓ Instalación completada."
echo ""
echo "Para ejecutar:"
echo "  python main.py"
echo ""
echo "Recuerda configurar tu usuario de GitHub dentro de la app"
echo "para las actualizaciones automáticas."
echo ""
