import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { PoliticaDoc, SeccionDoc, ParrafoDoc, BulletDoc } from "@/components/politicas/PoliticaDoc";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Política de Privacidad – Proveedores | Unidad Educativa Atenas",
  description:
    "Política de privacidad de la Fundación Cultural y Educativa Ambato para proveedores de bienes y servicios. Conozca cómo tratamos sus datos personales conforme a la LOPDP.",
};

export default function PoliticaProveedoresPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="POLÍTICA DE PRIVACIDAD"
          title="Para Proveedores"
          subtitle="Versión 1.0 · Vigente desde el 30 de septiembre de 2024"
          ghostText="PRIVACIDAD"
        />

        <PoliticaDoc
          titulo="Política de Privacidad para Proveedores"
          version="Versión 1.0"
          audiencia="Proveedores"
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
              La Fundación trata datos personales de sus proveedores (personas naturales o representantes legales
              y contactos de personas jurídicas) para las siguientes finalidades:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Gestión y formalización de contratos: datos de identificación, RUC, representación legal y documentos habilitantes.",
                "Comunicación comercial y administrativa: datos de contacto para coordinación de pedidos, entregas y servicios.",
                "Pagos y facturación: datos bancarios y tributarios necesarios para la liquidación de obligaciones económicas.",
                "Evaluación y calificación de proveedores: historial de cumplimiento para el registro interno de proveedores calificados.",
                "Cumplimiento normativo: verificación de obligaciones tributarias, laborales y de seguridad social.",
              ]}
            />
          </SeccionDoc>

          <SeccionDoc numero={3} titulo="Legitimación del Tratamiento">
            <ParrafoDoc>
              La legitimación para el tratamiento de sus datos personales se basa en:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "La ejecución del contrato de provisión de bienes o servicios suscrito con la Fundación.",
                "El cumplimiento de obligaciones legales en materia tributaria, laboral y de contratación pública.",
                "El interés legítimo de la Fundación para gestionar de forma eficiente sus relaciones con proveedores.",
              ]}
            />
          </SeccionDoc>

          <SeccionDoc numero={4} titulo="Destinatarios de los Datos">
            <ParrafoDoc>
              Los datos personales de proveedores podrán ser compartidos, cuando sea estrictamente necesario, con:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Personal administrativo y financiero interno de la institución para la gestión de contratos y pagos.",
                "Organismos de control y autoridades competentes (SRI, SERCOP, auditoría externa) cuando la ley así lo exija.",
                "Sistemas de gestión financiera y contable utilizados por la institución, bajo acuerdos de confidencialidad.",
              ]}
            />
            <ParrafoDoc>
              En ningún caso se cederán datos a terceros con fines distintos a los indicados sin el consentimiento
              previo del titular.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={5} titulo="Transferencias Internacionales de Datos">
            <ParrafoDoc>
              La Fundación no realiza transferencias internacionales de datos personales de proveedores, salvo que
              exista una obligación legal que lo requiera o el titular haya otorgado su consentimiento expreso.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={6} titulo="Período de Retención de los Datos">
            <ParrafoDoc>
              Los datos personales de proveedores serán conservados:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Durante la vigencia de la relación contractual con la institución.",
                "Por un período mínimo de 7 años tras la finalización del contrato, para atender posibles reclamaciones y cumplir con obligaciones tributarias y legales.",
              ]}
            />
            <ParrafoDoc>
              Una vez cumplidos los plazos, los datos serán eliminados o anonimizados de forma segura.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={7} titulo="Derechos del Titular y Proceso para Ejercerlos">
            <ParrafoDoc>
              De conformidad con la Ley Orgánica de Protección de Datos Personales (LOPDP), el titular tiene derecho a:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Acceso: conocer qué datos personales trata la Fundación y con qué finalidad.",
                "Rectificación: solicitar la corrección de datos inexactos o incompletos.",
                "Cancelación o Supresión: solicitar la eliminación de sus datos cuando ya no sean necesarios.",
                "Oposición: oponerse al tratamiento de sus datos en las circunstancias previstas por la ley.",
                "Portabilidad: recibir sus datos en un formato estructurado y de lectura mecánica.",
                "Limitación del tratamiento: solicitar la restricción del tratamiento en los casos que la ley prevé.",
              ]}
            />
            <ParrafoDoc>
              Para ejercer cualquiera de estos derechos, envíe una solicitud escrita a{" "}
              <strong>protecciondatos@atenas.edu.ec</strong> indicando el derecho que desea ejercer y adjuntando
              copia de su cédula de identidad o pasaporte. La Fundación responderá en un plazo máximo de 15 días
              hábiles.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={8} titulo="Uso de Cookies">
            <ParrafoDoc>
              El sitio web institucional (atenas.edu.ec) puede utilizar cookies técnicas, de análisis y de
              preferencias. El usuario puede gestionarlas desde la configuración de su navegador. Para más
              información, consulte la Política para Clientes y Familias.
            </ParrafoDoc>
          </SeccionDoc>

          <SeccionDoc numero={9} titulo="Seguridad de los Datos">
            <ParrafoDoc>
              La Fundación ha implementado medidas técnicas y organizativas para proteger los datos personales de
              sus proveedores frente a acceso no autorizado, alteración, pérdida o divulgación:
            </ParrafoDoc>
            <BulletDoc
              items={[
                "Control de acceso basado en roles para los sistemas internos.",
                "Cifrado de datos en tránsito mediante protocolos SSL/TLS.",
                "Copias de seguridad periódicas y procedimientos de recuperación.",
                "Formación del personal en protección de datos personales.",
              ]}
            />
          </SeccionDoc>

          <SeccionDoc numero={10} titulo="Personas Naturales y Representantes Legales">
            <ParrafoDoc>
              La presente política aplica a personas naturales que actúan como proveedores y a los representantes
              legales y contactos designados por personas jurídicas proveedoras. Se presume que todos los titulares
              de datos tratados en este contexto son mayores de edad.
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
              La Fundación se reserva el derecho de modificarla para adaptarla a cambios normativos o a las
              necesidades institucionales. Las modificaciones serán comunicadas a través del sitio web institucional
              y por los canales de comunicación habituales con proveedores.
            </ParrafoDoc>
          </SeccionDoc>
        </PoliticaDoc>

        <FooterCTA />
      </main>
    </>
  );
}
