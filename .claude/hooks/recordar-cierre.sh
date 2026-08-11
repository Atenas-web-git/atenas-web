#!/bin/bash
# Se dispara justo antes de un `git commit` y recuerda los auditores.
#
# Por qué existe: los auditores están escritos y son buenos, pero la sesión 48
# terminó con un hueco (/admin/configuracion) porque sencillamente no se
# invocaron. La regla escrita ya había fallado antes con la documentación. Un
# recordatorio que salta solo no depende de que nadie se acuerde.
#
# NO bloquea. Solo avisa: bloquear commits acaba en que se busque cómo saltarlo.

entrada=$(cat)
comando=$(printf '%s' "$entrada" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null)

# Solo commits de verdad. `git log`, `git status` y demás no molestan.
case "$comando" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac

# Si el diff no toca código, no hay nada que auditar.
cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0
tocados=$(git diff --cached --name-only 2>/dev/null | grep -cE '^(src|supabase)/' || true)
[ "${tocados:-0}" -eq 0 ] && exit 0

hay_migracion=$(git diff --cached --name-only 2>/dev/null | grep -c 'supabase/migrations/' || true)
toca_admin=$(git diff --cached --name-only 2>/dev/null | grep -c 'app/admin/' || true)

echo "⏸  Antes de commitear ($tocados archivos de código):"
echo ""
echo "   ¿Pasaste los auditores? El último SIEMPRE es auditor-cierre."
[ "${toca_admin:-0}" -gt 0 ] && echo "   · Tocaste /admin → auditor-documentacion y auditor-seguridad."
[ "${hay_migracion:-0}" -gt 0 ] && echo "   · HAY MIGRACIÓN → confirma que está aplicada ANTES de que el código llegue a Vercel."
echo "   · ¿La ficha de Tareas/ quedó en el estado correcto?"
echo ""
echo "   Si ya lo hiciste, ignora esto y sigue."
exit 0
