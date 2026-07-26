/**
 * Layout de la documentación.
 *
 * Solo aporta estilos de impresión: el manual se imprime o se guarda en PDF
 * con Ctrl/Cmd + P, y en papel sobran el menú lateral, la cabecera del
 * backoffice y los enlaces de navegación. El <style> se monta únicamente
 * mientras se está dentro de /admin/documentacion.
 */
export default function DocumentacionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        @media print {
          aside,
          header,
          .doc-no-print {
            display: none !important;
          }
          body,
          .flex-1 {
            overflow: visible !important;
          }
          article {
            break-inside: avoid;
            page-break-inside: avoid;
            border: 1px solid #E8E4DD !important;
          }
          a[href^="/admin"]::after {
            content: "";
          }
        }
      `}</style>
      {children}
    </>
  );
}
