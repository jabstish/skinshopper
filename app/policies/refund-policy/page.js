import PolicyLayout from '@/components/PolicyLayout';

export const metadata = {
  title: 'Retourbeleid — SKINSHOPPER',
  description: 'Niet tevreden? Retourneer je bestelling kosteloos binnen 30 dagen. Lees hier alles over ons retourbeleid en hoe je een retour aanmeldt.',
};

export default function RefundPolicy() {
  return (
    <PolicyLayout title="Retourbeleid">

      <h2>Herroepingsrecht</h2>
      <p>Je hebt het recht om je bestelling binnen <strong>14 dagen na ontvangst</strong> te annuleren zonder opgave van reden. Na annulering heb je nog 14 dagen om het product retour te sturen.</p>

      <h2>Voorwaarden voor retour</h2>
      <p>Om in aanmerking te komen voor een retour moet het artikel voldoen aan de volgende voorwaarden:</p>
      <ul>
        <li>Het product is ongebruikt en onbeschadigd</li>
        <li>Het product is in de originele verpakking</li>
        <li>Alle meegeleverde onderdelen zijn aanwezig</li>
      </ul>

      <h2>Uitzonderingen</h2>
      <p>Om hygiënische redenen kunnen de volgende producten <strong>niet worden geretourneerd</strong> als de verzegeling verbroken is:</p>
      <ul>
        <li>Geopende cosmetica en huidverzorgingsproducten</li>
        <li>Producten die zijn gebruikt of getest</li>
      </ul>

      <h2>Retour aanmelden</h2>
      <p>Om een retour aan te melden, neem je contact op met onze klantenservice via e-mail. Vermeld je naam, ordernummer en (optioneel) de reden voor retour. Je ontvangt dan verdere instructies.</p>
      <p><strong>E-mail:</strong> cosmax@hotmail.com</p>

      <h2>Retourkosten</h2>
      <p>De kosten voor retourzending zijn voor eigen rekening, tenzij het product beschadigd of verkeerd geleverd is. In dat geval vergoeden wij de retourkosten.</p>

      <h2>Terugbetaling</h2>
      <p>Zodra wij de retour in goede staat hebben ontvangen, verwerken wij de terugbetaling binnen <strong>5–10 werkdagen</strong> via de oorspronkelijke betaalmethode.</p>

      <h2>Verwerkingstijd</h2>
      <p>Retourzendingen worden verwerkt binnen enkele werkdagen na ontvangst. Je ontvangt een bevestiging per e-mail zodra de terugbetaling is verwerkt.</p>

      <h2>Contact</h2>
      <p>Heb je vragen over je retour? Neem contact met ons op:</p>
      <p>
        <strong>E-mail:</strong> cosmax@hotmail.com
      </p>

    </PolicyLayout>
  );
}
