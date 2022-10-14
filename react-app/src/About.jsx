import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const About = () => {
  return (
    <div className="about">
      <Container>
        <Row>
          <Col>
            <h1 className="title">About Us</h1>
            <h2>Who are we?</h2>
            <p>
              Et Procent is a grassroots campaign aiming to change
              the government's intentions to suspend its foreign aid
              commitments. 
            </p>

            <h2>Why are we doing this?</h2>
            <p>
              Sweden is historically a <a href="https://cgdev.org/quoda-2021">fantastic</a> distributor of international aid.
              The Swedish people don't want aid to be cut - a <a href="https://www.sida.se/om-sida/opinion-om-bistandet">majority</a> of Swedes (54%) think the current level of aid should increase or stay the same.
              And yet, the government plans on reducing the international aid budget.
              We think that something should be done about it.
            </p>
            <h2>Why complete the survey?</h2>
            <p>
              We have researched the most effective ways to persuade our MPs to
              carry the right message to the government. We created the survey
              so that people could create compelling emails and letters to write
              to their MP, that makes use of our research while incorporating
              their beliefs and wishes. We hope this will make it easier for
              constituents to contact their MPs about the foreign aid
              commitment.
            </p>
            <h2>Why do we ask for your personal information in the survey?</h2>
            <p>
              We collect your information primarily to complete the email that
              is generated at the end of the survey. MPs can only make enquiries
              on behalf of their constituents, so the email needs to include
              this information so they can recognise you as a constituent.
            </p>
            <p>
              We collect your email address to contact you according to your
              choices during the survey. For example, if you said you would like
              to request a meeting with your MP, then we will use your email
              address to help support you with your meeting.
            </p>
            <p>
              We will not share your personal information with third party
              marketers/advertisers, we promise we will not send you spam or
              fundraising emails, and you control how we use your personal data.
              Our survey, website and email platform use encryption when
              collecting data and are highly secure, so your data is safe. You
              can read more about data privacy in our policy
              <a href="https://www.etprocent.se/privacy-policy"> here</a>.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
