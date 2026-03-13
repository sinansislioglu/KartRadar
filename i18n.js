import { getLocales } from 'expo-localization';

const deviceLang = getLocales()?.[0]?.languageCode || 'en';
const locale = ['tr', 'en', 'es'].includes(deviceLang) ? deviceLang : 'en';

const translations = {
  tr: {
    'nav.home': 'Kart Radar',
    'nav.teams': 'Takımlar',
    'nav.players': 'Oyuncular',

    'league.championsLeague': 'Şampiyonlar Ligi',
    'league.europaLeague': 'Avrupa Ligi',
    'league.conferenceLeague': 'Konferans Ligi',
    'league.cardLimit': '{n} kart sınırı',
    'league.privacyPolicy': 'Gizlilik Politikası',
    'league.termsOfUse': 'Kullanım Koşulları',

    'error.title': 'Bağlantı hatası',
    'error.subtitle': 'Veriler yüklenemedi. Lütfen tekrar deneyin.',
    'error.retry': 'Tekrar Dene',

    'players.loading': 'Kart verileri yükleniyor...',
    'players.matchCount': '{n} maçtan hesaplandı',
    'players.clean': 'Temiz!',
    'players.noPlayersAtLimit': 'Kart sınırında oyuncu yok',
    'players.cardCount': '{y} / {max} kart',
    'players.oneCardPenalty': '1 kart = ceza',

    'legal.privacyTitle': 'Gizlilik Politikası',
    'legal.termsTitle': 'Kullanım Koşulları',
    'legal.privacyContent': `Son güncelleme: 13 Mart 2026

KartRadar uygulaması ("Uygulama") olarak gizliliğinize saygı duyuyoruz.

1. Toplanan Veriler
Uygulama herhangi bir kişisel veri toplamaz, saklamaz veya üçüncü taraflarla paylaşmaz. Uygulama yalnızca herkese açık futbol istatistiklerini görüntüler.

2. Üçüncü Taraf Hizmetler
Uygulama, futbol verilerini ESPN API üzerinden çeker. Bu veriler herkese açık istatistiklerdir ve kişisel bilgi içermez.

3. Çerezler ve İzleme
Uygulama çerez kullanmaz ve kullanıcı aktivitesini izlemez.

4. Çocukların Gizliliği
Uygulama çocuklardan kişisel bilgi toplamaz.

5. Değişiklikler
Bu gizlilik politikası zaman zaman güncellenebilir. Güncellemeler uygulama içinden yayınlanacaktır.

6. İletişim
Sorularınız için: kartradar.app@gmail.com`,

    'legal.termsContent': `Son güncelleme: 13 Mart 2026

KartRadar uygulamasını ("Uygulama") kullanarak aşağıdaki koşulları kabul etmiş olursunuz.

1. Hizmet Tanımı
KartRadar, futbol liglerinde sarı kart sınırındaki oyuncuları takip eden bir bilgi uygulamasıdır. Veriler ESPN API'den alınmaktadır.

2. Veri Doğruluğu
Uygulama üçüncü taraf kaynaklardan veri çekmektedir. Verilerin %100 doğruluğu garanti edilmez. Bahis veya mali kararlar için kullanılmamalıdır.

3. Kullanım Koşulları
- Uygulamayı yalnızca kişisel ve ticari olmayan amaçlarla kullanabilirsiniz.
- Uygulamayı kötüye kullanmak, tersine mühendislik yapmak yasaktır.

4. Sorumluluk Reddi
Uygulama "olduğu gibi" sunulmaktadır. Veri hataları veya kesintilerden dolayı sorumluluk kabul edilmez.

5. Fikri Mülkiyet
KartRadar adı ve logosu uygulama sahibine aittir. Lig ve takım logoları ilgili kuruluşlara aittir.

6. Değişiklikler
Bu koşullar önceden bildirimde bulunmaksızın değiştirilebilir.

7. İletişim
Sorularınız için: kartradar.app@gmail.com`,
  },

  en: {
    'nav.home': 'Kart Radar',
    'nav.teams': 'Teams',
    'nav.players': 'Players',

    'league.championsLeague': 'Champions League',
    'league.europaLeague': 'Europa League',
    'league.conferenceLeague': 'Conference League',
    'league.cardLimit': '{n} card limit',
    'league.privacyPolicy': 'Privacy Policy',
    'league.termsOfUse': 'Terms of Use',

    'error.title': 'Connection error',
    'error.subtitle': 'Could not load data. Please try again.',
    'error.retry': 'Try Again',

    'players.loading': 'Loading card data...',
    'players.matchCount': 'Calculated from {n} matches',
    'players.clean': 'All Clear!',
    'players.noPlayersAtLimit': 'No players at card limit',
    'players.cardCount': '{y} / {max} cards',
    'players.oneCardPenalty': '1 card = ban',

    'legal.privacyTitle': 'Privacy Policy',
    'legal.termsTitle': 'Terms of Use',
    'legal.privacyContent': `Last updated: March 13, 2026

KartRadar ("App") respects your privacy.

1. Data Collected
The App does not collect, store, or share any personal data. The App only displays publicly available football statistics.

2. Third-Party Services
The App fetches football data from the ESPN API. This data consists of publicly available statistics and does not contain personal information.

3. Cookies and Tracking
The App does not use cookies and does not track user activity.

4. Children's Privacy
The App does not collect personal information from children.

5. Changes
This privacy policy may be updated from time to time. Updates will be published within the app.

6. Contact
For questions: kartradar.app@gmail.com`,

    'legal.termsContent': `Last updated: March 13, 2026

By using the KartRadar application ("App"), you agree to the following terms.

1. Service Description
KartRadar is an informational app that tracks players at risk of yellow card suspension in football leagues. Data is sourced from the ESPN API.

2. Data Accuracy
The App fetches data from third-party sources. 100% accuracy of the data is not guaranteed. It should not be used for betting or financial decisions.

3. Terms of Use
- You may only use the App for personal and non-commercial purposes.
- Misuse of the App or reverse engineering is prohibited.

4. Disclaimer
The App is provided "as is." No liability is accepted for data errors or interruptions.

5. Intellectual Property
The KartRadar name and logo belong to the app owner. League and team logos belong to their respective organizations.

6. Changes
These terms may be changed without prior notice.

7. Contact
For questions: kartradar.app@gmail.com`,
  },

  es: {
    'nav.home': 'Kart Radar',
    'nav.teams': 'Equipos',
    'nav.players': 'Jugadores',

    'league.championsLeague': 'Liga de Campeones',
    'league.europaLeague': 'Liga Europa',
    'league.conferenceLeague': 'Liga Conferencia',
    'league.cardLimit': 'Límite de {n} tarjetas',
    'league.privacyPolicy': 'Política de Privacidad',
    'league.termsOfUse': 'Términos de Uso',

    'error.title': 'Error de conexión',
    'error.subtitle': 'No se pudieron cargar los datos. Inténtelo de nuevo.',
    'error.retry': 'Reintentar',

    'players.loading': 'Cargando datos de tarjetas...',
    'players.matchCount': 'Calculado a partir de {n} partidos',
    'players.clean': '¡Todo limpio!',
    'players.noPlayersAtLimit': 'Ningún jugador en el límite de tarjetas',
    'players.cardCount': '{y} / {max} tarjetas',
    'players.oneCardPenalty': '1 tarjeta = sanción',

    'legal.privacyTitle': 'Política de Privacidad',
    'legal.termsTitle': 'Términos de Uso',
    'legal.privacyContent': `Última actualización: 13 de marzo de 2026

KartRadar ("Aplicación") respeta su privacidad.

1. Datos Recopilados
La Aplicación no recopila, almacena ni comparte ningún dato personal. La Aplicación solo muestra estadísticas de fútbol disponibles públicamente.

2. Servicios de Terceros
La Aplicación obtiene datos de fútbol de la API de ESPN. Estos datos son estadísticas disponibles públicamente y no contienen información personal.

3. Cookies y Seguimiento
La Aplicación no utiliza cookies y no rastrea la actividad del usuario.

4. Privacidad de los Niños
La Aplicación no recopila información personal de niños.

5. Cambios
Esta política de privacidad puede actualizarse de vez en cuando. Las actualizaciones se publicarán dentro de la aplicación.

6. Contacto
Para preguntas: kartradar.app@gmail.com`,

    'legal.termsContent': `Última actualización: 13 de marzo de 2026

Al usar la aplicación KartRadar ("Aplicación"), acepta los siguientes términos.

1. Descripción del Servicio
KartRadar es una aplicación informativa que rastrea a los jugadores en riesgo de suspensión por tarjetas amarillas en las ligas de fútbol. Los datos provienen de la API de ESPN.

2. Exactitud de los Datos
La Aplicación obtiene datos de fuentes de terceros. No se garantiza la exactitud al 100% de los datos. No debe usarse para apuestas o decisiones financieras.

3. Términos de Uso
- Solo puede usar la Aplicación con fines personales y no comerciales.
- Está prohibido el uso indebido de la Aplicación o la ingeniería inversa.

4. Descargo de Responsabilidad
La Aplicación se proporciona "tal cual". No se acepta responsabilidad por errores de datos o interrupciones.

5. Propiedad Intelectual
El nombre y el logotipo de KartRadar pertenecen al propietario de la aplicación. Los logotipos de ligas y equipos pertenecen a sus respectivas organizaciones.

6. Cambios
Estos términos pueden modificarse sin previo aviso.

7. Contacto
Para preguntas: kartradar.app@gmail.com`,
  },
};

export function t(key, params) {
  let str = translations[locale]?.[key] || translations['en'][key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v));
    });
  }
  return str;
}

export { locale };
