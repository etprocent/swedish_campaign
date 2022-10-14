import { Link } from "@reach/router";
import React from "react";
import { Col, Row, Container } from "react-bootstrap";

const Footer = () => (
  <div className="footer" id="Footer">
    <Container>
      {/* <Row> */}
      <Col>
        <Link to="om">Om</Link>
        <Link to="integritetspolicy">Integritetspolicy</Link>
      </Col>
      {/* </Row> */}
    </Container>
  </div>
);
export default Footer;
