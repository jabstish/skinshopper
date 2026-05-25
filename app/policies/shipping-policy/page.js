import PolicyLayout from '@/components/PolicyLayout';

export const metadata = {
  title: 'Verzendbeleid — SKINSHOPPER',
  description: 'Gratis verzending vanaf €60. Voor 22:00 besteld, volgende werkdag in huis. Lees alles over levertijden, verzendkosten en bezorgopties.',
};

export default function ShippingPolicy() {
  return (
    <PolicyLayout title="Verzendbeleid">

      <h2>Verwerkingstijd</h2>
      <p>Alle bestellingen worden binnen <strong>1–2 werkdagen</strong> verwerkt na ontvangst van de betaling. Bestellingen geplaatst in het weekend of op feestdagen worden verwerkt op de eerstvolgende werkdag.</p>

      <h2>Levertijd</h2>
      <p>De standaard levertijd is <strong>5–10 werkdagen</strong>. In uitzonderlijke omstandigheden kan de levering vertraging oplopen door problemen bij de vervoerder of door een hoog bestellingsvolume.</p>

      <h2>Verzendkosten</h2>
      <p>De verzendkosten worden weergegeven tijdens het afrekenen op basis van jouw locatie en het gewicht van de bestelling. Wij bieden periodiek gratis verzending aan boven een bepaald bestelbedrag — bekijk onze actuele acties op de website.</p>
      <p>Bestellingen boven <strong>€60</strong> worden standaard gratis verzonden.</p>

      <h2>Track & Trace</h2>
      <p>Zodra jouw bestelling is verzonden, ontvang je een e-mail met de trackinginformatie. Hiermee kun je jouw pakket gedurende de gehele bezorging volgen.</p>

      <h2>Verzendadres</h2>
      <p>Je bent zelf verantwoordelijk voor het opgeven van een correct en volledig bezorgadres. Wij zijn niet aansprakelijk voor vertraging of verlies als gevolg van onjuiste adresgegevens.</p>

      <h2>Niet bezorgde pakketten</h2>
      <p>Als een pakket niet bezorgd kan worden door een fout in het adres of omdat het pakket niet is opgehaald, kunnen er extra kosten in rekening worden gebracht voor een nieuwe verzending.</p>

      <h2>Verlies of schade</h2>
      <p>Heb je jouw pakket niet ontvangen of is het beschadigd aangekomen? Neem dan direct contact op met onze klantenservice zodat wij een passende oplossing kunnen bieden.</p>

      <h2>Contact</h2>
      <p>Heb je vragen over je bestelling of verzending? Neem contact met ons op:</p>
      <p>
        <strong>E-mail:</strong> info@skinshopper.nl<br />
        <strong>Telefoon / WhatsApp:</strong> +31 85 060 2645
      </p>

    </PolicyLayout>
  );
}
