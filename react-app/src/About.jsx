import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const About = () => {
  return (
    <div className="about">
      <Container>
        <Row>
          <Col>
            <h1 className="title">Om oss</h1>
            <h2>Vilka är vi?</h2>
            <p>
              Et Procent är en gräsrotskampanj som syftar till att förändra regeringens avsikt att avbryta sitt utländska bistånd åtaganden. 
            </p>

            <h2>Varför gör vi detta?</h2>
            <p>
              Sverige är historiskt sett en <a href="https://cgdev.org/quoda-2021">fantastisk</a> distributör av internationellt bistånd.
              Svenska folket vill inte att biståndet ska minskas - en <a href="https://www.sida.se/om-sida/opinion-om-bistandet">majoritet</a> av svenskarna (54 %) anser att den nuvarande biståndsnivån bör öka eller förbli oförändrad.
              Ändå planerar regeringen att minska budgeten för det internationella biståndet.
              Vi anser att något bör göras åt detta.
            </p>
            <h2>Varför fylla i enkäten?</h2>
            <p>
              Vi har undersökt de mest effektiva sätten att övertala våra parlamentsledamöter att
              föra fram rätt budskap till regeringen. Vi har skapat enkäten
              så att människor kan skapa övertygande e-postmeddelanden och brev som de kan skriva till
              till sina parlamentsledamöter, som utnyttjar vår forskning samtidigt som de innehåller
              deras övertygelser och önskemål. Vi hoppas att detta kommer att göra det lättare för
              väljare att kontakta sina parlamentsledamöter om det utländska biståndet.
            </p>
            <h2>Varför ber vi om dina personuppgifter i undersökningen?</h2>
            <p>
              Vi samlar in dina uppgifter i första hand för att kunna fylla i det e-postmeddelande som
              genereras i slutet av undersökningen. Parlamentsledamöter kan endast göra förfrågningar
              på uppdrag av sina väljare, så e-postmeddelandet måste innehålla
              denna information så att de kan känna igen dig som väljare.
            </p>
            <p>
              Vi samlar in din e-postadress för att kontakta dig enligt din
              val under undersökningen. Om du till exempel har sagt att du vill
              to request a meeting with your MP, then we will use your email
              address to help support you with your meeting.
            </p>
            <p>
              Vi kommer inte att dela din personliga information med tredjepartsmarknadsförare/annonsörer, vi lovar att vi inte kommer att skicka dig spam eller insamlingsmeddelanden, och du kontrollerar hur vi använder dina personuppgifter. Vår undersökning, webbplats och e-postplattform använder kryptering när vi samlar in data och är mycket säkra, så din data är säker. Du kan läsa mer om datasekretess i vår policy <a href="https://www.1procent.nu/integritetspolicy"> här</a>.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
