/**
 * Contenido extendido de /profesores/[id].
 *
 * `secciones` es el relato completo que escribió la directiva para cada
 * profesor — la versión larga, con historia y contexto, que no cabe en la
 * tarjeta de la grilla. `clinicas` y `videos` empiezan vacíos a propósito: es
 * el espacio propio de cada profesor para publicar sus clínicas, charlas o
 * videos de trabajo cuando quieran. Que la lista esté vacía no es un error, es
 * la invitación.
 */

export type SeccionBio = { titulo?: string; parrafos: string[] }
export type Clinica = { titulo: string; fecha: string; descripcion: string; enlace?: string }
export type Video = { titulo: string; url: string }

export type ProfesorExtendido = {
  secciones: SeccionBio[]
  clinicas: Clinica[]
  videos: Video[]
}

export const PROFESORES_EXTENDIDO: Record<string, ProfesorExtendido> = {
  'rodolfo-oyola': {
    clinicas: [],
    videos: [],
    secciones: [
      {
        titulo: 'Un sanjuanino que hizo del hockey patín una forma de vida',
        parrafos: [
          'Rodolfo Oyola, conocido cariñosamente en el mundo del hockey como «Rolo» Oyola, es un entrenador argentino nacido en San Juan, una de las grandes cunas mundiales del hockey sobre patines. Su pasión por este deporte lo llevó a construir una extensa trayectoria que, con el paso de los años, cruzaría la cordillera para dejar una profunda huella en el hockey chileno.',
          'Hace más de dos décadas llegó a Chile y comenzó a desarrollar una carrera ligada principalmente a la formación de jugadores y jugadoras y al trabajo con selecciones nacionales.',
        ],
      },
      {
        titulo: 'Un entrenador formado en la escuela sanjuanina',
        parrafos: [
          'Nacer en San Juan marcó profundamente su manera de entender el hockey. En una provincia donde el hockey sobre patines es mucho más que un deporte y forma parte de una verdadera cultura, Oyola adquirió conocimientos, experiencias y una filosofía de trabajo que posteriormente pondría al servicio del hockey chileno.',
          'Su capacidad para trabajar con jóvenes y desarrollar procesos formativos lo llevó a asumir importantes responsabilidades en distintas categorías de las selecciones chilenas. En 2007 fue designado entrenador de la Selección Chilena Sub-20 masculina, participando en el proceso de preparación para el Campeonato Mundial de la categoría.',
        ],
      },
      {
        titulo: 'Su llegada a Las Marcianitas',
        parrafos: [
          'Uno de los capítulos más importantes de su trayectoria comenzó con su incorporación al cuerpo técnico de la selección femenina chilena. Durante años trabajó junto a Rodrigo Quintanilla, formando parte de una dupla técnica que acompañó a Las Marcianitas en distintos procesos internacionales, como ayudante técnico.',
          'En 2016 integró oficialmente el cuerpo técnico de Las Marcianitas. Su experiencia y conocimiento del hockey sanjuanino fueron un aporte significativo para los procesos de preparación de las selecciones chilenas, en el hockey femenino y masculino: procesos de Sub-15, Sub-17 y selección adulta, y participaciones en campeonatos mundiales como los de 2017 y 2022.',
        ],
      },
      {
        titulo: 'Su historia en Internacional Lo Espejo',
        parrafos: [
          'Su llegada al Inter representa la unión entre una enorme experiencia internacional y un proyecto deportivo que busca seguir creciendo y formando nuevas generaciones. Rolo ha puesto a disposición del club los conocimientos adquiridos durante décadas de trabajo en el hockey, tanto en Argentina como en Chile y especialmente en los procesos de selecciones nacionales.',
          'Su experiencia le permite aportar una mirada integral al desarrollo de los deportistas, trabajando no solamente aspectos técnicos y tácticos, sino también aquellos valores que considera fundamentales para crecer dentro del deporte: disciplina, compañerismo, respeto, esfuerzo, responsabilidad y perseverancia.',
        ],
      },
      {
        titulo: 'Más que un entrenador',
        parrafos: [
          'La historia de Rolo Oyola no puede medirse únicamente por los equipos que dirigió o los campeonatos en los que participó. En 2021 atravesó una compleja situación económica producto de problemas de financiamiento de la Federación Chilena de Hockey y Patinaje, llegando a acumular varios meses sin recibir remuneración. Pese a aquello, decidió continuar trabajando con la selección.',
          'Ese episodio refleja una característica que ha acompañado gran parte de su carrera: su compromiso con el deporte y, especialmente, con los jugadores y jugadoras que tiene a su cargo.',
        ],
      },
      {
        titulo: 'El Rolo que dejó San Juan, pero nunca abandonó sus raíces',
        parrafos: [
          'Aunque gran parte de su carrera se desarrolló en Chile, San Juan continúa siendo una parte fundamental de su identidad deportiva. Hoy, su historia también forma parte de Internacional Lo Espejo, donde continúa entregando su experiencia a las nuevas generaciones.',
          'El camino recorrido por Rolo demuestra que el hockey puede llevar a una persona muy lejos, pero que el verdadero sentido del deporte está en aquello que uno es capaz de entregar a quienes vienen detrás.',
        ],
      },
    ],
  },

  'rodrigo-quintanilla': {
    clinicas: [],
    videos: [],
    secciones: [
      {
        titulo: 'El hombre detrás de una generación histórica del hockey patín chileno',
        parrafos: [
          'Rodrigo Quintanilla Cerpa nació en Santiago el 4 de noviembre de 1971. Su historia con el hockey patín comenzó desde muy joven, cuando en 1980, siendo niño, quedó cautivado al ver por televisión el Campeonato Mundial Masculino disputado en Chile. Desde entonces, el hockey se transformó en una pasión que marcaría toda su vida.',
          'Su vínculo con la selección chilena comenzó como jugador. Fue arquero de las selecciones juveniles y posteriormente de la adulta, representando a Chile en competencias sudamericanas y mundiales hasta 2003 — una experiencia que le permitió conocer desde dentro las exigencias, sacrificios y emociones que implica vestir la camiseta nacional.',
          'En 2002 inició una nueva etapa al asumir como entrenador de las selecciones femeninas de hockey patín. Desde entonces comenzó a construir un proyecto que cambiaría para siempre la historia del hockey femenino chileno.',
        ],
      },
      {
        titulo: 'El sueño de las Marcianitas',
        parrafos: [
          'El gran momento de su trayectoria llegó en 2006. Bajo su dirección, la selección femenina chilena, conocida como Las Marcianitas, disputó en casa el Campeonato Mundial de Hockey Patín Femenino. El 7 de octubre de 2006, Chile derrotó a España en una inolvidable final que terminó 2-1 mediante gol de oro. Así, las Marcianitas se proclamaron campeonas del mundo, conquistando por primera vez para Chile un título mundial en un deporte colectivo. Quintanilla fue reconocido como uno de los principales gestores de aquella histórica hazaña.',
          'Aquel campeonato no solo significó una copa. Transformó al hockey patín femenino en Chile, puso a las Marcianitas en el centro de la atención nacional y abrió nuevas oportunidades para muchas generaciones de jugadoras.',
        ],
      },
      {
        titulo: 'Un entrenador de selección',
        parrafos: [
          'Con las Marcianitas consiguió seguir instalando a Chile entre las selecciones importantes del mundo: el título mundial de 2006, el tercer lugar mundial de 2014 y el cuarto lugar en 2017. En 2014 recibió uno de los reconocimientos más importantes de su carrera al ser elegido Mejor Entrenador de Chile por el Círculo de Periodistas Deportivos, superando incluso a Jorge Sampaoli, quien dirigía a la selección chilena de fútbol.',
          'Durante casi dos décadas estuvo vinculado a las selecciones nacionales. En 2023 terminó su etapa como head coach de las selecciones chilenas, cerrando un ciclo de enorme importancia para el hockey patín del país.',
        ],
      },
      {
        titulo: 'Su trabajo en Internacional Lo Espejo',
        parrafos: [
          'Actualmente desarrolla parte de su labor en el Inter, participando activamente en la formación y conducción de nuevas generaciones de jugadores y jugadoras, poniendo al servicio de los jóvenes toda la experiencia adquirida durante décadas en el alto rendimiento.',
          'Su trabajo acá representa una nueva etapa de su carrera, en la que el desafío ya no es solamente competir al más alto nivel, sino también formar, enseñar, transmitir valores y entregar herramientas para que las nuevas generaciones puedan crecer dentro y fuera de la cancha.',
          'Su llegada y permanencia en el club constituyen un verdadero privilegio para Internacional Lo Espejo: contar con un entrenador de su trayectoria permite que niños, niñas y jóvenes aprendan directamente de alguien que ha vivido momentos históricos para este deporte en Chile.',
        ],
      },
      {
        titulo: 'Un legado que permanece',
        parrafos: [
          'Más allá de los títulos y las medallas, Rodrigo Quintanilla dejó algo mucho más profundo: una generación de jugadoras que aprendió a creer que Chile podía competir de igual a igual con las grandes potencias del hockey mundial.',
          'Hoy, su experiencia en Internacional Lo Espejo se transforma en futuro: su legado no queda solamente en aquel inolvidable título mundial de 2006, sino también en cada jugador y jugadora a quienes transmite sus conocimientos, disciplina, pasión y amor por el hockey.',
        ],
      },
    ],
  },

  'antonio-espinoza': {
    clinicas: [
      {
        titulo: 'Clínica de arqueros en el Gimnasio Municipal Lo Espejo',
        fecha: '2025-01',
        descripcion:
          'Clínica especializada para arqueras y arqueros de distintas edades, encabezada por Toño Espinoza junto a Rodrigo Quintanilla.',
      },
    ],
    videos: [],
    secciones: [
      {
        titulo: 'Una leyenda del hockey chileno que hoy sigue dejando huella en el Inter',
        parrafos: [
          'José Antonio «Toño» Espinoza es una de las figuras más importantes y respetadas de la historia del hockey sobre patines chileno. Su trayectoria como arquero, entrenador y formador lo ha convertido en un verdadero referente para varias generaciones de deportistas.',
          'Su historia con el hockey comenzó de manera casi accidental. A los 13 años, mientras jugaba fútbol en las divisiones inferiores de Universidad de Chile, fue invitado a reemplazar a un arquero en el equipo donde jugaban sus hermanos. Ese momento marcó el comienzo de una vida ligada para siempre al hockey sobre patines.',
        ],
      },
      {
        titulo: 'Una carrera que hizo historia',
        parrafos: [
          'Toño Espinoza defendió los colores de importantes instituciones del hockey nacional: Universidad de Chile, Universidad Católica, Manuel de Salas, UMCE y Estudiantil San Miguel. También llevó su talento al extranjero, jugando en Italia para Giovinazzo, Prato y Vercelli.',
          'Fue seleccionado nacional en seis Campeonatos Mundiales — 1980, 1982, 1984, 1988, 1989 y 1991 —, con históricos cuartos lugares en 1980, 1982 y 1989, además de la medalla de oro en los Juegos Cruz del Sur de 1982, en Rosario, Argentina.',
          'Su particular estilo bajo los tres palos marcó una época: no se conformaba con permanecer dentro del arco, sino que se caracterizó por su agilidad y por participar activamente en el juego, adelantándose para cortar ataques y transformándose prácticamente en un jugador más dentro de la cancha.',
        ],
      },
      {
        titulo: 'El entrenador y formador',
        parrafos: [
          'Paralelamente a su carrera como jugador, desarrolló su faceta como entrenador y formador, trabajando con categorías infantiles de Manuel de Salas y, después, en el colegio Rafael Sanhueza de Recoleta. Con los años, su experiencia se transformó en una herramienta para enseñar a las nuevas generaciones no solo los secretos técnicos de la portería, sino también la disciplina, concentración, sacrificio y compromiso que exige el deporte.',
          'En enero de 2025 volvió a demostrar ese compromiso al encabezar una clínica especializada para arqueras y arqueros de distintas edades en el Gimnasio Municipal Lo Espejo.',
        ],
      },
      {
        titulo: 'Su historia con el Internacional Lo Espejo',
        parrafos: [
          'Desde hace varios años, Toño Espinoza forma parte de la familia del Inter, aportando su enorme experiencia al crecimiento deportivo del club. Su presencia representa mucho más que la de un entrenador: es contar con la experiencia de un hombre que defendió durante años la camiseta de Chile y que conoce desde dentro las exigencias del alto rendimiento. Pero, por sobre todo, significa tener cerca a un maestro.',
        ],
      },
      {
        titulo: 'Un legado que continúa',
        parrafos: [
          'Su historia está llena de grandes partidos, Mundiales, títulos, viajes y experiencias internacionales. Sin embargo, quizás su mayor legado se encuentre hoy en algo mucho más sencillo: cada niño y niña a quien enseña, cada arquero al que corrige, cada jugador al que aconseja y cada deportista al que ayuda a crecer. Porque las leyendas no se construyen solamente con medallas; también se construyen enseñando, compartiendo y dejando una huella en quienes vienen detrás.',
        ],
      },
    ],
  },

  'facundo-oyola': {
    clinicas: [],
    videos: [],
    secciones: [
      {
        titulo: 'Un formador que deja huella en el hockey sobre patines',
        parrafos: [
          'Facundo Oyola, conocido cariñosamente como «El Facu», es un entrenador y formador de hockey sobre patines que ha dedicado gran parte de su trayectoria al desarrollo de nuevas generaciones de deportistas. Su trabajo se ha caracterizado no solo por la enseñanza de los aspectos técnicos y tácticos del hockey, sino también por transmitir valores como el compromiso, la disciplina, el respeto, el compañerismo y, sobre todo, el amor por este deporte.',
          'A lo largo de su trayectoria ha trabajado con distintas categorías formativas, acompañando a niños, niñas y jóvenes en sus primeros pasos sobre los patines y también en etapas de mayor exigencia competitiva.',
        ],
      },
      {
        titulo: 'Su paso por Independiente La Florida',
        parrafos: [
          'Uno de sus períodos destacados fue su trabajo en Independiente La Florida (IDF), donde estuvo ligado a categorías formativas y participó en competencias nacionales e internacionales. En 2023 dirigió al equipo Sub 15 Femenino de IDF en el Torneo Richet Zapata, disputado en San Juan, Argentina.',
        ],
      },
      {
        titulo: 'Una nueva etapa: Internacional Lo Espejo',
        parrafos: [
          'A fines de 2025, Facundo Oyola comenzó una nueva etapa al incorporarse al Inter — y al equipo técnico de su propio padre, Rodolfo «Rolo» Oyola. Su llegada significa sumar experiencia, conocimientos y una mirada formativa a un proyecto que busca seguir creciendo.',
          'Su desafío es continuar formando deportistas, ayudándolos a crecer dentro de la pista, pero también fuera de ella. Porque para Facundo, formar un jugador no significa solamente enseñarle a patinar, pasar o marcar: significa también enseñarle a trabajar en equipo, superar las dificultades, respetar al rival y nunca dejar de luchar por sus sueños.',
        ],
      },
      {
        titulo: 'Un entrenador, un formador y parte de una familia',
        parrafos: [
          'El Inter recibe a un entrenador con experiencia, pero sobre todo a una persona que entiende que detrás de cada camiseta existe un niño, una niña, una familia y un sueño. Hoy, su nombre forma parte de una nueva etapa del club, con el desafío de seguir construyendo, formando y dejando huella en las nuevas generaciones del hockey — codo a codo con su padre.',
        ],
      },
    ],
  },
}
