import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { PoliticaDoc, SeccionDoc, ParrafoDoc, BulletDoc } from "@/components/politicas/PoliticaDoc";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Política de Privacidad – Clientes y Familias | Unidad Educativa Atenas",
  description:
    "Política de privacidad de la Fundación Cultural y Educativa Ambato para estudiantes y representantes legales. Conozca cómo tratamos sus datos personales conforme a la LOPDP.",
};

export default function PoliticaClientesPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="POLÍTICA DE PRIVACIDAD"
          title="Para Clientes y Familias"
          subtitle="Versión 1.0 · Vigente desde el 30 de septiembre de 2024"
          ghostText="PRIVACIDAD"
        />

        <PoliticaDoc
          titulo="Política de Privacidad para Clientes y Familias"
          version="Versión 1.0"
          audiencia="Clientes y Familias"
        >
          <SeccionDoc numero={1} titulo="Responsable del Tratamiento">
            <ParrafoDoc>
              El responsable del tratamiento de sus datos personales es la{" "}
              <strong>Fundación Cultural y Educativa Ambato</strong>, con RUC 1890050863001, con domicilio en calle
              Gabriel Román y Av. Pedro Vásconez, Izamba, Ambato, Ecuador.
            </ParrafoDoc>
            <ParrafoDoc>
              Para consultas relativas a protección de datos puede contactarnos en:{" "}
              <strong>protecciondatos@atenas.edu.ec</strong> · Teléfono: +593 2854281 ext. 111.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={2} titulo="Finalidad del Tratamiento y Datos Personales Tratados">
            <ParrafoDoc>
              La Fundación trata datos personales de sus clientes (estudiantes, representantes legales y familias)
              para las siguientes finalidades:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Admisiones y matrícula: datos de identificación, historial académico previo y documentos personales requeridos por el Ministerio de Educación.",
                "Gestión académica: seguimiento de calificaciones, asistencia, actividades extracurriculares y expedientes académicos.",
                "Comunicación institucional: notificaciones, circulares, convocatorias a eventos y comunicados oficiales.",
                "Cobro de pensiones y matrículas: datos bancarios y comprobantes de pago para la gestión financiera.",
                "Acceso a plataformas educativas: habilitación de cuentas en Aleks, eLibro, Biblioteca Virtual, Idukay y Google Workspace for Education.",
                "Participación en programas externos: olimpiadas académicas, intercambios, competencias deportivas y eventos culturales.",
                "Bachillerato Internacional (IB): gestión de exámenes, acreditación y registro ante la IB Organization.",
              ]}
            />
          </SeccionDoc>

          <SeccionDoc numero={3} titulo="Legitimación del Tratamiento">
            <ParrafoDoc>
              La legitimación para el tratamiento de sus datos personales se basa en:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "El consentimiento expreso del titular o de su representante legal (en el caso de menores de edad).",
                "La ejecución del contrato de prestación de servicios educativos suscrito con la institución.",
                "El cumplimiento de obligaciones legales establecidas por la Ley Orgánica de Educación Intercultural (LOEI), la LOPDP y la normativa del MINEDUC.",
                "El interés legítimo de la Fundación para garantizar la seguridad y el correcto funcionamiento del entorno educativo.",
              ]}
            />
          </SeccionDoc>

          <SeccionDoc numero={4} titulo="Destinatarios de los Datos">
            <ParrafoDoc>
              Los datos personales podrán ser compartidos, exclusivamente en la medida necesaria, con:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Personal docente y administrativo interno de la institución para el desempeño de sus funciones.",
                "Organismos de control y autoridades competentes (MINEDUC, SNIDE, entidades de salud) cuando la ley así lo exija.",
                "Proveedores de servicios tecnológicos que actúan como encargados del tratamiento bajo acuerdos de confidencialidad y seguridad (plataformas educativas, sistemas de gestión académica).",
                "IB Organization, para la gestión del Programa del Diploma Internacional, conforme al contrato de centro autorizado.",
              ]}
            />
            <ParrafoDoc>
              En ningún caso se cederán datos a terceros con fines comerciales sin el consentimiento previo del titular.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={5} titulo="Transferencias Internacionales de Datos">
            <ParrafoDoc>
              En el marco del Programa del Diploma del Bachillerato Internacional, determinados datos de rendimiento
              académico pueden ser transferidos a la IB Organization, con sede en Ginebra, Suiza. Esta transferencia
              se realiza en cumplimiento de los requerimientos del programa IB y con el consentimiento previo informado
              del titular o su representante legal.
            </ParrafoDoc>
            <ParrafoDoc>
              Ninguna otra transferencia internacional de datos se realizará sin consentimiento explícito del titular
              o sin una base legal que lo justifique.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={6} titulo="Período de Retención de los Datos">
            <ParrafoDoc>
              Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades
              para las que fueron recopilados:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Durante toda la vigencia de la relación educativa con la institución.",
                "Por un período mínimo de 7 años contados desde la finalización de la relación, para atender posibles reclamaciones y cumplir obligaciones legales.",
                "Los expedientes académicos serán conservados de forma permanente conforme a la normativa del MINEDUC.",
              ]}
            />
            <ParrafoDoc>
              Una vez cumplidos los plazos de retención, los datos serán eliminados o anonimizados de forma segura.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={7} titulo="Derechos del Titular y Proceso para Ejercerlos">
            <ParrafoDoc>
              De conformidad con la Ley Orgánica de Protección de Datos Personales (LOPDP), el titular o su
              representante legal tiene derecho a:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Acceso: conocer qué datos personales trata la Fundación y con qué finalidad.",
                "Rectificación: solicitar la corrección de datos inexactos o incompletos.",
                "Cancelación o Supresión: solicitar la eliminación de sus datos cuando ya no sean necesarios para la finalidad para la que fueron recopilados.",
                "Oposición: oponerse al tratamiento de sus datos en las circunstancias previstas por la ley.",
                "Portabilidad: recibir sus datos en un formato estructurado, de uso común y lectura mecánica.",
                "Limitación del tratamiento: solicitar que se restrinja el tratamiento de sus datos en los casos que la ley prevé.",
                "No ser sujeto de decisiones automatizadas que produzcan efectos jurídicos significativos.",
              ]}
            />
            <ParrafoDoc>
              Para ejercer cualquiera de estos derechos, el titular o su representante legal deberá enviar una
              solicitud escrita a <strong>protecciondatos@atenas.edu.ec</strong>, indicando el derecho que desea
              ejercer y adjuntando copia de su cédula de identidad. Para datos de menores se deberá acreditar la
              condición de representante legal.
            </ParrafoDoc>
            <ParrafoDoc>
              La Fundación responderá en un plazo máximo de 15 días hábiles desde la recepción de la solicitud completa.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={8} titulo="Uso de Cookies">
            <ParrafoDoc>
              El sitio web institucional (atenas.edu.ec) puede utilizar cookies y tecnologías similares con las
              siguientes finalidades:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Cookies técnicas o necesarias: permiten el funcionamiento básico del sitio (gestión de sesión, preferencias de accesibilidad).",
                "Cookies de análisis: recopilan información estadística anónima para mejorar el rendimiento y la experiencia del sitio.",
                "Cookies de preferencias: recuerdan las configuraciones seleccionadas por el usuario entre visitas.",
              ]}
            />
            <ParrafoDoc>
              El usuario puede configurar su navegador para rechazar todas las cookies o para recibir un aviso previo
              a su instalación. La desactivación de cookies técnicas puede afectar el correcto funcionamiento del sitio.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={9} titulo="Seguridad de los Datos">
            <ParrafoDoc>
              La Fundación ha implementado medidas técnicas y organizativas para garantizar la confidencialidad,
              integridad y disponibilidad de los datos personales:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Control de acceso basado en roles para los sistemas de información internos.",
                "Cifrado de datos en tránsito mediante protocolos SSL/TLS.",
                "Copias de seguridad periódicas y planes de recuperación ante incidentes.",
                "Formación continua del personal en materia de protección de datos.",
                "Procedimientos de detección y notificación de brechas de seguridad.",
              ]}
            />
            <ParrafoDoc>
              En caso de producirse una brecha de seguridad que pueda afectar los derechos de los titulares, la
              Fundación notificará a la autoridad competente y, cuando corresponda, a los propios titulares, en los
              plazos establecidos por la LOPDP.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={10} titulo="Menores de Edad">
            <ParrafoDoc>
              La Fundación trata datos de menores de edad en el marco exclusivo de la prestación de servicios
              educativos. Este tratamiento requiere el consentimiento expreso del padre, madre o representante legal.
            </ParrafoDoc>
            <ParrafoDoc>
              Los representantes legales pueden, en cualquier momento, acceder a los datos del menor bajo su tutela,
              solicitar su rectificación y, cuando proceda legalmente, su supresión. Para ejercer estos derechos
              deberán acreditar su condición mediante la documentación correspondiente (partida de nacimiento o
              resolución judicial de tutela).
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={11} titulo="Contacto del Responsable de Protección de Datos">
            <ParrafoDoc>
              Para cualquier consulta, solicitud o reclamación relacionada con el tratamiento de sus datos personales:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Correo electrónico: protecciondatos@atenas.edu.ec",
                "Teléfono: +593 2854281 ext. 111",
                "Dirección: Calle Gabriel Román y Av. Pedro Vásconez, Izamba, Ambato, Ecuador",
              ]}
            />
          </SeccionDoc>

          <SeccionDoc numero={12} titulo="Vigencia y Modificaciones">
            <ParrafoDoc>
              La presente Política de Privacidad entra en vigor el <strong>30 de septiembre de 2024</strong> y
              permanecerá vigente hasta que sea sustituida por una versión actualizada.
            </ParrafoDoc>
            <ParrafoDoc>
              La Fundación Cultural y Educativa Ambato se reserva el derecho de modificar esta política para
              adaptarla a cambios normativos o a las necesidades propias de la institución. Los cambios serán
              notificados a través de los canales de comunicación institucionales (correo a representantes legales
              y publicación en el sitio web).
            </ParrafoDoc>
            <ParrafoDoc>
              Se recomienda revisar periódicamente la versión actualizada disponible en este sitio web.
            </ParrafoDoc>
          </SeccionDoc>
        </PoliticaDoc>

        <FooterCTA />
      </main>
    </>
  );
}
