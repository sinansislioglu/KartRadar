import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

const PRIVACY_POLICY = `Son güncelleme: 13 Mart 2026

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
Sorularınız için: kartradar.app@gmail.com`;

const TERMS_OF_USE = `Son güncelleme: 13 Mart 2026

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
Sorularınız için: kartradar.app@gmail.com`;

export default function LegalScreen({ route }) {
  const theme = useTheme();
  const { type } = route.params;
  const isPrivacy = type === 'privacy';
  const content = isPrivacy ? PRIVACY_POLICY : TERMS_OF_USE;
  const title = isPrivacy ? 'Gizlilik Politikası' : 'Kullanım Koşulları';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>{content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  body: { fontSize: 15, lineHeight: 24 },
});
