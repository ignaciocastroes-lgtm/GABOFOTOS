import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PageHeader } from '@/components/site/page-header'
import { CLUB } from '@/lib/club'

export const metadata: Metadata = {
  title: 'Política de privacidad | Internacional Lo Espejo',
  robots: { index: false },
}

export default function Privacidad() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader titulo="Política de privacidad" />
        <section className="bg-background py-16 md:py-24">
          <article className="mx-auto flex max-w-2xl flex-col gap-6 px-4 leading-relaxed text-muted-foreground md:px-6">
            <p>
              El {CLUB.razonSocial}, RUT {CLUB.rut}, es responsable del tratamiento de los datos
              personales que se recogen en este sitio.
            </p>

            <h2 className="mt-4 font-heading text-xl font-bold uppercase tracking-tight text-foreground">
              Qué datos recogemos
            </h2>
            <p>
              Solo los que nos entregas voluntariamente al escribirnos o al inscribir a un niño o
              niña en la escuela: nombre, edad, nombre del apoderado, teléfono y correo. No usamos
              cookies de publicidad ni de seguimiento de terceros.
            </p>

            <h2 className="mt-4 font-heading text-xl font-bold uppercase tracking-tight text-foreground">
              Para qué los usamos
            </h2>
            <p>
              Únicamente para responderte, coordinar la participación deportiva y cumplir con las
              inscripciones que exigen las ligas y los torneos. No vendemos ni cedemos datos a
              terceros con fines comerciales.
            </p>

            <h2 className="mt-4 font-heading text-xl font-bold uppercase tracking-tight text-foreground">
              Datos de niñas y niños
            </h2>
            <p>
              La mayoría de nuestros deportistas son menores de edad y tratamos sus datos con
              especial cuidado. En este sitio no publicamos nombres completos, documentos de
              identidad ni retratos individuales de menores. Las fotos que mostramos son grupales o
              de acción, y se publican con la autorización de imagen que firman los apoderados al
              momento de la inscripción. Si eres apoderado y quieres que retiremos una fotografía en
              la que aparece tu hijo o hija, escríbenos y lo hacemos sin pedir explicaciones.
            </p>

            <h2 className="mt-4 font-heading text-xl font-bold uppercase tracking-tight text-foreground">
              Pagos
            </h2>
            <p>
              Los aportes con tarjeta se procesan en Mercado Pago. El club no recibe ni almacena
              datos de tarjetas: solo conocemos el monto, el estado del pago y el correo de contacto
              para coordinar la entrega.
            </p>

            <h2 className="mt-4 font-heading text-xl font-bold uppercase tracking-tight text-foreground">
              Tus derechos
            </h2>
            <p>
              Puedes pedirnos acceder a tus datos, corregirlos o eliminarlos escribiendo a{' '}
              <a href={`mailto:${CLUB.email}`} className="text-primary underline underline-offset-4">
                {CLUB.email}
              </a>
              . Respondemos en un plazo razonable y sin costo.
            </p>

            <p className="mt-6 text-sm">
              Esta política se rige por la Ley 19.628 sobre protección de la vida privada y se
              adecuará a la Ley 21.719 cuando entre en vigencia.
            </p>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
