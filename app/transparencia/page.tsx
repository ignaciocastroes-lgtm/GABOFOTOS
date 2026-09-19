import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { PageHeader } from '@/components/site/page-header'
import { PresupuestoResumen } from '@/components/site/presupuesto-resumen'
import { CLUB, CUENTA, DIRECTIVA, DIRECTIVA_VIGENCIA, PERSONALIDAD_JURIDICA } from '@/lib/club'

export const metadata: Metadata = {
  title: 'Transparencia | Internacional Lo Espejo',
  description:
    'Antecedentes legales, directiva vigente, datos bancarios y presupuesto del Club Deportivo Social y Cultural Hockey Internacional Lo Espejo.',
}

function fecha(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Transparencia() {
  const legales: [string, string][] = [
    ['Razón social', CLUB.razonSocial],
    ['RUT', CLUB.rut],
    ['Naturaleza jurídica', PERSONALIDAD_JURIDICA.naturaleza],
    ['Fecha de constitución', fecha(PERSONALIDAD_JURIDICA.fechaConstitucion)],
    ['Inscripción en el Registro Civil', `${PERSONALIDAD_JURIDICA.inscripcion}, ${fecha(PERSONALIDAD_JURIDICA.fechaInscripcion)}`],
    ['Decreto / Resolución', PERSONALIDAD_JURIDICA.decreto],
    ['Estado de la personalidad jurídica', PERSONALIDAD_JURIDICA.estado],
    ['Domicilio legal', PERSONALIDAD_JURIDICA.domicilioLegal],
  ]

  return (
    <>
      <SiteHeader />
      <main>
        <PageHeader
          titulo="Transparencia"
          bajada="Somos una organización sin fines de lucro que se financia con aportes de la comunidad. Publicamos nuestros antecedentes para que cualquiera pueda verificarlos."
        />

        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              Antecedentes legales
            </h2>
            <dl className="mt-8 divide-y divide-border rounded-2xl border border-border">
              {legales.map(([k, v]) => (
                <div key={k} className="grid gap-1 px-5 py-4 sm:grid-cols-[15rem_1fr] sm:gap-4">
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              La vigencia de la personalidad jurídica y la composición del directorio se pueden
              verificar directamente en el{' '}
              <a
                href="https://www.registrocivil.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Servicio de Registro Civil e Identificación
              </a>{' '}
              y en el{' '}
              <a
                href={PERSONALIDAD_JURIDICA.registroColaboradores}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Registro Central de Colaboradores del Estado
              </a>
              . Si necesitas los certificados para una postulación o una donación, escríbenos a{' '}
              <a href={`mailto:${CLUB.email}`} className="text-primary underline underline-offset-4">
                {CLUB.email}
              </a>{' '}
              y te los enviamos.
            </p>

            <h2 className="mt-16 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              Directiva vigente
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Electa el {fecha(DIRECTIVA_VIGENCIA.electaEl)}, con mandato de{' '}
              {DIRECTIVA_VIGENCIA.duracionAnios} años.
            </p>
            <ul className="mt-6 divide-y divide-border rounded-2xl border border-border">
              {DIRECTIVA.map((d) => (
                <li key={d.cargo} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4">
                  <span className="font-medium text-foreground">{d.nombre}</span>
                  <span className="text-sm text-muted-foreground">
                    {d.cargo}
                    {'representanteLegal' in d && d.representanteLegal
                      ? ' · Representante legal'
                      : ''}
                  </span>
                </li>
              ))}
            </ul>

            <h2 className="mt-16 font-heading text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
              Cuenta para aportes
            </h2>
            <dl className="mt-6 divide-y divide-border rounded-2xl border border-border">
              {[
                ['Banco', CUENTA.banco],
                ['Tipo de cuenta', CUENTA.tipo],
                ['N° de cuenta', CUENTA.numero],
                ['Titular', CUENTA.titular],
                ['RUT', CUENTA.rut],
                ['Correo para comprobantes', CUENTA.email],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 px-5 py-4 sm:grid-cols-[15rem_1fr] sm:gap-4">
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted-foreground">
              Todos los aportes ingresan a esta cuenta, a nombre del club. No recibimos dinero en
              cuentas personales.
            </p>

            <PresupuestoResumen />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
